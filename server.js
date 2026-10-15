"use strict";

const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = __dirname;
const maxBodyBytes = 44 * 1024 * 1024;
const model = process.env.OPENAI_MODEL || "gpt-6-astra";
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
const allowedImage = /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=\s]+$/i;
const allowedPositions = new Set(["4", "3", "2", "1"]);

const outputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["analysis_notice", "heroes"],
  properties: {
    analysis_notice: { type: "string" },
    heroes: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["position", "class_name", "hero_name", "confidence", "skills", "trinkets"],
        properties: {
          position: { type: "string", enum: ["4", "3", "2", "1"] },
          class_name: { type: "string" },
          hero_name: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          skills: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["name", "reason"],
              properties: { name: { type: "string" }, reason: { type: "string" } }
            }
          },
          trinkets: {
            type: "array",
            maxItems: 2,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["name", "reason"],
              properties: { name: { type: "string" }, reason: { type: "string" } }
            }
          }
        }
      }
    }
  }
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBodyBytes) {
        reject(new Error("payload-too-large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("invalid-json"));
      }
    });
    request.on("error", () => reject(new Error("request-error")));
  });
}

function imageInput(image) {
  return { type: "input_image", image_url: image, detail: "high" };
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "분석 요청 형식이 올바르지 않습니다.";
  const heroes = payload.heroes;
  if (!Array.isArray(heroes) || heroes.length !== 4) return "영웅 캡처 네 장을 모두 넣어 주세요.";
  const seen = new Set();
  for (const hero of heroes) {
    const position = String(hero?.position || "");
    if (!allowedPositions.has(position) || seen.has(position) || !allowedImage.test(hero?.image || "")) return "영웅 캡처 정보를 다시 확인해 주세요.";
    seen.add(position);
  }
  if (!Array.isArray(payload.trinkets) || payload.trinkets.some((item) => !allowedImage.test(item?.image || ""))) return "장신구 캡처 형식을 확인해 주세요.";
  if (!payload.expedition || typeof payload.expedition.region !== "string" || typeof payload.expedition.difficulty !== "string") return "출정 조건을 다시 선택해 주세요.";
  if (!['normal', 'boss'].includes(payload.expedition.type)) return "출정 유형을 다시 선택해 주세요.";
  if (payload.expedition.type === "boss" && !String(payload.expedition.boss || "").trim()) return "보스 이름을 입력해 주세요.";
  return "";
}

function buildOpenAiInput(payload) {
  const expedition = payload.expedition;
  const parts = [{
    type: "input_text",
    text: [
      "You are a careful Darkest Dungeon 1 loadout assistant. Reply in Korean.",
      `Expedition: ${expedition.region}, ${expedition.difficulty}, ${expedition.type === "boss" ? `boss (${expedition.boss})` : "normal expedition"}.`,
      "The four heroes are fixed by the user and MUST NOT be replaced, reordered, or supplemented.",
      "Read UI text before cosmetics. Infer only what is visibly reliable: hero class/name, resolve/HP/stress, quirks/diseases, skills and equipment if readable.",
      "For every supplied fixed hero return exactly four currently appropriate combat skills. If a skill level or icon is unclear, explain that uncertainty briefly but still name four only when the class is sufficiently recognizable.",
      "Recommend at most two trinkets per hero. Recommend ONLY a trinket whose exact name/effect is confidently readable in the user's supplied trinket screenshots. Never invent, assume ownership, or assign one unique trinket to more than one hero.",
      "Prioritize accuracy, Champion+ ACC and stability, and the requested region/boss context. No party replacement, turn-by-turn commands, route advice, curio answers, secret-room advice, or plot spoilers.",
      "Set confidence high/medium/low based on what can actually be read. If uncertain, leave trinkets empty and say so in analysis_notice."
    ].join("\n")
  }];
  for (const hero of payload.heroes) {
    parts.push({ type: "input_text", text: `Fixed hero, position ${hero.position}, screenshot filename: ${hero.fileName || "pasted image"}.` });
    parts.push(imageInput(hero.image));
  }
  if (payload.trinkets.length) {
    parts.push({ type: "input_text", text: `The following ${payload.trinkets.length} images are the user's trinket inventory screenshots. Use only legible items from these images.` });
    payload.trinkets.forEach((trinket, index) => {
      parts.push({ type: "input_text", text: `Trinket screenshot ${index + 1}: ${trinket.fileName || "pasted image"}.` });
      parts.push(imageInput(trinket.image));
    });
  } else {
    parts.push({ type: "input_text", text: "No trinket screenshots were supplied. Return an empty trinkets list for every hero." });
  }
  return parts;
}

function extractOutputText(apiResponse) {
  if (typeof apiResponse.output_text === "string" && apiResponse.output_text) return apiResponse.output_text;
  for (const output of apiResponse.output || []) {
    for (const content of output.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

async function recommend(payload) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error("missing-api-key");
    error.publicMessage = "OpenAI API 키가 서버에 설정되지 않았습니다. 입력한 이미지는 유지되니 설정 후 다시 시도해 주세요.";
    throw error;
  }
  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      store: false,
      input: [{ role: "user", content: buildOpenAiInput(payload) }],
      text: {
        format: {
          type: "json_schema",
          name: "darkest_dungeon_expedition_recommendation",
          strict: true,
          schema: outputSchema
        }
      }
    })
  });
  if (!apiResponse.ok) {
    const error = new Error(`openai-${apiResponse.status}`);
    error.publicMessage = apiResponse.status === 429 ? "요청이 많거나 한도에 도달했습니다. 잠시 후 같은 입력으로 다시 시도해 주세요." : "분석 서비스가 응답하지 않았습니다. 입력은 유지되니 잠시 후 다시 시도해 주세요.";
    throw error;
  }
  const parsed = await apiResponse.json();
  const text = extractOutputText(parsed);
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("invalid-model-output");
    error.publicMessage = "분석 결과 형식을 확인하지 못했습니다. 이미지는 유지되니 다시 시도해 주세요.";
    throw error;
  }
}

async function serveStatic(request, response, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { sendJson(response, 400, { error: "요청 경로가 올바르지 않습니다." }); return; }
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = path.resolve(root, relative);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    sendJson(response, 403, { error: "허용되지 않은 경로입니다." });
    return;
  }
  try {
    const content = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": [".html", ".css", ".js", ".json"].includes(extension) ? "no-cache" : "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self' https://api.openai.com; base-uri 'self'; form-action 'self'"
    });
    response.end(content);
  } catch (error) {
    if (error.code === "ENOENT") sendJson(response, 404, { error: "파일을 찾을 수 없습니다." });
    else sendJson(response, 500, { error: "파일을 불러오지 못했습니다." });
  }
}

function createServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    if (request.method === "GET" && url.pathname === "/api/health") {
      sendJson(response, 200, { ok: true, apiConfigured: Boolean(process.env.OPENAI_API_KEY), model });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/recommend") {
      try {
        const payload = await readJson(request);
        const issue = validatePayload(payload);
        if (issue) { sendJson(response, 400, { error: issue }); return; }
        const recommendation = await recommend(payload);
        sendJson(response, 200, recommendation);
      } catch (error) {
        if (error.message === "payload-too-large") sendJson(response, 413, { error: "이미지 용량이 너무 큽니다. 캡처를 줄여 다시 시도해 주세요." });
        else if (error.message === "invalid-json") sendJson(response, 400, { error: "분석 요청을 읽지 못했습니다. 다시 시도해 주세요." });
        else sendJson(response, error.message === "missing-api-key" ? 503 : 502, { error: error.publicMessage || "분석 중 문제가 생겼습니다. 입력은 유지되니 다시 시도해 주세요." });
      }
      return;
    }
    if (request.method === "GET" || request.method === "HEAD") {
      await serveStatic(request, response, url.pathname);
      return;
    }
    sendJson(response, 405, { error: "지원하지 않는 요청입니다." });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 4173;
  createServer().listen(port, "127.0.0.1", () => console.log(`Darkest Dungeon guide: http://127.0.0.1:${port}`));
}

module.exports = { createServer, validatePayload, outputSchema };
