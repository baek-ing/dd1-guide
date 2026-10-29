"use strict";

const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = __dirname;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  response.end(JSON.stringify(data));
}

async function serveStatic(request, response, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { sendJson(response, 400, { error: "요청 경로가 올바르지 않습니다." }); return; }
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = path.resolve(root, relative);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) { sendJson(response, 403, { error: "허용되지 않은 경로입니다." }); return; }
  try {
    const content = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": [".html", ".css", ".js", ".json"].includes(extension) ? "no-cache" : "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self'"
    });
    if (request.method === "HEAD") response.end(); else response.end(content);
  } catch (error) {
    if (error.code === "ENOENT") sendJson(response, 404, { error: "파일을 찾을 수 없습니다." });
    else sendJson(response, 500, { error: "파일을 불러오지 못했습니다." });
  }
}

function createServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    if (request.method === "GET" && url.pathname === "/api/health") { sendJson(response, 200, { ok: true, mode: "offline" }); return; }
    if (request.method === "GET" || request.method === "HEAD") { await serveStatic(request, response, url.pathname); return; }
    sendJson(response, 405, { error: "지원하지 않는 요청입니다." });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 4173;
  createServer().listen(port, "127.0.0.1", () => console.log(`Darkest Dungeon guide: http://127.0.0.1:${port}`));
}

module.exports = { createServer };
