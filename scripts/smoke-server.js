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
    if (home.status !== 200 || !home.body.includes("출정 세팅 추천")) throw new Error("guide home page did not serve");
    const health = await request(port, "GET", "/api/health");
    if (health.status !== 200 || !JSON.parse(health.body).ok) throw new Error("health endpoint did not serve");
    const invalid = await request(port, "POST", "/api/recommend", { heroes: [] });
    if (invalid.status !== 400) throw new Error("invalid recommendation request was not rejected");
    const pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9NwAAAABJRU5ErkJggg==";
    const missingKey = await request(port, "POST", "/api/recommend", {
      expedition: { region: "Ruins", difficulty: "Champion", type: "normal", boss: "" },
      heroes: ["4", "3", "2", "1"].map((position) => ({ position, image: pixel })),
      trinkets: []
    });
    if (missingKey.status !== 503 || !JSON.parse(missingKey.body).error.includes("API 키")) throw new Error("missing-key error flow did not preserve a friendly response");
    console.log("Server smoke test passed: static guide, health, validation, and friendly API-key error flow.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => { console.error(error.message); process.exit(1); });
