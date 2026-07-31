#!/usr/bin/env bash
# Разовая настройка чистого VPS (Ubuntu) под сайт aura-robotics.ru: своп,
# Node.js, nginx, клон репозитория, сборка, systemd-сервис, реверс-прокси.
# Запуск: curl -fsSL <raw-url-этого-файла> -o setup.sh && bash setup.sh
set -e

REPO_URL="https://github.com/Ostap-87/AURA.git"
APP_DIR="/opt/aura"
DOMAIN_PRIMARY="aura-robotics.ru"
DOMAIN_WWW="www.aura-robotics.ru"

echo "=== apt update ==="
apt-get update -y

echo "=== Своп-файл (2G) ==="
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "Swap создан."
else
  echo "Swap уже есть, пропускаю."
fi
free -h

echo "=== Node.js 20 LTS ==="
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "Node.js уже установлен."
fi
node -v
npm -v

echo "=== nginx, git ==="
apt-get install -y nginx git

echo "=== Код сайта ==="
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin
  git reset --hard origin/main
else
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

echo "=== .env ==="
if [ ! -f "$APP_DIR/.env" ]; then
  cat > "$APP_DIR/.env" <<EOF
NEXT_PUBLIC_SITE_URL=https://${DOMAIN_PRIMARY}
EOF
  echo "Создан .env с базовым NEXT_PUBLIC_SITE_URL."
else
  echo ".env уже существует, не трогаю."
fi

echo "=== npm install ==="
cd "$APP_DIR"
npm install

echo "=== npm run build ==="
npm run build

echo "=== systemd-сервис aura.service ==="
cat > /etc/systemd/system/aura.service <<EOF
[Unit]
Description=Aura Robotics Next.js app
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable aura
systemctl restart aura

echo "=== nginx: реверс-прокси ==="
# Файл не трогаем, если он уже есть: после первого запуска certbot дописывает
# в него SSL-блок, и перезапись этим шаблоном на каждом повторном запуске
# скрипта стирала бы HTTPS-настройки.
if [ ! -f /etc/nginx/sites-available/aura ]; then
  cat > /etc/nginx/sites-available/aura <<EOF
server {
    listen 80;
    server_name ${DOMAIN_PRIMARY} ${DOMAIN_WWW};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
else
  echo "nginx-конфиг уже существует, не перезаписываю (там могут быть правки certbot)."
fi

ln -sf /etc/nginx/sites-available/aura /etc/nginx/sites-enabled/aura
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo ""
echo "=== ГОТОВО ==="
echo "Проверка сервиса:  systemctl status aura --no-pager"
echo "Проверка сайта:    curl -I http://localhost:3000"
echo "Логи при проблемах: journalctl -u aura -n 50 --no-pager"
