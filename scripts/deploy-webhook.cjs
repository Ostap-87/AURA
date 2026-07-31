#!/usr/bin/env node
// Слушатель вебхука GitHub: при push в main запускает scripts/deploy.sh.
// Секрет и порт передаются через переменные окружения (см. systemd-юнит
// aura-deploy-webhook.service, создаваемый scripts/setup-webhook.sh) —
// секрет намеренно не хранится в репозитории, т.к. он публичный.
"use strict";
const http = require("http");
const crypto = require("crypto");
const { spawn } = require("child_process");
const path = require("path");

const PORT = process.env.WEBHOOK_PORT || 9001;
const SECRET = process.env.WEBHOOK_SECRET;
const DEPLOY_SCRIPT = path.join(__dirname, "deploy.sh");

if (!SECRET) {
  console.error("WEBHOOK_SECRET is not set");
  process.exit(1);
}

function verifySignature(payload, signatureHeader) {
  if (!signatureHeader) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

let deploying = false;

function runDeploy() {
  if (deploying) {
    console.log("Deploy already running, skipping trigger.");
    return;
  }
  deploying = true;
  console.log("Starting deploy...");
  const child = spawn("bash", [DEPLOY_SCRIPT], { stdio: "inherit" });
  child.on("exit", (code) => {
    deploying = false;
    console.log(`Deploy finished with code ${code}`);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/api/deploy-webhook") {
    res.writeHead(404);
    res.end();
    return;
  }

  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const body = Buffer.concat(chunks);
    const signature = req.headers["x-hub-signature-256"];

    if (!verifySignature(body, signature)) {
      res.writeHead(401);
      res.end("invalid signature");
      return;
    }

    let payload;
    try {
      payload = JSON.parse(body.toString("utf8"));
    } catch {
      res.writeHead(400);
      res.end("bad json");
      return;
    }

    if (payload.ref !== "refs/heads/main") {
      res.writeHead(200);
      res.end("ignored: not main");
      return;
    }

    res.writeHead(202);
    res.end("deploying");
    runDeploy();
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Deploy webhook listening on 0.0.0.0:${PORT}`);
});
