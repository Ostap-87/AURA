#!/usr/bin/env python3
"""Generates content/pending-images/*.json requests via Higgsfield, called
from deploy.sh after a successful build. Same pattern as publish-pending.py
for Telegram posts — write a JSON request, commit, push, this script picks
it up on the next deploy. See image_gen.py for the actual generation logic.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from image_gen import process_pending_images

APP_DIR = "/opt/aura"
PENDING_IMAGES_DIR = os.path.join(APP_DIR, "content", "pending-images")
MEDIA_DIR = "/var/www/aura-media"
IMAGE_DB_PATH = "/var/lib/content-publish/aura-images-history.db"

if __name__ == "__main__":
    process_pending_images(PENDING_IMAGES_DIR, MEDIA_DIR, IMAGE_DB_PATH)
