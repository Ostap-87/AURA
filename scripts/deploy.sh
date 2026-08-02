#!/usr/bin/env bash
# Обновление сайта на сервере: подтянуть свежий код из main, пересобрать,
# перезапустить. Вызывается вручную или из scripts/deploy-webhook.js.
set -e

APP_DIR="/opt/aura"
cd "$APP_DIR"

echo "=== git pull ==="
git fetch origin
git reset --hard origin/main

echo "=== npm install ==="
npm install

echo "=== npm run build ==="
npm run build

echo "=== restart aura ==="
systemctl restart aura

echo "=== publish pending content ==="
python3 "$APP_DIR/scripts/publish-pending.py" || true

echo "Деплой завершён: $(date -Iseconds)"
