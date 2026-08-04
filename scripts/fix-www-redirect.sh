#!/usr/bin/env bash
# Добавляет 301-редирект www.aura-robotics.ru -> aura-robotics.ru.
# До этого www отдавал точно такой же контент, что и без-www (см.
# setup-webhook-nginx.sh) — из-за этого Яндекс.Вебмастер видел два адреса
# с одинаковым содержимым как отдельные сайты. Запускать один раз, ПОСЛЕ
# setup-webhook-nginx.sh, через SSH на VPS от имени root.
set -e

cat > /etc/nginx/sites-available/aura <<'EOF'
server {
    server_name aura-robotics.ru;

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
    server_name www.aura-robotics.ru;

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/aura-robotics.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aura-robotics.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://aura-robotics.ru$request_uri;
}

server {
    if ($host = www.aura-robotics.ru) {
        return 301 https://aura-robotics.ru$request_uri;
    }

    if ($host = aura-robotics.ru) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name aura-robotics.ru www.aura-robotics.ru;
    return 404;
}
EOF

nginx -t
systemctl reload nginx

echo ""
echo "=== ГОТОВО ==="
echo "Проверка: curl -I https://www.aura-robotics.ru/  (должен вернуть 301 -> https://aura-robotics.ru/)"
