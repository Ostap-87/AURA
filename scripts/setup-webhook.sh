#!/usr/bin/env bash
# Разовая настройка автодеплоя по вебхуку от GitHub.
# Запуск (на сервере, где уже развёрнут /opt/aura):
#   bash /opt/aura/scripts/setup-webhook.sh СЕКРЕТ
# Значение СЕКРЕТ нужно потом указать в настройках вебхука на GitHub.
set -e

SECRET="$1"
if [ -z "$SECRET" ]; then
  echo "Использование: bash setup-webhook.sh СЕКРЕТ"
  exit 1
fi

APP_DIR="/opt/aura"
PORT=9001

chmod +x "$APP_DIR/scripts/deploy.sh"

cat > /etc/systemd/system/aura-deploy-webhook.service <<EOF
[Unit]
Description=Aura Robotics deploy webhook listener
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/node ${APP_DIR}/scripts/deploy-webhook.cjs
Restart=always
RestartSec=5
Environment=WEBHOOK_SECRET=${SECRET}
Environment=WEBHOOK_PORT=${PORT}

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable aura-deploy-webhook
systemctl restart aura-deploy-webhook

echo ""
echo "=== ГОТОВО ==="
echo "Слушатель вебхука запущен на порту ${PORT}."
echo "Проверка:  systemctl status aura-deploy-webhook --no-pager"
echo "Логи:      journalctl -u aura-deploy-webhook -n 50 --no-pager"
