(() => {
  "use strict";

  const root = document.querySelector("#tab-expedition");
  if (!root) return;

  const positions = ["4", "3", "2", "1"];
  const maxFileBytes = 8 * 1024 * 1024;
  const maxTotalBytes = 34 * 1024 * 1024;
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
  const heroSlots = [...document.querySelectorAll(".hero-slot")];
  const heroInput = document.querySelector("#hero-file-input");
  const trinketInput = document.querySelector("#trinket-file-input");
  const trinketDropzone = document.querySelector("#trinket-dropzone");
  const trinketPreviewList = document.querySelector("#trinket-preview-list");
  const typeSelect = document.querySelector("#expedition-type");
  const bossChoiceWrap = document.querySelector("#boss-choice-wrap");
  const bossInput = document.querySelector("#expedition-boss");
  const analyzeButton = document.querySelector("#analyze-expedition");
  const status = document.querySelector("#analysis-status");
  const result = document.querySelector("#recommendation-result");
  const heroImages = new Map();
  const trinketImages = [];
  let activePosition = "4";
  let activeDestination = "hero";
  let busy = false;

  function setStatus(message, kind = "") {
    status.textContent = message;
    status.className = `analysis-status${kind ? ` is-${kind}` : ""}`;
  }

  function friendlyFileName(file) {
    return (file.name || "붙여넣은 이미지").slice(0, 90);
  }

  function totalInputBytes(extraFiles = []) {
    return [...heroImages.values(), ...trinketImages, ...extraFiles].reduce((total, item) => total + (item.file?.size || 0), 0);
  }

  function validateImage(file, extraFiles = []) {
    if (!(file instanceof File)) return "이미지 파일만 넣을 수 있습니다.";
    if (!allowedTypes.has(file.type)) return "PNG, JPG/JPEG, WEBP 파일만 지원합니다.";
    if (file.size === 0) return "빈 이미지 파일은 사용할 수 없습니다.";
    if (file.size > maxFileBytes) return "이미지 한 장은 8MB 이하로 넣어 주세요.";
    if (totalInputBytes(extraFiles) + file.size > maxTotalBytes) return "현재 세션의 이미지 합계는 34MB 이하로 유지해 주세요.";
    return "";
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result)));
      reader.addEventListener("error", () => reject(new Error("read failed")));
      reader.readAsDataURL(file);
    });
  }

  function setActiveSlot(position) {
    activePosition = position;
    activeDestination = "hero";
    heroSlots.forEach((slot) => slot.classList.toggle("is-active", slot.dataset.position === position));
  }

  function nextEmptyPosition() {
    return positions.find((position) => !heroImages.has(position)) || activePosition;
  }

  function renderHeroSlot(position) {
    const slot = heroSlots.find((item) => item.dataset.position === position);
    const entry = heroImages.get(position);
    slot.replaceChildren();
    const label = document.createElement("span");
    label.className = "slot-label";
    label.textContent = `${position}열`;
    slot.append(label);
    slot.classList.toggle("is-filled", Boolean(entry));
    if (!entry) {
      const prompt = document.createElement("span");
      prompt.className = "slot-prompt";
      prompt.textContent = "클릭 후 캡처 붙여넣기";
      slot.append(prompt);
      return;
    }
    const image = new Image();
    image.alt = `${position}열 영웅 캡처 미리보기`;
    image.src = entry.dataUrl;
    const clear = document.createElement("button");
    clear.className = "slot-clear";
    clear.type = "button";
    clear.textContent = "삭제";
    clear.setAttribute("aria-label", `${position}열 영웅 캡처 삭제`);
    clear.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      heroImages.delete(position);
      renderHeroSlot(position);
      setActiveSlot(position);
      setStatus("영웅 캡처를 삭제했습니다. 새 캡처를 넣어 주세요.");
    });
    slot.append(image, clear);
  }

  function renderTrinkets() {
    trinketPreviewList.replaceChildren();
    trinketImages.forEach((entry, index) => {
      const item = document.createElement("li");
      item.className = "trinket-preview";
      const image = new Image();
      image.src = entry.dataUrl;
      image.alt = `장신구 캡처 ${index + 1}: ${entry.fileName}`;
      const number = document.createElement("span");
      number.className = "trinket-index";
      number.textContent = String(index + 1);
      const remove = document.createElement("button");
      remove.className = "trinket-remove";
      remove.type = "button";
      remove.textContent = "삭제";
      remove.setAttribute("aria-label", `장신구 캡처 ${index + 1} 삭제`);
      remove.addEventListener("click", () => {
        trinketImages.splice(index, 1);
        renderTrinkets();
        setStatus("장신구 캡처를 삭제했습니다. 입력한 영웅 이미지는 그대로 유지됩니다.");
      });
      item.append(image, number, remove);
      trinketPreviewList.append(item);
    });
  }

  async function addHeroFile(file, position) {
    const problem = validateImage(file);
    if (problem) {
      setStatus(problem, "error");
      return false;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      heroImages.set(position, { file, fileName: friendlyFileName(file), dataUrl });
      renderHeroSlot(position);
      setActiveSlot(nextEmptyPosition());
      setStatus(`${position}열 영웅 캡처를 추가했습니다. ${heroImages.size === 4 ? "세팅 분석을 실행할 수 있습니다." : "다음 빈 열이 선택되었습니다."}`, "success");
      return true;
    } catch {
      setStatus("이미지를 읽지 못했습니다. 다른 캡처로 다시 시도해 주세요.", "error");
      return false;
    }
  }

  async function addTrinketFiles(files) {
    const candidates = [...files].filter(Boolean);
    if (!candidates.length) return;
    const extra = [];
    for (const file of candidates) {
      const problem = validateImage(file, extra);
      if (problem) {
        setStatus(problem, "error");
        break;
      }
      extra.push({ file });
    }
    if (!extra.length) return;
    try {
      const read = await Promise.all(extra.map(async ({ file }) => ({ file, fileName: friendlyFileName(file), dataUrl: await fileToDataUrl(file) })));
      const duplicates = read.filter((entry) => trinketImages.some((item) => item.file.name === entry.file.name && item.file.size === entry.file.size && item.file.lastModified === entry.file.lastModified));
      const additions = read.filter((entry) => !duplicates.includes(entry));
      trinketImages.push(...additions);
      renderTrinkets();
      setStatus(additions.length ? `장신구 캡처 ${additions.length}장을 추가했습니다.${duplicates.length ? " 같은 파일은 중복 추가하지 않았습니다." : ""}` : "같은 장신구 캡처 파일이 이미 추가되어 있습니다.", additions.length ? "success" : "");
    } catch {
      setStatus("장신구 이미지를 읽지 못했습니다. 다른 캡처로 다시 시도해 주세요.", "error");
    }
  }

  function setDragState(element, enabled) {
    element.classList.toggle("is-dragging", enabled);
  }

  function filesFromClipboard(event) {
    return [...(event.clipboardData?.items || [])]
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter(Boolean);
  }

  function openActivePicker() {
    if (activeDestination === "trinket") trinketInput.click();
    else heroInput.click();
  }

  async function analyze() {
    if (busy) return;
    if (heroImages.size !== 4) {
      setStatus("4열부터 1열까지 영웅 캡처 네 장을 모두 넣어 주세요.", "error");
      setActiveSlot(nextEmptyPosition());
      return;
    }
    if (typeSelect.value === "boss" && !bossInput.value.trim()) {
      setStatus("보스전을 선택했다면 보스 이름을 입력해 주세요.", "error");
      bossInput.focus();
      return;
    }
    busy = true;
    analyzeButton.disabled = true;
    setStatus("영웅·장신구 화면을 읽고 세팅을 검토하는 중입니다. 이미지는 저장하지 않습니다.");
    const payload = {
      expedition: {
        region: document.querySelector("#expedition-region").value,
        difficulty: document.querySelector("#expedition-difficulty").value,
        type: typeSelect.value,
        boss: typeSelect.value === "boss" ? bossInput.value.trim() : ""
      },
      heroes: positions.map((position) => ({ position, fileName: heroImages.get(position).fileName, image: heroImages.get(position).dataUrl })),
      trinkets: trinketImages.map((entry) => ({ fileName: entry.fileName, image: entry.dataUrl }))
    };
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "분석 응답을 받지 못했습니다.");
      renderRecommendation(data);
      setStatus("분석이 완료되었습니다. 조건이나 이미지가 바뀌면 다시 분석할 수 있습니다.", "success");
    } catch (error) {
      setStatus(error instanceof Error && error.message ? error.message : "분석 중 문제가 생겼습니다. 입력은 유지되니 다시 시도해 주세요.", "error");
    } finally {
      busy = false;
      analyzeButton.disabled = false;
    }
  }

  function textItem(name, reason) {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = name || "확인 필요";
    item.append(strong);
    if (reason) item.append(document.createTextNode(` — ${reason}`));
    return item;
  }

  function renderRecommendation(data) {
    result.replaceChildren();
    const summary = document.createElement("p");
    summary.className = "recommendation-summary";
    summary.textContent = data.analysis_notice || "화면에서 확실히 읽힌 정보만 반영했습니다. 불확실한 장신구는 추천 후보에서 제외했습니다.";
    const grid = document.createElement("div");
    grid.className = "recommendation-grid";
    const heroes = Array.isArray(data.heroes) ? [...data.heroes] : [];
    positions.forEach((position) => {
      const hero = heroes.find((item) => String(item.position) === position) || {};
      const card = document.createElement("article");
      card.className = "recommendation-card";
      const title = document.createElement("h3");
      title.textContent = `${position}열 · ${hero.hero_name || "영웅 확인 필요"}`;
      const confidence = document.createElement("p");
      confidence.className = "recommendation-confidence";
      confidence.textContent = `판독 신뢰도 · ${hero.confidence || "low"}${hero.class_name ? ` · ${hero.class_name}` : ""}`;
      const skills = document.createElement("section");
      skills.className = "recommendation-block";
      const skillTitle = document.createElement("h4");
      skillTitle.textContent = "추천 전투 스킬 4개";
      const skillList = document.createElement("ul");
      (Array.isArray(hero.skills) ? hero.skills.slice(0, 4) : []).forEach((skill) => skillList.append(textItem(skill.name, skill.reason)));
      if (!skillList.children.length) skillList.append(textItem("판독 불가", "스킬 아이콘 또는 텍스트가 선명한 캡처로 다시 분석해 주세요."));
      skills.append(skillTitle, skillList);
      const trinkets = document.createElement("section");
      trinkets.className = "recommendation-block";
      const trinketTitle = document.createElement("h4");
      trinketTitle.textContent = "보유 장신구 배정";
      const trinketList = document.createElement("ul");
      (Array.isArray(hero.trinkets) ? hero.trinkets.slice(0, 2) : []).forEach((trinket) => trinketList.append(textItem(trinket.name, trinket.reason)));
      if (!trinketList.children.length) trinketList.append(textItem("추천 없음", "화면에서 확실히 식별된 보유 장신구가 없거나 이 영웅에 맞는 배정이 없습니다."));
      trinkets.append(trinketTitle, trinketList);
      card.append(title, confidence, skills, trinkets);
      grid.append(card);
    });
    const disclaimer = document.createElement("p");
    disclaimer.className = "recommendation-disclaimer";
    disclaimer.textContent = "추천은 선택한 네 영웅과 확인 가능한 보유 장신구 안에서만 구성됩니다. 전투 턴 지시, 이동 경로, 기물 정답 및 파티 교체는 제공하지 않습니다.";
    result.append(summary, grid, disclaimer);
  }

  heroSlots.forEach((slot) => {
    const position = slot.dataset.position;
    slot.addEventListener("click", () => {
      setActiveSlot(position);
      openActivePicker();
    });
    slot.addEventListener("dragover", (event) => { event.preventDefault(); setDragState(slot, true); });
    slot.addEventListener("dragleave", () => setDragState(slot, false));
    slot.addEventListener("drop", async (event) => {
      event.preventDefault();
      setDragState(slot, false);
      setActiveSlot(position);
      await addHeroFile([...event.dataTransfer.files][0], position);
    });
  });
  heroInput.addEventListener("change", async () => {
    const [file] = heroInput.files;
    if (file) await addHeroFile(file, activePosition);
    heroInput.value = "";
  });
  trinketDropzone.addEventListener("click", () => { activeDestination = "trinket"; trinketInput.click(); });
  trinketDropzone.addEventListener("dragover", (event) => { event.preventDefault(); activeDestination = "trinket"; setDragState(trinketDropzone, true); });
  trinketDropzone.addEventListener("dragleave", () => setDragState(trinketDropzone, false));
  trinketDropzone.addEventListener("drop", async (event) => {
    event.preventDefault();
    setDragState(trinketDropzone, false);
    activeDestination = "trinket";
    await addTrinketFiles(event.dataTransfer.files);
  });
  trinketInput.addEventListener("change", async () => {
    await addTrinketFiles(trinketInput.files);
    trinketInput.value = "";
  });
  document.addEventListener("paste", async (event) => {
    if (event.target.matches("input, textarea, select")) return;
    const files = filesFromClipboard(event);
    if (!files.length) return;
    event.preventDefault();
    if (activeDestination === "trinket") await addTrinketFiles(files);
    else await addHeroFile(files[0], activePosition);
  });
  typeSelect.addEventListener("change", () => {
    const isBoss = typeSelect.value === "boss";
    bossChoiceWrap.classList.toggle("is-hidden", !isBoss);
    bossInput.required = isBoss;
    if (isBoss) bossInput.focus();
  });
  analyzeButton.addEventListener("click", analyze);
  positions.forEach(renderHeroSlot);
})();
