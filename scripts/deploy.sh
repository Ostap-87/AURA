#!/usr/bin/env bash
# Обновление сайта на сервере: подтянуть свежий код из main, пересобрать,
# перезапустить. Вызывается вручную или из scripts/deploy-webhook.js.
set -e

APP_DIR="/opt/aura"
ENV_FILE="/etc/aura-lead.env"
cd "$APP_DIR"

echo "=== git pull ==="
git fetch origin
git reset --hard origin/main

echo "=== npm install ==="
npm install

# NEXT_PUBLIC_* переменные (GA_ID и т.п.) вшиваются в бандл на этапе сборки,
# а не читаются заново при старте сервера — systemd's EnvironmentFile
# покрывает только `next start`, не эту сборку. Без явного экспорта здесь
# каждый новый деплой тихо откатывал бы аналитику на пустой ID.
if [ -f "$ENV_FILE" ]; then
  echo "=== экспортируем $ENV_FILE для сборки ==="
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

echo "=== npm run build ==="
npm run build

echo "=== restart aura ==="
systemctl restart aura

echo "=== publish pending content ==="
python3 "$APP_DIR/scripts/publish-pending.py" || true

echo "=== generate pending images ==="
python3 "$APP_DIR/scripts/generate-pending-images.py" || true

echo "Деплой завершён: $(date -Iseconds)"
