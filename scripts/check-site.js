"use strict";

const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const root = path.resolve(__dirname, "..");
const requiredFiles = ["index.html", "styles.css", "app.js", "data.js", "expedition.js", "server.js", "data/verification-report.json"];
const requiredIds = ["tab-expedition", "rank-hero-selects", "recommend-party", "skill-recommendations", "party-synergy", "curio-search"];
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const expedition = fs.readFileSync(path.join(root, "expedition.js"), "utf8");
const server = fs.readFileSync(path.join(root, "server.js"), "utf8");
const failures = [];

requiredFiles.forEach((file) => { if (!fs.existsSync(path.join(root, file))) failures.push(`missing required file: ${file}`); });
requiredIds.forEach((id) => { if (!index.includes(`id="${id}"`)) failures.push(`missing required UI id: ${id}`); });
if (!index.includes("data/verification-report.json")) failures.push("verification report is not linked in maintenance copy");
if (!expedition.includes("const HEROES") || !expedition.includes("const FILLERS")) failures.push("offline hero and region recommendation data is missing");
if (!expedition.includes("runaway") || !expedition.includes("duelist") || !expedition.includes("allSkills: true")) failures.push("Fire's Edge Runaway or Duelist data is missing");
if (!expedition.includes("const REGION_KITS") || !expedition.includes("const BOSS_KITS") || !expedition.includes("kitFor")) failures.push("region and mission-type skill kit data is missing");
if (!expedition.includes("recommendMissingHero") || !expedition.includes("renderRecommendations") || !expedition.includes("renderSynergy") || !expedition.includes("HERO_TRAITS")) failures.push("party fill, automatic skill recommendation, or synergy analysis is missing");
if (!expedition.includes("emptyPositions.forEach") || expedition.includes("정확히 한 열만")) failures.push("party fill must support multiple empty ranks");
if (expedition.includes("Object.entries(HEROES).filter(([, hero]) => hero.ranks.includes(Number(position)))")) failures.push("every hero must be selectable in every rank");
if (expedition.includes("/api/recommend") || expedition.includes("trinket")) failures.push("expedition planner must not depend on trinkets or a remote recommendation API");
if (!server.includes('mode: "offline"')) failures.push("local server offline health mode is missing");
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
