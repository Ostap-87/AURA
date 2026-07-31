#!/usr/bin/env bash
# Добавляет проксирование /api/deploy-webhook в конфиг nginx поверх того,
# что уже настроил certbot (SSL-блок и редиректы 80->443). Запускать один
# раз, ПОСЛЕ успешного certbot --nginx -d aura-robotics.ru -d www.aura-robotics.ru.
# Содержимое ниже — точная копия текущего /etc/nginx/sites-available/aura
# (полученная через cat) с добавленным location для вебхука.
set -e

cat > /etc/nginx/sites-available/aura <<'EOF'
server {
    server_name aura-robotics.ru www.aura-robotics.ru;

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

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/aura-robotics.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/aura-robotics.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = www.aura-robotics.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = aura-robotics.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name aura-robotics.ru www.aura-robotics.ru;
    return 404; # managed by Certbot


}
EOF

nginx -t
systemctl reload nginx

echo ""
echo "=== ГОТОВО ==="
echo "Проверка: curl -I https://aura-robotics.ru/api/deploy-webhook"
