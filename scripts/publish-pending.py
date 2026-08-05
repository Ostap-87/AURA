#!/usr/bin/env python3
"""Publishes content/pending/*.json to Telegram, called from deploy.sh after
a successful build. Same pattern as globaltechtour.ru's content-publish
pipeline: write a JSON file with a topic/article, commit, push — this
script picks it up on the next deploy and sends it.

Idempotent across redeploys: each slug (the filename) is recorded in a
local SQLite DB once published; `git reset --hard` in deploy.sh doesn't
touch this DB since it lives outside the repo. A failed send is retried
on the next deploy; only a confirmed 'published' status is treated as
done.
"""
import json
import os
import sqlite3
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from telegram_client import publish_item

APP_DIR = "/opt/aura"
ENV_FILE = "/etc/aura-telegram.env"
DB_PATH = "/var/lib/content-publish/aura-history.db"
PENDING_DIR = os.path.join(APP_DIR, "content", "pending")


def load_env_file(path):
    values = {}
    if not os.path.exists(path):
        return values
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            values[key.strip()] = value.strip()
    return values


def main():
    env = load_env_file(ENV_FILE)
    bot_token = env.get("TELEGRAM_BOT_TOKEN")
    chat_id = env.get("TELEGRAM_CHAT_ID")
    if not bot_token or not chat_id:
        print(f"publish-pending: {ENV_FILE} missing or incomplete, skipping")
        return

    if not os.path.isdir(PENDING_DIR):
        return

    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project TEXT NOT NULL,
            channel TEXT NOT NULL,
            title TEXT,
            text TEXT NOT NULL,
            status TEXT NOT NULL,
            error TEXT,
            created_at INTEGER NOT NULL,
            slug TEXT UNIQUE
        )
        """
    )

    for filename in sorted(os.listdir(PENDING_DIR)):
        if not filename.endswith(".json"):
            continue
        slug = filename[: -len(".json")]
        existing = conn.execute(
            "SELECT status FROM posts WHERE slug = ? AND channel = 'telegram'", (slug,)
        ).fetchone()
        if existing and existing[0] == "published":
            continue  # only a confirmed success is final; retry anything else

        with open(os.path.join(PENDING_DIR, filename)) as f:
            item = json.load(f)

        text = item.get("text")
        if not text:
            print(f"publish-pending: skipping {filename}, no 'text' field")
            continue

        # Optional cover media: "image" or "video" is a fully-qualified
        # https:// URL (Telegram fetches it itself, so it must already be
        # live — i.e. committed under public/ in the same push as this
        # pending file, so the build serves it before this code runs).
        media_url = item.get("image") or item.get("video")
        media_kind = "video" if item.get("video") else "photo"
        ok, detail = publish_item(bot_token, chat_id, text, media_url, media_kind)
        conn.execute(
            "INSERT INTO posts (project, channel, title, text, status, error, created_at, slug) "
            "VALUES (?, 'telegram', ?, ?, ?, ?, ?, ?) "
            "ON CONFLICT(slug) DO UPDATE SET status = excluded.status, error = excluded.error, "
            "created_at = excluded.created_at",
            (
                item.get("project", "aura-robotics"),
                item.get("title"),
                text,
                "published" if ok else "failed",
                None if ok else detail,
                int(time.time()),
                slug,
            ),
        )
        conn.commit()
        print(f"publish-pending[{slug}]: {'OK' if ok else 'FAILED — ' + detail}")

    conn.close()


if __name__ == "__main__":
    main()
