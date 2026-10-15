const filter = document.querySelector("#area-filter");
const lengthFilter = document.querySelector("#length-filter");
const curioSearch = document.querySelector("#curio-search");
const resetButton = document.querySelector("#reset-filters");
const resultCount = document.querySelector("#result-count");
const guideSections = document.querySelector("#guide-sections");
const sourceLinks = document.querySelector("#source-links");
const quirkSections = document.querySelector("#quirk-sections");
const bossFilter = document.querySelector("#boss-area-filter");
const bossSections = document.querySelector("#boss-sections");
const bossResultCount = document.querySelector("#boss-result-count");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

const icons = { good: "✓", warn: "!", avoid: "✕", neutral: "•" };
const labels = { good: "권장", warn: "주의", avoid: "피해야 함", neutral: "정보" };

function makeOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function makeCard(item, index = 0) {
  const article = document.createElement("article");
  article.className = "curio-card";
  const media = document.createElement("div");
  media.className = "media";
  const image = new Image();
  image.src = item.image;
  image.alt = `${item.ko} (${item.en}) 기물 이미지`;
  image.loading = index < 9 ? "eager" : "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    image.remove();
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = "이미지 자료 없음";
    media.append(fallback);
  });
  media.append(image);

  const body = document.createElement("div");
  body.className = "card-body";
  const top = document.createElement("div");
  top.className = "card-top";
  const title = document.createElement("h3");
  title.className = "card-title";
  title.append(document.createTextNode(item.ko));
  const english = document.createElement("small");
  english.textContent = item.en;
  title.append(english);
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = AREAS[item.area].name;
  top.append(title, tag);
  body.append(top);

  const list = document.createElement("ul");
  list.className = "interactions";
  item.actions.forEach((action) => {
    const row = document.createElement("li");
    row.className = `interaction ${action.kind}`;
    const signal = document.createElement("span");
    signal.className = "signal";
    signal.title = labels[action.kind];
    signal.setAttribute("aria-label", labels[action.kind]);
    signal.textContent = icons[action.kind];
    const text = document.createElement("span");
    const supply = document.createElement("span");
    supply.className = "supply";
    supply.textContent = `${action.supply} `;
    text.append(supply, document.createTextNode(action.effect));
    row.append(signal, text);
    list.append(row);
  });
  body.append(list);
  if (item.note) {
    const note = document.createElement("p");
    note.className = "card-note";
    note.textContent = item.note;
    body.append(note);
  }
  article.append(media, body);
  return article;
}

function areaNotice(area) {
  if (area === "courtyard") return "Courtyard Plus: Lost Treasure Box와 Trinket Chest 모두 열쇠 구멍이 제거되어 해골 열쇠 상호작용이 없습니다. 퀘스트 전용 기물은 카드 하단에 별도로 표시했습니다.";
  if (area === "sunward") return "Sunward Isles: 나무위키가 연결한 실측 기록과 Steam 가이드를 대조했습니다. 개별 효과가 미확인인 기물은 ‘확인 필요’로 남겼습니다.";
  if (area === "night") return "The Night Parade: 제작자가 신규 기물(복수)을 명시하지만 개별 이름·효과 목록은 공개하지 않았습니다. 따라서 확인된 90개 총수에는 넣지 않았습니다.";
  return "";
}

function lengthLabel(length) {
  return { short: "짧음", medium: "중간", long: "김" }[length];
}

function provisionFor(area, length) {
  const table = PROVISIONS[area];
  return table ? (table[length] || table.special || null) : null;
}

function makeProvisionBrief(area, length) {
  const provision = provisionFor(area, length);
  if (!provision) return null;
  const duration = PROVISIONS[area]?.special ? "특수 원정" : `${lengthLabel(length)} 원정`;
  const enemy = REGION_ENEMY_INTEL[area] || {
    types: "확인 필요",
    attack: "확인 필요",
    defense: "확인 필요"
  };
  return {
    supplies: `${duration} · 식량 ${provision.food} · 횃불 ${provision.torch}`,
    enemy,
    essentials: `필수 · ${provision.must}`
  };
}

function matchesCurio(item, query) {
  if (!query) return true;
  const haystack = [
    item.ko,
    item.en,
    AREAS[item.area]?.name,
    item.note,
    ...item.actions.flatMap((action) => [action.supply, action.effect])
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function render() {
  const selected = filter.value;
  const length = lengthFilter.value;
  const query = curioSearch.value.trim().toLowerCase();
  const areas = selected === "all" ? Object.keys(AREAS) : (selected === "common" ? ["common"] : ["common", selected]);
  guideSections.replaceChildren();
  let displayed = 0;
  areas.forEach((area) => {
    const allCards = area === "night" ? [NIGHT_PARADE] : CURIOS.filter((item) => item.area === area);
    const cards = allCards.filter((item) => matchesCurio(item, query));
    if (!cards.length) return;
    displayed += area === "night" ? 0 : cards.length;
    const section = document.createElement("section");
    section.className = "area-section";
    section.id = `area-${area}`;
    const heading = document.createElement("div");
    heading.className = "area-heading";
    const h2 = document.createElement("h2");
    h2.append(document.createTextNode(AREAS[area].name));
    const small = document.createElement("small");
    small.textContent = AREAS[area].detail;
    h2.append(small);
    const meta = document.createElement("div");
    meta.className = "area-meta";
    const brief = makeProvisionBrief(area, length);
    if (brief) {
      const provisionRow = document.createElement("div");
      provisionRow.className = "area-info-row area-provision-row";
      const supplies = document.createElement("span");
      supplies.className = "area-provisions";
      supplies.textContent = brief.supplies;
      const essentials = document.createElement("span");
      essentials.className = "area-essentials";
      essentials.textContent = brief.essentials;
      provisionRow.append(supplies, essentials);

      const enemyRow = document.createElement("div");
      enemyRow.className = "area-info-row area-enemy-intel";
      const typeLabel = document.createElement("span");
      typeLabel.className = "area-enemy-types";
      typeLabel.textContent = `주요 적 타입 · ${brief.enemy.types}`;
      const attack = document.createElement("span");
      attack.className = "area-status area-status-attack";
      attack.textContent = `공격 권장 · ${brief.enemy.attack}`;
      const defense = document.createElement("span");
      defense.className = "area-status area-status-defense";
      defense.textContent = `방어 주의 · ${brief.enemy.defense}`;
      enemyRow.append(typeLabel, attack, defense);
      meta.append(provisionRow, enemyRow);
    }
    heading.append(h2, meta);
    section.append(heading);
    const noticeText = areaNotice(area);
    if (noticeText) {
      const notice = document.createElement("p");
      notice.className = "area-notice";
      notice.textContent = noticeText;
      section.append(notice);
    }
    const grid = document.createElement("div");
    grid.className = "card-grid";
    cards.forEach((card, index) => grid.append(makeCard(card, index)));
    section.append(grid);
    guideSections.append(section);
  });
  const qualifier = query ? ` “${curioSearch.value.trim()}” 검색` : "";
  resultCount.textContent = selected === "all" ? `${qualifier} 결과 ${displayed}개 · 확인된 기물 ${KNOWN_CURIO_TOTAL}개 기준입니다. Night Parade는 상세표 미공개로 별도 표시됩니다.` : `${qualifier} 결과 ${displayed}개를 표시합니다. 공통 기물도 함께 포함됩니다.`;
  if (!displayed) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "조건에 맞는 기물이 없습니다. 검색어 또는 지역 필터를 바꿔 보세요.";
    guideSections.append(empty);
  }
}

function makeQuirkItem(item) {
  const article = document.createElement("article");
  article.className = "quirk-card";
  const name = document.createElement("h4");
  name.textContent = item.name;
  const english = document.createElement("small");
  english.textContent = item.en;
  name.append(english);
  const effect = document.createElement("p");
  effect.className = "quirk-effect";
  effect.textContent = item.effect;
  const note = document.createElement("p");
  note.className = "quirk-note";
  note.textContent = item.note;
  article.append(name, effect, note);
  return article;
}

function renderQuirks() {
  quirkSections.replaceChildren();
  let activeGroup = "";
  QUIRK_SECTIONS.forEach((section) => {
    if (section.group !== activeGroup) {
      activeGroup = section.group;
      const group = document.createElement("h2");
      group.className = "quirk-group-title";
      group.textContent = activeGroup;
      quirkSections.append(group);
    }
    const block = document.createElement("section");
    block.className = "quirk-section";
    block.id = `quirk-${section.id}`;
    const heading = document.createElement("div");
    heading.className = "subsection-heading";
    const title = document.createElement("h3");
    title.textContent = section.title;
    const description = document.createElement("p");
    description.textContent = section.description;
    heading.append(title, description);
    const grid = document.createElement("div");
    grid.className = "quirk-grid";
    section.items.forEach((item) => grid.append(makeQuirkItem(item)));
    block.append(heading, grid);
    quirkSections.append(block);
  });
}

function makeBossArea(area) {
  const section = document.createElement("section");
  section.className = "boss-area";
  section.id = `boss-${area.area}`;
  const heading = document.createElement("div");
  heading.className = "boss-heading";
  const title = document.createElement("h2");
  title.append(document.createTextNode(area.name));
  const subtitle = document.createElement("small");
  subtitle.textContent = area.subtitle;
  title.append(subtitle);
  const types = document.createElement("span");
  types.className = "boss-types";
  types.textContent = area.types;
  heading.append(title, types);
  const feature = document.createElement("p");
  feature.className = "boss-feature";
  feature.textContent = area.feature;
  const grid = document.createElement("div");
  grid.className = "boss-grid";
  area.bosses.forEach((boss) => {
    const card = document.createElement("article");
    card.className = "boss-card";
    const media = document.createElement("div");
    media.className = "boss-media";
    const imageSource = BOSS_IMAGES[boss.en];
    if (imageSource) {
      const image = new Image();
      image.src = imageSource;
      image.alt = `${boss.name} (${boss.en}) 인게임 기반 보스 이미지`;
      image.loading = "lazy";
      media.classList.add("is-cutout");
      image.className = "boss-cutout";
      image.addEventListener("error", () => {
        image.classList.add("missing");
        media.textContent = "이미지 자료 확인 불가";
        media.classList.add("image-unavailable");
      });
      media.append(image);
    } else {
      media.textContent = "이미지 자료 확인 불가";
      media.classList.add("image-unavailable");
    }
    const name = document.createElement("h3");
    name.textContent = boss.name;
    const english = document.createElement("small");
    english.textContent = boss.en;
    name.append(english);
    const detail = document.createElement("p");
    detail.textContent = boss.detail;
    card.append(media, name, detail);
    grid.append(card);
  });
  section.append(heading, feature);
  if (area.bosses.length) {
    section.append(grid);
  } else {
    const unavailable = document.createElement("p");
    unavailable.className = "boss-unavailable";
    unavailable.textContent = area.availability || "검증 가능한 개별 보스 정보가 없어 카드와 이미지는 표시하지 않습니다.";
    section.append(unavailable);
  }
  return section;
}

function renderBosses() {
  const selected = bossFilter.value;
  const areas = selected === "all" ? BOSS_AREAS : BOSS_AREAS.filter((area) => area.area === selected);
  bossSections.replaceChildren();
  areas.forEach((area) => bossSections.append(makeBossArea(area)));
  bossResultCount.textContent = selected === "all" ? `${BOSS_AREAS.length}개 구역 정보를 표시합니다.` : `${areas[0]?.name || "선택한 구역"} 정보를 표시합니다.`;
}

function switchTab(target) {
  tabButtons.forEach((button) => {
    const active = button.dataset.tabTarget === target;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  tabPanels.forEach((panel) => {
    const active = panel.id === `tab-${target}`;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

filter.append(makeOption("all", "전체 지역"));
Object.entries(AREAS).forEach(([key, area]) => filter.append(makeOption(key, `${area.name} · ${area.detail}`)));
filter.addEventListener("change", () => {
  render();
  if (filter.value !== "all") {
    requestAnimationFrame(() => document.querySelector(`#area-${filter.value}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
});
lengthFilter.addEventListener("change", render);
curioSearch.addEventListener("input", render);
resetButton.addEventListener("click", () => {
  filter.value = "all";
  lengthFilter.value = "medium";
  curioSearch.value = "";
  render();
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
bossFilter.append(makeOption("all", "전체 던전 · 특수 출현"));
BOSS_AREAS.forEach((area) => bossFilter.append(makeOption(area.area, `${area.name} · ${area.subtitle}`)));
bossFilter.addEventListener("change", () => {
  renderBosses();
  if (bossFilter.value !== "all") {
    requestAnimationFrame(() => document.querySelector(`#boss-${bossFilter.value}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
});
tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const targetIndex = event.key === "Home" ? 0 : event.key === "End" ? tabButtons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabButtons.length) % tabButtons.length;
    tabButtons[targetIndex].focus();
    switchTab(tabButtons[targetIndex].dataset.tabTarget);
  });
});
Object.values(SOURCES).forEach((source) => {
  const link = document.createElement("a");
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = source.label;
  sourceLinks.append(link);
});
render();
renderQuirks();
renderBosses();
