(() => {
  "use strict";

  const root = document.querySelector("#tab-expedition");
  if (!root) return;

  const positions = ["1", "2", "3", "4"];
  const heroSelects = document.querySelector("#rank-hero-selects");
  const regionSelect = document.querySelector("#expedition-region");
  const difficultySelect = document.querySelector("#expedition-difficulty");
  const typeSelect = document.querySelector("#expedition-type");
  const recommendButton = document.querySelector("#recommend-party");
  const status = document.querySelector("#party-status");
  const result = document.querySelector("#skill-recommendations");

  const REGION_INTEL = {
    "Ruins": { normal: "불경 적 중심입니다. 후열 압박·기절·중독을 우선하고 출혈 의존은 낮춥니다.", boss: "보스전은 후열 견제와 안정적인 단일 회복을 남겨 두는 편성이 안전합니다." },
    "Warrens": { normal: "야수·인간의 출혈·질병 압박이 강합니다. 출혈과 회복, 스트레스 안정화를 같이 챙깁니다.", boss: "보스전은 표식·전열 압박에 휘말리지 않도록 수호·회복과 단일 화력을 우선합니다." },
    "Weald": { normal: "중독·질병·회피와 단단한 전열이 섞입니다. 후열 처치와 해제 수단이 중요합니다.", boss: "보스전은 긴 전투를 대비해 후열 타격과 안정 회복을 함께 유지합니다." },
    "Cove": { normal: "이물과 높은 보호도, 기절·출혈·끌어오기에 대비합니다. 중독과 표식 화력이 잘 맞습니다.", boss: "보스전은 방어 관통·표식·회복을 우선하고 끌어오기 뒤에도 쓸 수 있는 스킬을 남깁니다." },
    "Courtyard": { normal: "긴 원정과 출혈·저주 관리가 핵심입니다. 지속 회복과 스트레스 안정화의 가치가 큽니다.", boss: "보스전은 장기전입니다. 출혈 해제·회복·명중 보완을 빼지 않는 편성이 안전합니다." },
    "Farmstead": { normal: "연속 웨이브를 버티는 곳입니다. 파티 회복·스트레스 관리·광역 압박을 우선합니다.", boss: "보스 웨이브는 다음 전투까지 이어집니다. 일회성 폭딜보다 회복·방어·진형 안정성을 우선합니다." },
    "Sunward Isles": { normal: "요괴 적과 강한 회복·약화 압박을 고려합니다. 안정적인 명중·후열 공격·회복을 우선합니다.", boss: "모드 보스는 세부 수치가 공개적으로 완전 검증되지 않았습니다. 명중·후열 타격·회복 중심의 안전한 기본안을 표시합니다." },
    "Darkest Dungeon": { normal: "특수 원정입니다. 이동 대응·안정적인 회복·후열 타격을 우선하고 실제 퀘스트 조건을 다시 확인하세요.", boss: "고정 보스전 조건을 먼저 확인하세요. 이 도구의 스킬 표시는 이동 대응·회복·후열 타격 위주의 일반 원칙입니다." },
    "Other": { normal: "선택한 지역의 적 구성과 보스 기믹을 먼저 확인한 뒤, 명중과 회복을 기본으로 편성하세요.", boss: "보스 기믹을 확인한 뒤 단일 화력·회복·진형 유지 중 무엇을 우선할지 정하세요." }
  };

  const HEROES = {
    crusader: { name: "성기사", en: "Crusader", ranks: [1, 2, 3], skills: { "1": ["성스러운 일격", "기절의 일격", "전투 치유", "고무의 울음"], "2": ["성스러운 일격", "기절의 일격", "성창", "고무의 울음"], "3": ["성창", "전투 치유", "고무의 울음", "성스러운 일격 준비용 전진"] }, note: "기절·회복을 겸하는 전열 안정 담당입니다." },
    highwayman: { name: "노상강도", en: "Highwayman", ranks: [1, 2, 3], skills: { "1": ["영거리 사격", "사악한 베기", "정맥 절개", "결투가의 전진"], "2": ["결투가의 전진", "권총 사격", "사악한 베기", "정맥 절개"], "3": ["권총 사격", "결투가의 전진", "정맥 절개", "사악한 베기"] }, note: "전·후열 모두를 건드리는 유연한 딜러입니다." },
    vestal: { name: "성녀", en: "Vestal", ranks: [3, 4], skills: { "3": ["신성한 은총", "신성한 위안", "심판", "눈부신 빛"], "4": ["신성한 은총", "신성한 위안", "심판", "눈부신 빛"] }, note: "단일·광역 회복을 함께 맡는 안정적인 후열 치유사입니다." },
    plague_doctor: { name: "역병 의사", en: "Plague Doctor", ranks: [3, 4], skills: { "3": ["역병 수류탄", "유독성 폭발", "실명 가스", "전장 의학"], "4": ["역병 수류탄", "유독성 폭발", "실명 가스", "전장 의학"] }, note: "후열 중독·기절·상태이상 해제를 동시에 제공합니다." },
    jester: { name: "광대", en: "Jester", ranks: [3, 4], skills: { "3": ["수확", "전투 발라드", "고무의 곡조", "베어내기"], "4": ["전투 발라드", "고무의 곡조", "단검 찌르기", "피날레"] }, note: "속도·치명타와 스트레스 회복으로 장기전을 안정시킵니다." },
    man_at_arms: { name: "중보병", en: "Man-at-Arms", ranks: [1, 2, 3], skills: { "1": ["방벽", "응징", "수호자", "격려"], "2": ["방벽", "응징", "수호자", "격려"], "3": ["고함", "수호자", "격려", "지휘"] }, note: "보호·반격·진형 제어를 함께 제공하는 전열 보조입니다." },
    hellion: { name: "야만인", en: "Hellion", ranks: [1], skills: { "1": ["철백조", "사악한 베기", "피가 난다면", "아드레날린 급증"] }, note: "1열에서 적 4열까지 직접 압박하는 강한 공격수입니다." },
    bounty_hunter: { name: "현상금 사냥꾼", en: "Bounty Hunter", ranks: [1, 2, 3], skills: { "1": ["현상금 수집", "죽음의 표식", "올려치기", "끝장내기"], "2": ["현상금 수집", "죽음의 표식", "섬광탄", "끝장내기"], "3": ["현상금 수집", "죽음의 표식", "섬광탄", "끝장내기"] }, note: "표식 화력과 기절·끌어오기 제어를 함께 갖춘 사냥꾼입니다." },
    houndmaster: { name: "사냥개 조련사", en: "Houndmaster", ranks: [2, 3, 4], skills: { "2": ["사냥개의 돌진", "표적 휘파람", "경비견", "전쟁의 함성"], "3": ["사냥개의 돌진", "표적 휘파람", "경비견", "전쟁의 함성"], "4": ["사냥개의 돌진", "표적 휘파람", "경비견", "전쟁의 함성"] }, note: "표식·보호·스트레스 회복을 한 칸에서 해결합니다." },
    occultist: { name: "신비학자", en: "Occultist", ranks: [2, 3, 4], skills: { "2": ["기이한 재구성", "약화의 저주", "심연의 포격", "악마의 끌어오기"], "3": ["기이한 재구성", "약화의 저주", "심연의 포격", "악마의 끌어오기"], "4": ["기이한 재구성", "약화의 저주", "심연의 포격", "악마의 끌어오기"] }, note: "후열 압박과 큰 단일 회복을 제공하지만 치유 변동폭에 유의하세요." },
    arbalest: { name: "석궁사수", en: "Arbalest", ranks: [3, 4], skills: { "3": ["저격 사격", "저격수의 표식", "전장 붕대", "집결의 섬광"], "4": ["저격 사격", "저격수의 표식", "전장 붕대", "집결의 섬광"] }, note: "후열 저격·표식 시너지와 보조 회복이 강점입니다." },
    grave_robber: { name: "도굴꾼", en: "Grave Robber", ranks: [2, 3, 4], skills: { "2": ["돌진", "얼굴 찍기", "투척 단검", "독성 계략"], "3": ["돌진", "투척 단검", "독성 계략", "그림자 은신"], "4": ["투척 단검", "독성 계략", "그림자 은신", "돌진"] }, note: "높은 회피와 중독·후열 타격을 이용하는 이동형 딜러입니다." },
    flagellant: { name: "고행자", en: "Flagellant", ranks: [1, 2, 3], skills: { "1": ["처벌", "슬픔의 비", "되찾기", "구원"], "2": ["처벌", "슬픔의 비", "되찾기", "구원"], "3": ["슬픔의 비", "처벌", "되찾기", "방혈"] }, note: "출혈·위기 회복에 특화되어 긴 원정의 유지력을 올립니다." },
    leper: { name: "나병환자", en: "Leper", ranks: [1], skills: { "1": ["자르기", "쪼개기", "버티기", "엄숙함"] }, note: "명중 보완을 전제로 한 묵직한 1열 딜러입니다." },
    antiquarian: { name: "유물수집상", en: "Antiquarian", ranks: [3, 4], skills: { "3": ["신경 찌르기", "부패 가스", "섬광 가루", "활력의 증기"], "4": ["부패 가스", "섬광 가루", "활력의 증기", "신경 찌르기"] }, note: "회피·보호·약화로 파티 생존을 보조합니다." },
    abomination: { name: "괴인", en: "Abomination", ranks: [1, 2], skills: { "1": ["수갑", "야수의 담즙", "격노", "강타"], "2": ["수갑", "야수의 담즙", "격노", "강타"] }, note: "기절·중독과 변신 화력을 선택적으로 운용합니다." },
    shieldbreaker: { name: "방패 파괴자", en: "Shieldbreaker", ranks: [1, 2, 3], skills: { "1": ["관통", "천공", "살무사의 키스", "뱀의 회피"], "2": ["관통", "천공", "살무사의 키스", "뱀의 회피"], "3": ["관통", "천공", "살무사의 키스", "뱀의 회피"] }, note: "방어 관통과 이동으로 단단한 적·진형 변화에 대응합니다." },
    musketeer: { name: "머스킷티어", en: "Musketeer", ranks: [3, 4], skills: { "3": ["조준 사격", "저격수의 표식", "전장 붕대", "집결의 섬광"], "4": ["조준 사격", "저격수의 표식", "전장 붕대", "집결의 섬광"] }, note: "표식 파티의 후열 저격과 보조 회복을 맡습니다." },
    runaway: { name: "도망자", en: "Runaway", ranks: [1, 2, 3, 4], skills: { "1": ["반딧불이 (Firefly)", "약탈 (Ransack)", "달리고 숨기 (Run and Hide)", "화톳불빛 (Hearthlight)"], "2": ["반딧불이 (Firefly)", "약탈 (Ransack)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)"], "3": ["타오르는 일격 (Searing Strike)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)", "달리고 숨기 (Run and Hide)"], "4": ["타오르는 일격 (Searing Strike)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)", "달리고 숨기 (Run and Hide)"] }, note: "Fire's Edge의 화상·이동 딜러입니다. 시작 열보다 이동 후에도 사용할 다음 스킬이 남는지를 먼저 확인하세요." },
    duelist: { name: "결투가", en: "Duelist", ranks: [1, 2, 3, 4], allSkills: true, skills: { "1": ["예측 (Anticipation) · 자유 행동", "투셰 (Touché)", "페인트 (Feint)", "이탈 (Disengage)", "플레슈 (Flèche)", "쿠 드 그라스 (Coup de Grâce)", "부츠 (The Boot)"], "2": ["예측 (Anticipation) · 자유 행동", "투셰 (Touché)", "페인트 (Feint)", "이탈 (Disengage)", "플레슈 (Flèche)", "쿠 드 그라스 (Coup de Grâce)", "부츠 (The Boot)"], "3": ["예측 (Anticipation) · 자유 행동", "투셰 (Touché)", "페인트 (Feint)", "이탈 (Disengage)", "플레슈 (Flèche)", "쿠 드 그라스 (Coup de Grâce)", "부츠 (The Boot)"], "4": ["예측 (Anticipation) · 자유 행동", "투셰 (Touché)", "페인트 (Feint)", "이탈 (Disengage)", "플레슈 (Flèche)", "쿠 드 그라스 (Coup de Grâce)", "부츠 (The Boot)"] }, note: "Fire's Edge의 태세·반격 이동 딜러입니다. 결투가는 7개 전투 스킬을 모두 장착하며, 예측은 행동을 소모하지 않는 태세 전환입니다." }
  };

  const REGION_KITS = {
    "Ruins": {
      highwayman: { any: ["권총 사격", "결투가의 전진", "사악한 베기", "추적 사격"] },
      runaway: { "1": ["반딧불이 (Firefly)", "약탈 (Ransack)", "달리고 숨기 (Run and Hide)", "화톳불빛 (Hearthlight)"], "2": ["반딧불이 (Firefly)", "약탈 (Ransack)", "달리고 숨기 (Run and Hide)", "화톳불빛 (Hearthlight)"] }
    },
    "Warrens": {
      runaway: { "1": ["반딧불이 (Firefly)", "약탈 (Ransack)", "달리고 숨기 (Run and Hide)", "화톳불빛 (Hearthlight)"], "2": ["반딧불이 (Firefly)", "약탈 (Ransack)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)"] },
      houndmaster: { any: ["사냥개의 돌진", "표적 휘파람", "경비견", "전쟁의 함성"] }
    },
    "Weald": {
      runaway: { "2": ["반딧불이 (Firefly)", "약탈 (Ransack)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)"], "3": ["타오르는 일격 (Searing Strike)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)", "달리고 숨기 (Run and Hide)"] },
      plague_doctor: { any: ["역병 수류탄", "유독성 폭발", "실명 가스", "전장 의학"] }
    },
    "Cove": {
      shieldbreaker: { any: ["관통", "천공", "살무사의 키스", "뱀의 회피"] },
      bounty_hunter: { any: ["현상금 수집", "죽음의 표식", "섬광탄", "끝장내기"] }
    },
    "Courtyard": {
      flagellant: { any: ["처벌", "슬픔의 비", "되찾기", "구원"] },
      duelist: { any: ["예측 (Anticipation) · 자유 행동", "투셰 (Touché)", "페인트 (Feint)", "이탈 (Disengage)", "플레슈 (Flèche)", "쿠 드 그라스 (Coup de Grâce)", "부츠 (The Boot)"] }
    },
    "Farmstead": {
      jester: { any: ["수확", "전투 발라드", "고무의 곡조", "베어내기"] },
      duelist: { any: ["예측 (Anticipation) · 자유 행동", "투셰 (Touché)", "페인트 (Feint)", "이탈 (Disengage)", "플레슈 (Flèche)", "쿠 드 그라스 (Coup de Grâce)", "부츠 (The Boot)"] }
    }
  };

  const BOSS_KITS = {
    crusader: { any: ["성스러운 일격", "기절의 일격", "전투 치유", "고무의 울음"] },
    highwayman: { any: ["결투가의 전진", "권총 사격", "사악한 베기", "추적 사격"] },
    vestal: { any: ["신성한 은총", "신성한 위안", "심판", "눈부신 빛"] },
    plague_doctor: { any: ["역병 수류탄", "유독성 폭발", "전장 의학", "실명 가스"] },
    jester: { any: ["수확", "전투 발라드", "고무의 곡조", "피날레"] },
    man_at_arms: { any: ["방벽", "응징", "수호자", "격려"] },
    hellion: { any: ["철백조", "사악한 베기", "피가 난다면", "아드레날린 급증"] },
    bounty_hunter: { any: ["현상금 수집", "죽음의 표식", "섬광탄", "끝장내기"] },
    houndmaster: { any: ["사냥개의 돌진", "표적 휘파람", "경비견", "전쟁의 함성"] },
    occultist: { any: ["기이한 재구성", "약화의 저주", "심연의 포격", "악마의 끌어오기"] },
    arbalest: { any: ["저격 사격", "저격수의 표식", "전장 붕대", "집결의 섬광"] },
    grave_robber: { any: ["돌진", "얼굴 찍기", "투척 단검", "독성 계략"] },
    flagellant: { any: ["처벌", "슬픔의 비", "되찾기", "구원"] },
    leper: { any: ["자르기", "쪼개기", "버티기", "엄숙함"] },
    antiquarian: { any: ["신경 찌르기", "부패 가스", "섬광 가루", "활력의 증기"] },
    abomination: { any: ["수갑", "야수의 담즙", "격노", "강타"] },
    shieldbreaker: { any: ["관통", "천공", "살무사의 키스", "뱀의 회피"] },
    musketeer: { any: ["조준 사격", "저격수의 표식", "전장 붕대", "집결의 섬광"] },
    runaway: { "1": ["반딧불이 (Firefly)", "약탈 (Ransack)", "달리고 숨기 (Run and Hide)", "화톳불빛 (Hearthlight)"], "2": ["반딧불이 (Firefly)", "약탈 (Ransack)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)"], "3": ["타오르는 일격 (Searing Strike)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)", "달리고 숨기 (Run and Hide)"], "4": ["타오르는 일격 (Searing Strike)", "제어된 연소 (Controlled Burn)", "역화 (Backdraft)", "달리고 숨기 (Run and Hide)"] },
    duelist: { any: ["예측 (Anticipation) · 자유 행동", "투셰 (Touché)", "페인트 (Feint)", "이탈 (Disengage)", "플레슈 (Flèche)", "쿠 드 그라스 (Coup de Grâce)", "부츠 (The Boot)"] }
  };

  const FILLERS = {
    "Ruins": { "1": ["crusader", "hellion", "duelist"], "2": ["highwayman", "duelist", "bounty_hunter"], "3": ["plague_doctor", "jester", "runaway", "arbalest"], "4": ["vestal", "arbalest", "runaway", "plague_doctor"] },
    "Warrens": { "1": ["hellion", "flagellant", "runaway"], "2": ["runaway", "houndmaster", "duelist", "bounty_hunter"], "3": ["jester", "plague_doctor", "runaway", "houndmaster"], "4": ["vestal", "occultist", "arbalest", "runaway"] },
    "Weald": { "1": ["hellion", "shieldbreaker", "duelist"], "2": ["duelist", "bounty_hunter", "runaway", "highwayman"], "3": ["plague_doctor", "jester", "runaway", "houndmaster"], "4": ["vestal", "arbalest", "runaway", "plague_doctor"] },
    "Cove": { "1": ["shieldbreaker", "hellion", "duelist"], "2": ["duelist", "bounty_hunter", "houndmaster"], "3": ["plague_doctor", "occultist", "jester", "runaway"], "4": ["vestal", "arbalest", "occultist", "runaway"] },
    "Courtyard": { "1": ["flagellant", "hellion", "duelist"], "2": ["duelist", "highwayman", "houndmaster", "runaway"], "3": ["jester", "plague_doctor", "runaway", "houndmaster"], "4": ["vestal", "occultist", "arbalest", "runaway"] },
    "Farmstead": { "1": ["man_at_arms", "hellion", "duelist"], "2": ["duelist", "houndmaster", "highwayman", "runaway"], "3": ["jester", "plague_doctor", "occultist", "runaway"], "4": ["vestal", "arbalest", "occultist", "runaway"] },
    "Sunward Isles": { "1": ["shieldbreaker", "hellion", "duelist"], "2": ["duelist", "highwayman", "houndmaster", "runaway"], "3": ["plague_doctor", "jester", "occultist", "runaway"], "4": ["vestal", "arbalest", "plague_doctor", "runaway"] },
    "Darkest Dungeon": { "1": ["man_at_arms", "crusader", "duelist"], "2": ["duelist", "highwayman", "houndmaster", "runaway"], "3": ["plague_doctor", "jester", "occultist", "runaway"], "4": ["vestal", "arbalest", "occultist", "runaway"] },
    "Other": { "1": ["man_at_arms", "crusader", "duelist"], "2": ["duelist", "highwayman", "houndmaster", "runaway"], "3": ["plague_doctor", "jester", "runaway"], "4": ["vestal", "arbalest", "runaway"] }
  };

  function setStatus(message, tone = "") {
    status.textContent = message;
    status.className = `analysis-status${tone ? ` is-${tone}` : ""}`;
  }

  function createHeroSelect(position) {
    const label = document.createElement("label");
    label.className = "rank-hero-select";
    const title = document.createElement("span");
    title.className = "rank-label";
    title.textContent = `${position}열`;
    const hint = document.createElement("small");
    hint.textContent = position === "1" ? "전열" : position === "4" ? "후열" : "중열";
    const select = document.createElement("select");
    select.dataset.position = position;
    select.setAttribute("aria-label", `${position}열 영웅 선택`);
    select.add(new Option("비움", ""));
    Object.entries(HEROES).filter(([, hero]) => hero.ranks.includes(Number(position))).sort((a, b) => a[1].name.localeCompare(b[1].name, "ko")).forEach(([id, hero]) => select.add(new Option(`${hero.name} · ${hero.en}`, id)));
    select.addEventListener("change", () => {
      renderRecommendations();
      setStatus(select.value ? `${position}열 ${HEROES[select.value].name} 편성을 반영했습니다.` : `${position}열을 비웠습니다.`);
    });
    label.append(title, hint, select);
    return label;
  }

  function selections() {
    return Object.fromEntries([...heroSelects.querySelectorAll("select")].map((select) => [select.dataset.position, select.value]));
  }

  function contextText(region, type) {
    return (REGION_INTEL[region] || REGION_INTEL.Other)[type === "boss" ? "boss" : "normal"];
  }

  function kitFor(heroId, hero, position, region, type) {
    const regionKit = REGION_KITS[region]?.[heroId];
    const bossKit = type === "boss" ? BOSS_KITS[heroId] : null;
    return bossKit?.[position] || bossKit?.any || regionKit?.[position] || regionKit?.any || hero.skills[position] || hero.skills[hero.ranks[0]];
  }

  function focusFor(heroId, region, type) {
    if (heroId === "runaway") return type === "boss" ? "화상 누적이 유지될 긴 싸움이면 제어된 연소·역화로 전환합니다. 이동 뒤에도 다음 행동이 가능한지 확인하세요." : `${contextText(region, type)} 화상·끌어오기·이동이 필요한 턴에만 연소 전환을 밀어붙이세요.`;
    if (heroId === "duelist") return type === "boss" ? "예측으로 반격을 갱신한 뒤, 기절 대상은 쿠 드 그라스, 전열 제어는 부츠로 이어갑니다." : "예측은 자유 행동입니다. 태세를 먼저 맞춘 뒤 투셰·플레슈·이탈 중 다음 열에서도 쓸 수 있는 행동을 고르세요.";
    return type === "boss" ? "보스전용 안전 운용안입니다. 장기전에서 회복·명중·진형 유지가 끊기지 않는지 확인하세요." : "일반 원정용 운용안입니다. 해당 지역의 후열·상태이상·방어 문제를 먼저 처리하세요.";
  }

  function cardFor(position, heroId, hero, region, type) {
    const card = document.createElement("article");
    card.className = "skill-card";
    const title = document.createElement("h3");
    title.textContent = `${position}열 · ${hero.name}`;
    const english = document.createElement("small");
    english.textContent = hero.en;
    title.append(english);
    const skills = document.createElement("ol");
    skills.className = "skill-list";
    kitFor(heroId, hero, position, region, type).forEach((skill) => {
      const item = document.createElement("li");
      item.textContent = skill;
      skills.append(item);
    });
    const reason = document.createElement("p");
    reason.className = "skill-reason";
    reason.textContent = `${hero.note} ${focusFor(heroId, region, type)}`;
    if (hero.allSkills) {
      const special = document.createElement("p");
      special.className = "skill-special";
      special.textContent = "결투가 특칙 · 위 7개 전투 스킬은 모두 장착됩니다. 전투 중 태세에 따라 사용할 스킬을 선택하세요.";
      card.append(title, skills, special, reason);
      return card;
    }
    card.append(title, skills, reason);
    return card;
  }

  function renderRecommendations() {
    const chosen = selections();
    result.replaceChildren();
    const active = positions.filter((position) => chosen[position]);
    if (!active.length) {
      const empty = document.createElement("p");
      empty.className = "recommendation-summary";
      empty.textContent = "영웅을 하나 이상 고르면 각 열의 추천 스킬 4개가 여기 표시됩니다.";
      result.append(empty);
      return;
    }
    const heading = document.createElement("p");
    heading.className = "recommendation-summary";
    heading.textContent = `${regionSelect.options[regionSelect.selectedIndex].text} · ${difficultySelect.value} · ${typeSelect.value === "boss" ? "보스전" : "일반 원정"} 기준 — ${contextText(regionSelect.value, typeSelect.value)}`;
    const grid = document.createElement("div");
    grid.className = "skill-grid";
    active.forEach((position) => grid.append(cardFor(position, chosen[position], HEROES[chosen[position]], regionSelect.value, typeSelect.value)));
    result.append(heading, grid);
  }

  function recommendMissingHero() {
    const chosen = selections();
    const emptyPositions = positions.filter((position) => !chosen[position]);
    if (!emptyPositions.length) {
      setStatus("네 열이 모두 채워져 있습니다. 한 열 이상 비우면 지역별 후보를 자동 편성합니다.", "error");
      return;
    }
    const occupied = new Set(Object.values(chosen).filter(Boolean));
    const recommended = [];
    emptyPositions.forEach((position) => {
      const preferred = FILLERS[regionSelect.value]?.[position] || [];
      const heroId = preferred.find((id) => !occupied.has(id) && HEROES[id].ranks.includes(Number(position))) || Object.keys(HEROES).find((id) => !occupied.has(id) && HEROES[id].ranks.includes(Number(position)));
      if (!heroId) return;
      heroSelects.querySelector(`select[data-position="${position}"]`).value = heroId;
      occupied.add(heroId);
      recommended.push(`${position}열 ${HEROES[heroId].name}`);
    });
    if (!recommended.length) {
      setStatus("비어 있는 열에 넣을 수 있는 영웅 후보를 찾지 못했습니다.", "error");
      return;
    }
    renderRecommendations();
    setStatus(`${recommended.join(" · ")} 자동 편성을 반영했습니다. ${contextText(regionSelect.value, typeSelect.value)}`, "success");
  }

  positions.forEach((position) => heroSelects.append(createHeroSelect(position)));
  [regionSelect, difficultySelect, typeSelect].forEach((select) => select.addEventListener("change", () => {
    renderRecommendations();
    setStatus(`${regionSelect.options[regionSelect.selectedIndex].text} 기준으로 추천을 갱신했습니다.`);
  }));
  recommendButton.addEventListener("click", recommendMissingHero);
  renderRecommendations();
})();
