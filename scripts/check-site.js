"use strict";

const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const root = path.resolve(__dirname, "..");
const requiredFiles = ["index.html", "styles.css", "app.js", "data.js", "expedition.js", "server.js", "data/verification-report.json"];
const requiredIds = ["tab-expedition", "hero-slots", "hero-file-input", "trinket-file-input", "analyze-expedition", "curio-search"];
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const expedition = fs.readFileSync(path.join(root, "expedition.js"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
const failures = [];

requiredFiles.forEach((file) => { if (!fs.existsSync(path.join(root, file))) failures.push(`missing required file: ${file}`); });
requiredIds.forEach((id) => { if (!index.includes(`id="${id}"`)) failures.push(`missing required UI id: ${id}`); });
if (!index.includes("data/verification-report.json")) failures.push("verification report is not linked in maintenance copy");
if (!expedition.includes("document.addEventListener(\"paste\"")) failures.push("clipboard paste handler is missing");
if (!expedition.includes("dragover") || !expedition.includes("drop")) failures.push("drag-and-drop handlers are missing");
if (!server.includes("OPENAI_API_KEY") || !server.includes("/v1/responses")) failures.push("server-side Responses API integration is missing");
if (server.includes("localStorage")) failures.push("server must not use localStorage for credentials");
["app.js", "data.js", "expedition.js", "server.js", "scripts/check-assets.js", "scripts/smoke-server.js"].forEach((file) => {
  const result = childProcess.spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8" });
  if (result.status !== 0) failures.push(`syntax check failed: ${file}: ${result.stderr.trim()}`);
});
if (failures.length) {
  console.error("Site check failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log("Site structure and JavaScript syntax checks passed.");
