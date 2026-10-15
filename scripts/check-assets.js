"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const dataFile = path.join(root, "data.js");
const source = fs.readFileSync(dataFile, "utf8");
const context = vm.createContext({});
vm.runInContext(`${source}\nglobalThis.__guideAssets = { CURIOS, NIGHT_PARADE, BOSS_IMAGES, KNOWN_CURIO_TOTAL };`, context, { filename: dataFile });
const guide = context.__guideAssets;
const references = [
  ...guide.CURIOS.map((item) => item.image),
  guide.NIGHT_PARADE.image,
  ...Object.values(guide.BOSS_IMAGES)
];
const uniqueReferences = [...new Set(references)].filter(Boolean);
const errors = [];
const warnings = [];
const hashes = new Map();

function isValidImage(buffer, extension) {
  if (extension === ".png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (extension === ".jpg" || extension === ".jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (extension === ".webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  return false;
}

function exactPathExists(relative) {
  const segments = relative.split("/");
  let cursor = root;
  for (const segment of segments) {
    let entries;
    try { entries = fs.readdirSync(cursor); } catch { return false; }
    if (!entries.includes(segment)) return false;
    cursor = path.join(cursor, segment);
  }
  return true;
}

for (const relative of uniqueReferences) {
  if (/^https?:/i.test(relative)) {
    errors.push(`remote image reference is not allowed: ${relative}`);
    continue;
  }
  if (!exactPathExists(relative)) {
    errors.push(`missing or case-mismatched image path: ${relative}`);
    continue;
  }
  const absolute = path.join(root, ...relative.split("/"));
  const buffer = fs.readFileSync(absolute);
  const extension = path.extname(absolute).toLowerCase();
  if (buffer.length === 0) errors.push(`zero-byte image: ${relative}`);
  if (!isValidImage(buffer, extension)) errors.push(`invalid image signature: ${relative}`);
  if (buffer.length > 4 * 1024 * 1024) warnings.push(`large image (>4 MB): ${relative}`);
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  const peers = hashes.get(hash) || [];
  peers.push(relative);
  hashes.set(hash, peers);
}

for (const paths of hashes.values()) {
  if (paths.length > 1) warnings.push(`duplicate binary assets (reviewed, non-fatal): ${paths.join(" | ")}`);
}
if (guide.CURIOS.length !== guide.KNOWN_CURIO_TOTAL) errors.push(`curio count mismatch: ${guide.CURIOS.length} != ${guide.KNOWN_CURIO_TOTAL}`);
if (errors.length) {
  console.error("Asset check failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`Asset check passed: ${uniqueReferences.length} referenced local images, ${guide.CURIOS.length} verified curio cards.`);
warnings.forEach((message) => console.warn(`Warning: ${message}`));
