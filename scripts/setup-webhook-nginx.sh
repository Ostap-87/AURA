#!/usr/bin/env bash
# Настраивает nginx для aura-robotics.ru: проксирование сайта и вебхука
# деплоя, плюс редирект www -> apex-домен на HTTP и HTTPS (canonical-домен
# сайта — aura-robotics.ru без www, см. NEXT_PUBLIC_SITE_URL). Использует
# уже выпущенный certbot-ом сертификат на оба хоста. Безопасно запускать
# повторно — просто перезаписывает файл этим же содержимым.
set -e

cat > /etc/nginx/sites-available/aura <<'EOF'
server {
    listen 443 ssl;
    server_name aura-robotics.ru;

    ssl_certificate /etc/letsencrypt/live/aura-robotics.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aura-robotics.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/deploy-webhook {
        proxy_pass http://127.0.0.1:9001;
        proxy_set_header Host $host;
    }

    # Generated media (cover images/video for blog + Telegram posts) lives
    # outside the git-managed app dir on purpose — a redeploy's `git reset
    # --hard` would wipe anything dropped inside the repo checkout.
    # /var/www/aura-media is never touched by the deploy pipeline.
    location /media/ {
        alias /var/www/aura-media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 443 ssl;
    server_name www.aura-robotics.ru;

    ssl_certificate /etc/letsencrypt/live/aura-robotics.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aura-robotics.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://aura-robotics.ru$request_uri;
}

server {
    listen 80;
    server_name aura-robotics.ru www.aura-robotics.ru;
    return 301 https://aura-robotics.ru$request_uri;
}
EOF

nginx -t
systemctl reload nginx

echo ""
echo "=== ГОТОВО ==="
echo "Проверка вебхука:   curl -I https://aura-robotics.ru/api/deploy-webhook"
echo "Проверка редиректа: curl -I http://www.aura-robotics.ru"
