#!/usr/bin/env bash
# Разовая настройка еженедельной автоматической пересборки сайта — подхватывает
# новые компании и правки из Google Таблицы без ручного деплоя или пуша в git.
# Запуск на сервере: bash /opt/aura/scripts/setup-weekly-rebuild.sh
set -e

CRON_LINE="0 3 * * 1 /usr/bin/bash /opt/aura/scripts/deploy.sh >> /var/log/aura-deploy.log 2>&1"

if crontab -l 2>/dev/null | grep -qF "/opt/aura/scripts/deploy.sh"; then
  echo "Задача в cron для deploy.sh уже есть, пропускаю."
else
  # crontab -l завершается с ошибкой, если крон пуст — это ожидаемо (первый
  # запуск), поэтому "|| true", иначе set -e обрывает подстановку раньше,
  # чем допишется CRON_LINE, и в crontab ничего не попадает.
  (crontab -l 2>/dev/null || true; echo "$CRON_LINE") | crontab -
  echo "Добавлена задача cron: пересборка каждый понедельник в 03:00 (время сервера)."
fi

echo ""
echo "=== ГОТОВО ==="
echo "Текущий crontab:"
crontab -l || true
echo ""
echo "Логи пересборки: tail -f /var/log/aura-deploy.log"
