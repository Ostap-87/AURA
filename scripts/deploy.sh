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

# Telegram posts are NOT published from here — see
# claude-control's data/editorial-policy.md ("Доставка в канал в
# момент слота"). That used to run scripts/publish-pending.py against
# content/pending/*.json after every deploy, but a post physically
# couldn't go out until this (sometimes slow) build finished. The
# current path is data/tg-queue/aura/ -> data/tg-publish/aura/ in the
# claude-control repo, delivered straight to Telegram by
# command-poller.py — independent of this deploy. Do not reintroduce
# a content/pending-based Telegram publish step here.

echo "=== generate pending images ==="
python3 "$APP_DIR/scripts/generate-pending-images.py" || true

echo "Деплой завершён: $(date -Iseconds)"
