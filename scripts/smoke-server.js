"use strict";

const http = require("node:http");
const { createServer } = require("../server.js");

function request(port, method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? Buffer.from(JSON.stringify(body)) : null;
    const request = http.request({ hostname: "127.0.0.1", port, method, path: pathname, headers: payload ? { "Content-Type": "application/json", "Content-Length": payload.length } : {} }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
    });
    request.on("error", reject);
    if (payload) request.write(payload);
    request.end();
  });
}

async function main() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const home = await request(port, "GET", "/");
    if (home.status !== 200 || !home.body.includes("rank-hero-selects") || !home.body.includes("출정 세팅 추천")) throw new Error("offline party planner did not serve");
    const health = await request(port, "GET", "/api/health");
    if (health.status !== 200 || !JSON.parse(health.body).ok || JSON.parse(health.body).mode !== "offline") throw new Error("offline health endpoint did not serve");
    const missing = await request(port, "GET", "/missing-file");
    if (missing.status !== 404) throw new Error("missing static files were not handled");
    console.log("Server smoke test passed: static guide, offline planner markup, health, and missing-file handling.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => { console.error(error.message); process.exit(1); });
