const SOURCES = {
  curioData: { label: "Darkest Dungeon Wiki · Curio 데이터 모듈", url: "https://darkestdungeon.wiki.gg/wiki/Module%3ACurios/Data" },
  namu: { label: "나무위키 · 다키스트 던전/골동품", url: "https://namu.moe/w/%EB%8B%A4%ED%82%A4%EC%8A%A4%ED%8A%B8%20%EB%8D%98%EC%A0%84/%EA%B3%A8%EB%8F%99%ED%92%88" },
  hintbook: { label: "Darkest Wiki · 기물 · 보스 인게임 이미지", url: "https://darkestdungeon.hintbook.co/" },
  courtyard: { label: "Darkest Dungeon Wiki · Courtyard", url: "https://darkestdungeon.wiki/curios/courtyard" },
  courtyardNaver: { label: "루시모드 블로그 · 안뜰마당 골동품/상호작용 아이템 정리", url: "https://blog.naver.com/lucy_maud/222285634469" },
  sunwardNamu: { label: "나무위키 · 태양을 향한 섬들", url: "https://namu.moe/w/%EB%8B%A4%ED%82%A4%EC%8A%A4%ED%8A%B8%20%EB%8D%98%EC%A0%84/%EB%AA%A8%EB%93%9C/%ED%83%9C%EC%96%91%EC%9D%84%20%ED%96%A5%ED%95%9C%20%EC%84%AC%EB%93%A4" },
  sunwardRecord: { label: "Sunward Isles 기물 실측표 · 다키스트 던전 마이너 갤러리", url: "https://gall.dcinside.com/mgallery/board/view/?id=darkest&no=124491" },
  sunwardSteam: { label: "Sunward Isles · Steam Workshop", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1689234891" },
  firesEdge: { label: "Red Hook · The Fire's Edge 출시 안내", url: "https://www.darkestdungeon.com/news/the-fire-s-edge-available-now-/" },
  firesEdgeHotfix: { label: "Red Hook · The Fire's Edge Retail 27987 Hotfix", url: "https://www.darkestdungeon.com/news/darkest-dungeon-the-fire-s-edge-hotfix/" },
  night: { label: "The Night Parade · Steam Workshop", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2115544857" },
  courtyardPlus: { label: "Courtyard Plus · Steam Workshop", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1419429961" },
  expeditions: { label: "Darkest Dungeon Wiki · 지역별 보급품 권장표", url: "https://darkestdungeon.wiki.gg/wiki/Expeditions_Guide" },
  quirksNamu: { label: "나무위키 · 다키스트 던전/기벽", url: "https://namu.moe/w/%EB%8B%A4%ED%82%A4%EC%8A%A4%ED%8A%B8%20%EB%8D%98%EC%A0%84/%EA%B8%B0%EB%B2%BD" },
  quirksOfficial: { label: "Darkest Dungeon Wiki · Quirks", url: "https://darkestdungeon.wiki.gg/wiki/Quirks_%28Darkest_Dungeon%29" },
  bossesOfficial: { label: "Darkest Dungeon Wiki · Bosses", url: "https://darkestdungeon.wiki.gg/wiki/Bosses_%28Darkest_Dungeon%29" },
  enemyTypes: { label: "Darkest Dungeon Wiki · Enemy Type", url: "https://darkestdungeon.wiki.gg/wiki/Enemy_Type" },
  statusEffects: { label: "Darkest Dungeon Wiki · 상태이상 · 지역별 상성", url: "https://darkestdungeon.wiki.gg/wiki/Status_Effects_%28Darkest_Dungeon%29" },
  gardenImage: { label: "Garden Guardian 이미지 · 게임 기반 PNG", url: "https://www.pngaaa.com/detail/656356" },
  fanaticImage: { label: "Fanatic 이미지 · 게임 기반 PNG", url: "https://www.pngfind.com/mpng/iibwwxR_https-darkestdungeon-gamepedia-com-file-fanatic-woman-warrior/" },
  shriekerImage: { label: "Shrieker 이미지 · 다키스트 던전 일본 공식 스크린샷", url: "https://darkestdungeon.jp/diary/diary_10.html" }
};

const AREAS = {
  common: { name: "공통", detail: "여러 일반 던전에서 출현" }, ruins: { name: "Ruins", detail: "폐허" }, warrens: { name: "Warrens", detail: "사육장" }, weald: { name: "Weald", detail: "삼림지대" }, cove: { name: "Cove", detail: "해안 만" }, courtyard: { name: "Courtyard +", detail: "Crimson Court / Courtyard Plus" }, farmstead: { name: "Farmstead", detail: "Color of Madness" }, sunward: { name: "Sunward Isles", detail: "Sunward Isles 모드" }, night: { name: "Night Parade", detail: "The Night Parade 모드" }
};

const REGION_ENEMY_INTEL = {
  common: {
    types: "전 지역 공통 적군",
    attack: "상황별 · 출혈/중독 상성 확인",
    defense: "출혈 · 중독 · 스트레스"
  },
  ruins: {
    types: "불경 · 인간",
    attack: "중독 · 기절",
    defense: "스트레스 · 기절 · 표식"
  },
  warrens: {
    types: "야수 · 인간",
    attack: "출혈 · 기절/표식",
    defense: "질병 · 출혈 · 스트레스"
  },
  weald: {
    types: "인간 · 이물 · 야수",
    attack: "출혈 · 약화 · 이동",
    defense: "중독 · 출혈 · 질병/표식"
  },
  cove: {
    types: "이물 · 불경",
    attack: "중독 · 기절",
    defense: "기절 · 출혈 · 끌어오기/스트레스"
  },
  courtyard: {
    types: "흡혈귀 (Bloodsucker)",
    attack: "출혈 · 기절",
    defense: "출혈 · 진홍의 저주 · 공포/스트레스"
  },
  farmstead: {
    types: "허스크 · 전 지역 혼성",
    attack: "조명 효과별 출혈/중독",
    defense: "중독 · 출혈 · 공포/스트레스"
  },
  sunward: {
    types: "모드 고유 적군",
    attack: "개별 적 수치표 확인 불가",
    defense: "개별 적 수치표 확인 불가"
  },
  night: {
    types: "모드 고유 적군",
    attack: "개별 적 수치표 확인 불가",
    defense: "개별 적 수치표 확인 불가"
  }
};

const curioAsset = (name) => `assets/curios/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}.png`;
const sunwardCover = "assets/curios/sunward-isles.jpg";
const nightPreview = "assets/curios/night-parade.jpg";
const bossImage = (slug) => `assets/bosses/${slug}-cutout.png`;
const BOSS_IMAGES = {
  "Necromancer": bossImage("necromancer"),
  "Prophet": bossImage("prophet"),
  "Swine Prince": bossImage("swine-prince"),
  "Flesh": bossImage("flesh"),
  "Hag": bossImage("hag"),
  "Brigand Pounder": bossImage("brigand-pounder"),
  "Siren": bossImage("siren"),
  "Drowned Crew": bossImage("drowned-crew"),
  "Crocodilian": bossImage("crocodilian"),
  "Baron": bossImage("baron"),
  "Viscount": bossImage("viscount"),
  "Countess": bossImage("countess"),
  "Garden Guardian": bossImage("garden-guardian"),
  "Miller": bossImage("miller"),
  "The Sleeper": bossImage("the-sleeper"),
  "Shambler": bossImage("shambler"),
  "Collector": bossImage("the-collector"),
  "Fanatic": bossImage("fanatic"),
  "Thing From the Stars": bossImage("thing-from-the-stars"),
  "Brigand Vvulf": bossImage("brigand-vvulf"),
  "Shrieker": bossImage("shrieker")
};
const I = (supply, effect, kind = "good") => ({ supply, effect, kind });
const C = (area, ko, en, actions, image = curioAsset(en), note = "") => ({ area, ko, en, actions, image, note });

const CURIOS = [
  C("common", "상자", "Crate", [I("맨손", "가보 75% 또는 빈 상자 25%.")]),
  C("common", "버려진 꾸러미", "Discarded Pack", [I("맨손", "전리품 또는 정찰. 드물게 빈손.")]),
  C("common", "기이한 제단", "Eldritch Altar", [I("성수", "무작위 부정 기벽 1개 제거."), I("맨손", "스트레스 +25, 부정 기벽 제거 또는 아무 일 없음.", "warn")]),
  C("common", "가보 상자 I", "Heirloom Chest (1)", [I("해골 열쇠", "가보 ×4."), I("해독제", "가보 ×3."), I("맨손", "가보 ×2 또는 출혈/중독 함정.", "warn")], undefined, "상자 I·II는 외형이 같아 구분할 수 없습니다."),
  C("common", "가보 상자 II", "Heirloom Chest (2)", [I("해골 열쇠", "임의 전리품 ×3."), I("삽", "임의 전리품 ×2 (2/3) 또는 빈손 (1/3).", "neutral"), I("맨손", "임의 전리품 ×2 또는 출혈/중독 함정.", "warn")], undefined, "상자 I·II는 외형이 같아 구분할 수 없습니다."),
  C("common", "자루", "Sack", [I("맨손", "골드 75% 또는 빈손 25%.")]),
  C("common", "횃불 거치대", "Sconce", [I("맨손", "횃불 획득.")]),
  C("common", "쉠블러의 제단", "Shambler's Altar", [I("횃불", "쉠블러 소환. 의도적으로 보스를 부를 때만.", "avoid"), I("맨손", "아무 일 없음.", "neutral")]),
  C("common", "책 더미", "Stack of Books", [I("횃불", "스트레스 +100.", "avoid"), I("맨손", "정찰·저널도 가능하나 스트레스, 부정 기벽, 횃불 -25 위험.", "avoid")]),
  C("common", "고동치는 고치", "Throbbing Cocoons (Infestation)", [I("맨손", "고감염에서만 출현. Gatekeeper와 혈흡혈귀 무리 전투를 확정 소환.", "avoid")], undefined, "안뜰의 동명 기물과 다릅니다. 이 변형에는 횃불 상호작용이 없습니다."),
  C("common", "열린 금고", "Unlocked Strongbox", [I("맨손", "전리품 ×2 (75%) 또는 중독 (25%).", "warn")]),

  C("ruins", "연금술대", "Alchemy Table", [I("약초", "골드/보석 2배."), I("횃불", "밝기 100으로 상승.", "neutral"), I("맨손", "중독 50%, 소량 전리품 또는 빈손.", "warn")]),
  C("ruins", "빛의 제단", "Altar of Light", [I("성수", "야영까지 피해 +30%."), I("맨손", "야영까지 피해 +20%.", "neutral")]),
  C("ruins", "책장", "Bookshelf", [I("맨손", "기벽·정찰·스트레스·횃불 감소 등 무작위. 보통 건너뜀.", "warn")]),
  C("ruins", "고해실", "Confession Booth", [I("성수", "스트레스 -30."), I("맨손", "스트레스, 부정 기벽 또는 빈손.", "warn")]),
  C("ruins", "장식 항아리", "Decorative Urn", [I("성수", "전리품 획득."), I("맨손", "전리품, 질병 또는 빈손.", "warn")]),
  C("ruins", "성스러운 분수", "Holy Fountain", [I("성수", "스트레스 -20, HP 12 회복, 상태이상 제거."), I("맨손", "스트레스/HP 회복 또는 빈손.", "neutral")]),
  C("ruins", "철의 처녀", "Iron Maiden", [I("약초", "전리품 2배."), I("맨손", "전리품 또는 질병.", "warn")]),
  C("ruins", "잠긴 진열장", "Locked Display Cabinet", [I("해골 열쇠", "대량 전리품."), I("삽", "안전하게 개봉."), I("맨손", "전리품 또는 출혈.", "warn")]),
  C("ruins", "잠긴 석관", "Locked Sarcophagus", [I("해골 열쇠", "대량 전리품."), I("삽", "안전하게 개봉."), I("맨손", "전리품 또는 질병/스트레스.", "warn")]),
  C("ruins", "석관", "Sarcophagus", [I("맨손", "전리품 60%, 질병/스트레스 또는 빈손.", "neutral")]),
  C("ruins", "갑옷", "Suit of Armor", [I("맨손", "야영까지 회피 또는 방어 버프.")]),

  C("warrens", "짐승의 성소", "Animalistic Shrine", [I("곡괭이", "퀘스트 목표 파괴·진행."), I("일반 원정", "출현하지 않는 퀘스트 전용 기물.", "neutral")], undefined, "‘짐승의 성소 파괴’ 퀘스트 전용. 성수 상호작용은 없습니다."),
  C("warrens", "뼈 제단", "Bone Altar", [I("맨손", "야영까지 피해 +15% · 명중 +10 · 치명타 +5% · 상태이상 치료.")]),
  C("warrens", "식사 수레", "Dinner Cart", [I("약초", "음식 3개와 추가 전리품."), I("맨손", "음식/전리품 또는 질병.", "warn")]),
  C("warrens", "식료품 상자", "Foodstuff Crate", [I("맨손", "곡물 자루 획득으로 퀘스트 진행.")], undefined, "‘식량 수집’ 퀘스트 전용. 약초 상호작용은 없습니다."),
  C("warrens", "즉석 식탁", "Makeshift Dining Table", [I("약초", "음식 3개와 전리품."), I("맨손", "질병 또는 음식.", "warn")]),
  C("warrens", "밀주 통", "Moonshine Barrel", [I("약초", "야영까지 피해 +30%."), I("맨손", "스트레스/질병 또는 빈손.", "warn")]),
  C("warrens", "사악한 낙서", "Occult Scrawlings", [I("성수", "회피 -20.", "avoid"), I("맨손", "무작위 긍정/부정 기벽, 스트레스 +25 또는 빈손.", "warn")]),
  C("warrens", "뼈 더미", "Pile of Bones", [I("성수", "전리품 2배."), I("맨손", "전리품 또는 질병.", "warn")]),
  C("warrens", "두루마리 더미", "Pile of Scrolls", [I("횃불", "부정 기벽 1개 제거."), I("맨손", "스트레스, 부정 기벽 또는 빈손.", "warn")]),
  C("warrens", "칼날 선반", "Rack of Blades", [I("붕대", "골드/보석 및 음식."), I("맨손", "출혈 또는 전리품.", "warn")]),
  C("warrens", "희생의 돌", "Sacrificial Stone", [I("맨손", "스트레스 +50 (50%), 부정 기벽 제거 또는 Warrens 긍정 기벽. 위험한 도박.", "warn")]),

  C("weald", "고대의 관", "Ancient Coffin", [I("맨손", "전리품, 긍정 기벽 또는 빈손.", "neutral")]),
  C("weald", "짐승 사체", "Beast Carcass", [I("약초", "음식 2개."), I("맨손", "음식, 질병·광견병·Zoophobia 또는 빈손.", "warn")]),
  C("weald", "외과의사의 가방", "Chirurgeon's Satchel", [I("맨손", "Medicine 획득으로 퀘스트 진행.")], undefined, "‘약품 수집’ 퀘스트 전용. 약초로 질병을 치료하지 않습니다."),
  C("weald", "기이한 거미줄", "Eerie Spiderweb", [I("붕대", "골드/보석 2배 + 보석/장신구."), I("맨손", "전리품 또는 Slow Reflexes·Slowdraw 기벽, 빈손.", "warn")]),
  C("weald", "감염된 시체", "Infected Corpse", [I("강력한 연고", "퀘스트 목표 정화·진행.")], undefined, "‘감염된 시체 정화’ 퀘스트 전용. 일반 약초 상호작용은 없습니다."),
  C("weald", "남겨진 여행 가방", "Left Luggage", [I("해골 열쇠", "임의 전리품 3배."), I("해독제", "임의 전리품 3배."), I("맨손", "임의 전리품 4배+일지 또는 중독.", "warn")]),
  C("weald", "미라화된 유해", "Mummified Remains", [I("붕대", "골드/장신구 2배."), I("맨손", "전리품, 중독 또는 빈손.", "warn")]),
  C("weald", "고목", "Old Tree", [I("해독제", "임의 전리품 3배."), I("맨손", "전리품 2배, 중독 또는 빈손.", "warn")]),
  C("weald", "깨끗한 분수", "Pristine Fountain", [I("성수", "스트레스 -30."), I("맨손", "스트레스 -20.", "neutral")]),
  C("weald", "얕은 무덤", "Shallow Grave", [I("삽", "전리품 2배."), I("맨손", "전리품, 질병 또는 스트레스.", "warn")]),
  C("weald", "여행자의 천막", "Traveler's Tent", [I("맨손", "전리품 또는 빈손.", "neutral")]),
  C("weald", "불길한 인형", "Troubling Effigy", [I("성수", "무작위 긍정 기벽 1개."), I("맨손", "긍정/부정 기벽, 출혈·중독·스트레스 또는 빈손.", "warn")]),

  C("cove", "따개비가 낀 상자", "Barnacle Crusted Chest", [I("삽", "임의 전리품 3배."), I("맨손", "전리품 2배, 출혈 또는 빈손.", "warn")]),
  C("cove", "부조", "Bas-Relief", [I("삽", "스트레스 +100.", "avoid"), I("맨손", "긍정/부정 기벽, 질병 또는 빈손. 안정적이지 않음.", "warn")]),
  C("cove", "기수 웅덩이", "Brackish Tide Pool", [I("해독제", "HP 5 회복 또는 스트레스 -6."), I("맨손", "저항 버프, 무작위 질병 또는 빈손.", "warn")]),
  C("cove", "기이한 산호", "Eerie Coral", [I("약초", "부정 기벽 1개 제거."), I("맨손", "스트레스 또는 부정 기벽.", "warn")]),
  C("cove", "물고기 사체", "Fish Carcass", [I("약초", "보석/장신구 2배 + 골드/보석 + 보급품 2개."), I("맨손", "전리품, 적색 역병·중독·출혈 또는 빈손.", "warn")]),
  C("cove", "물고기 우상", "Fish Idol", [I("성수", "야영까지 피해 +30%."), I("맨손", "스트레스 또는 부정 기벽.", "warn")]),
  C("cove", "거대한 굴", "Giant Oyster", [I("삽", "골드/장신구 3배."), I("개 간식", "야영까지 회피 +25%.", "neutral"), I("맨손", "골드/장신구 2배, 출혈 또는 빈손.", "warn")]),
  C("cove", "보호의 문양", "Protective Ward", [I("송과선", "퀘스트 목표 활성화·진행.")], undefined, "‘보호의 문양 활성화’ 퀘스트 전용. 성수 상호작용은 없습니다."),
  C("cove", "뱃머리 조각상", "Ship's Figurehead", [I("맨손", "스트레스 -25~30 또는 야영까지 피해 +20%·속도 +4.")]),
  C("cove", "화물 상자", "Shipment Crate", [I("맨손", "조상 유물 획득으로 퀘스트 진행.")], undefined, "‘조상 유물 수집’ 퀘스트 전용. 삽 상호작용은 없습니다."),

  C("courtyard", "기이한 뼈 더미", "Pile of Strange Bones", [I("붕대", "전리품 또는 피."), I("피", "적 매복 확정.", "avoid"), I("맨손", "출혈 또는 진홍의 저주 가능.", "warn")]),
  C("courtyard", "핏빛 꽃", "Bloodflowers", [I("삽", "가보 2배 및 전리품."), I("성수", "스트레스 +15.", "avoid"), I("맨손", "스트레스·질병·정찰·전리품 또는 빈손.", "warn")]),
  C("courtyard", "저주받은 분수", "Damned Fountain", [I("성수", "스트레스 -30."), I("횃불", "스트레스 +5.", "avoid"), I("맨손", "출혈, 진홍의 저주 또는 전리품.", "warn")]),
  C("courtyard", "불길한 오락", "Disturbing Diversion", [I("삽", "가보 3배."), I("맨손", "스트레스, 기벽 변동 또는 빈손.", "warn")]),
  C("courtyard", "잊힌 별미", "Forgotten Delicacies", [I("약초", "음식 2배와 골드/보급품."), I("맨손", "중독, 저주, 질병 또는 빈손.", "warn")]),
  C("courtyard", "후드 쓴 말괄량이", "Hooded Shrew", [I("피", "비세트 장신구 2개."), I("맨손", "스트레스/질병 또는 빈손.", "warn")]),
  C("courtyard", "고동치는 고치", "Throbbing Cocoons", [I("횃불", "스트레스 -30."), I("맨손", "전투 소환 75%, 전리품 또는 빈손.", "warn")]),
  C("courtyard", "들끓는 벌집", "Thronging Hive", [I("기름묻은 횃불 (퀘스트용)", "전리품 3배와 피 획득 가능."), I("일반 횃불", "퀘스트 아이템과 다름 — 사용하지 않음.", "neutral"), I("맨손", "출혈 25%.", "warn")], undefined, "‘벌집 파괴’ 계열 퀘스트에서만 기름묻은 횃불을 사용합니다. 일반 횃불 효과로 오인하지 마세요."),
  C("courtyard", "와인 상자", "Wine Crate", [I("해독제", "스트레스 -30."), I("삽", "장작 획득."), I("맨손", "저주, Tippler 기벽, 출혈 또는 빈손.", "warn")]),
  C("courtyard", "늙은 말괄량이", "Wizened Shrew", [I("피", "비세트 장신구 3개."), I("맨손", "무작위 질병 또는 빈손.", "warn")]),
  C("courtyard", "잃어버린 보물 상자", "Lost Treasure Box", [I("해골 열쇠", "Courtyard Plus에서는 열쇠 상호작용이 제거되어 효과 없음.", "avoid"), I("맨손", "전리품 + 비세트 장신구 2개 + 보석.", "neutral")], undefined, "Courtyard Plus가 열쇠 구멍을 제거합니다."),
  C("courtyard", "장신구 상자", "Trinket Chest", [I("해골 열쇠", "Courtyard Plus에서는 열쇠 상호작용이 제거되어 효과 없음.", "avoid"), I("맨손", "세트 장신구 1개.")], undefined, "Courtyard Plus가 열쇠 구멍을 제거합니다."),

  C("farmstead", "오염된 수확물", "Corrupted Harvest", [I("맨손", "파티 전체 스트레스 -60.")]),
  C("farmstead", "신선한 수확물", "Fresh Harvest", [I("맨손", "선택 영웅 최대 HP의 90% 회복.")]),
  C("farmstead", "빛나는 파편", "Gleaming Shards", [I("맨손", "혜성 파편 5~15개 획득.")]),
  C("farmstead", "밀드레드", "Mildred", [I("맨손", "장신구 또는 장신구+수정 파편.")]),
  C("farmstead", "밀러의 난롯가", "Miller's Hearth", [I("맨손", "휴식/재정비 지점.")]),
  C("farmstead", "풍성한 수확", "Plentiful Bounty", [I("맨손", "파티 전체 최대 HP의 65% 회복.")]),
  C("farmstead", "썩은 음식", "Rotted Fare", [I("맨손", "선택 영웅 스트레스 -100.")]),
  C("farmstead", "비축품", "Stockpile", [I("해골 열쇠", "식량 6~12 + 임의 보급품 + 장신구."), I("맨손", "아편/약초/식량 중 하나 (2/3) 또는 빈손 (1/3).", "neutral")]),

  C("sunward", "칠색조", "Ho-oh", [I("맨손", "파티 HP 최대치의 25% 회복 + 스트레스 -25. 치유 치명타 없음."), I("성수", "효과 없음.", "neutral")], sunwardCover, "제작자 변경 기록(회복 25%·스트레스 -25)과 실측표를 대조함. 보스방 직전 기물입니다."),
  C("sunward", "하쿠타쿠", "Hakutaku", [I("맨손", "하쿠타쿠의 영예/지혜 긍정 기벽 생성 기록."), I("횃불", "스트레스 +100.", "avoid"), I("기타 보급품", "효과 없음 기록.", "neutral")], sunwardCover),
  C("sunward", "쿠치사케 온나", "Kuchisake Onna", [I("대형 오마모리 (Major Omamori)", "현행 버전의 전용 상황별 상호작용. 결과는 게임 툴팁 확인.", "neutral"), I("맨손", "스트레스 +20.", "warn"), I("일반 보급품", "효과 없음 기록.", "neutral")], sunwardCover, "제작자가 예전 ‘비통의 오마모리’ 상호작용을 대형 오마모리로 변경했다고 명시했습니다."),
  C("sunward", "오래된 신사", "Old Shrine", [I("성수", "야영까지 파티 치명타 +5%."), I("오마모리", "다른 오마모리로 강화."), I("횃불 / 해독제", "효과 없음.", "neutral"), I("맨손", "부정 기벽 생성 또는 아무 일 없음.", "warn")], sunwardCover),
  C("sunward", "잊혀진 향", "Forgotten Incense", [I("횃불", "스트레스 -20 또는 스트레스 해소 효과 +50% (2전투)."), I("붕대 / 약초", "효과 없음.", "neutral"), I("맨손", "스트레스 +20.", "warn")], sunwardCover),
  C("sunward", "야나기 바바", "Yanagi Baba", [I("해독제", "야영까지 방어 +25%."), I("횃불 / 성수 / 약초", "효과 없음.", "neutral"), I("맨손", "실측표에 결과 미기재 — 사용 비권장.", "warn")], sunwardCover),
  C("sunward", "황폐한 오두막집", "Run-down Shack", [I("아편", "부정 기벽 제거."), I("약초", "인간공포증 부정 기벽 생성.", "avoid"), I("횃불 / 성수", "효과 없음.", "neutral"), I("맨손", "모든 소모품 ×4 + 골드/보석 또는 요괴공포증 부정 기벽.", "warn")], sunwardCover),
  C("sunward", "잃어버린 화물", "Lost Cargo", [I("해골 열쇠", "많은 골드 획득."), I("맨손", "소량 골드 또는 아무 일 없음.", "neutral")], sunwardCover),
  C("sunward", "칼날의 통", "Barrel of Blades", [I("붕대", "방어 관통 +15% 버프, 검술의 달인 긍정 기벽 또는 질병 가능."), I("맨손", "실측표에 결과 미기재 — 사용 비권장.", "warn")], sunwardCover),
  C("sunward", "오래된 신사 종", "Old Shrine Bell", [I("오마모리", "다른 오마모리로 강화."), I("맨손", "일정 확률로 긍정 기벽 제거 가능.", "avoid")], sunwardCover),
  C("sunward", "버려진 가마", "Abandoned Palaquin", [I("해골 열쇠", "많은 골드 획득."), I("횃불", "효과 없음.", "neutral"), I("맨손", "‘시체 발견’ 스트레스 증가 또는 아무 일 없음.", "warn")], sunwardCover),
  C("sunward", "비전의 바둑판", "Esoteric Go Table", [I("확인 필요", "현행 Steam 가이드는 출현만 명시. 이 페이지에서 상호작용은 확인하지 못함.", "neutral")], sunwardCover, "개별 기물 상호작용 미확인"),
  C("sunward", "흐트러진 나무", "Disheveled Tree", [I("확인 필요", "현행 Steam 가이드는 출현만 명시. 이 페이지에서 상호작용은 확인하지 못함.", "neutral")], sunwardCover, "개별 기물 상호작용 미확인"),
  C("sunward", "우미보즈의 머리", "Umi-Bozu's Head", [I("맨손", "질병 1개 치료 기록. 대신 공포 4 (10라운드).", "warn")], sunwardCover, "나무위키가 연결한 실측표에만 확인됨; 최신 Steam 목록에는 빠져 있음"),
  C("sunward", "잊어버린 성서", "Unremembered Scriptures", [I("아편", "파티 스트레스 -10."), I("횃불", "스트레스 증가.", "avoid"), I("맨손", "부정 기벽 제거."), I("기타 보급품", "효과 미확인.", "neutral")], sunwardCover)
];

const NIGHT_PARADE = C("night", "Night Parade 신규 기물", "New curios between waves", [I("확인 필요", "제작자는 웨이브 사이에 복수의 신규 기물이 출현한다고만 공개함.", "neutral"), I("비(Rain)", "제작자 답변상 비도 기물로 취급되나, 개별 효과표는 공개되지 않음.", "warn")], nightPreview, "공개된 개별 명칭·효과표 없음 — 90개에 미합산");
const KNOWN_CURIO_TOTAL = CURIOS.length;

const PROVISIONS = {
  ruins: {
    short: { food: "8–12", torch: "8", must: "삽 2 · 약초 1–2 · 해골 열쇠 2–3 · 성수 2–3", extra: "해독제·붕대는 각 0–1이면 충분" },
    medium: { food: "16–20", torch: "10–13", must: "삽 3 · 약초 2–3 · 해골 열쇠 2–4 · 성수 3–4", extra: "해독제·붕대 각 0–2" },
    long: { food: "24–28", torch: "14–16", must: "삽 3–4 · 약초 3–4 · 해골 열쇠 3–5 · 성수 3–5", extra: "해독제·붕대 각 0–3" }
  },
  warrens: {
    short: { food: "8–12", torch: "8–10", must: "약초 2–3 · 붕대 1–3 · 성수 2–3", extra: "삽 1–2 · 해골 열쇠 1–2 · 해독제 0–1" },
    medium: { food: "12–18", torch: "10–16", must: "약초 3–4 · 붕대 2–3 · 성수 3", extra: "삽 2–3 · 해골 열쇠 2–3 · 해독제 0–2" },
    long: { food: "16–20", torch: "16–20", must: "약초 3–5 · 붕대 3–4 · 성수 3–4", extra: "삽 2–4 · 해골 열쇠 2–4 · 해독제 0–3" }
  },
  weald: {
    short: { food: "8–12", torch: "8", must: "삽 3–4 · 해독제 2–3 · 붕대 2", extra: "약초 1 · 해골 열쇠 1–2 · 성수 1" },
    medium: { food: "16–20", torch: "12", must: "삽 4–5 · 해독제 3–4 · 붕대 3", extra: "약초 2 · 해골 열쇠 2–3 · 성수 1–2" },
    long: { food: "20–24", torch: "16", must: "삽 4–6 · 해독제 4–5 · 붕대 4", extra: "약초 2 · 해골 열쇠 2–4 · 성수 2" }
  },
  cove: {
    short: { food: "8–12", torch: "8", must: "삽 3–4 · 붕대 2 · 약초 2 · 해독제 1", extra: "성수 1 · 해골 열쇠 0–1" },
    medium: { food: "16–20", torch: "12", must: "삽 4–5 · 붕대 3–4 · 약초 3–4 · 해독제 1–2", extra: "성수 1–2 · 해골 열쇠 0–2" },
    long: { food: "20–24", torch: "16", must: "삽 4–6 · 붕대 4–6 · 약초 3–5 · 해독제 2–3", extra: "성수 2 · 해골 열쇠 0–3" }
  },
  sunward: {
    short: { food: "8–12", torch: "8", must: "해골 열쇠 2 · 붕대 2 · 해독제 1–2", extra: "오마모리/아편은 기물 상호작용용으로 1–2씩 선택" },
    medium: { food: "16–20", torch: "12", must: "해골 열쇠 3 · 붕대 3 · 해독제 2–3", extra: "오마모리/아편은 기물 상호작용용으로 1–2씩 선택" },
    long: { food: "24–28", torch: "16", must: "해골 열쇠 4 · 붕대 4 · 해독제 3–4", extra: "오마모리/아편은 기물 상호작용용으로 1–2씩 선택" }
  },
  courtyard: { special: { food: "8–12", torch: "8", must: "삽 2+ · 붕대/해독제/약초/성수 각 2–3", extra: "Courtyard Plus에서는 두 상자의 열쇠 상호작용이 제거됨" } },
  farmstead: { special: { food: "견습 0 · 그 외 8–12", torch: "0", must: "해골 열쇠 1(비축품) · 붕대·해독제·약초·성수는 파티에 맞춰", extra: "삽 불필요 · 베테랑/챔피언은 난롯가 야영용 식량 필요" } },
  night: { special: { food: "별도 표 미공개", torch: "별도 표 미공개", must: "모드 제작자 설명에 개별 보급품 표가 없음", extra: "실제 출항 화면의 제공품을 우선" } }
};

const QUIRK_SECTIONS = [
  {
    id: "positive-speed",
    group: "추천 고정 긍정 기벽",
    title: "속도",
    description: "선턴은 처치·기절·표식보다 먼저 위험을 끊을 기회를 만듭니다. 다만 표식 딜러나 느린 영웅을 의도적으로 운용할 때는 파티 순서를 먼저 맞추세요.",
    items: [
      { name: "선명함", en: "Luminous", effect: "속도 +2 · 회피 +5", note: "무난한 범용 1순위." },
      { name: "재빠른 반사신경", en: "Quick Reflexes", effect: "속도 +2", note: "직업·밝기 조건이 없는 안정적인 속도 슬롯." },
      { name: "아침형 인간", en: "Early Riser", effect: "밝기 76 이상에서 속도 +2", note: "밝은 횃불 운용이면 매우 좋음." },
      { name: "상시 경계 / 날랜 손놀림", en: "On Guard / Quickdraw", effect: "첫 차례 속도 +4 (상시 경계는 회피 +5 추가)", note: "첫 턴 제어·버프 영웅에 특히 좋음." }
    ]
  },
  {
    id: "positive-accuracy",
    group: "추천 고정 긍정 기벽",
    title: "명중 · 치명타",
    description: "명중은 회피 높은 적에게 막히는 사고를 줄여 주므로, 장신구로 보완하기 어렵다면 피해보다 우선할 만합니다.",
    items: [
      { name: "타고난 검술가", en: "Natural Swing", effect: "명중 +5", note: "근접·원거리 모두에 적용되는 범용 명중." },
      { name: "타고난 시력", en: "Natural Eye", effect: "원거리 기술 명중 +5", note: "원거리 주력 영웅용." },
      { name: "XX 학살자", en: "XX Slayer", effect: "해당 적 종 대상 명중 +10 · 치명타 +5%", note: "지역의 주요 적 타입과 맞추면 강력함." },
      { name: "정밀한 타격 / 매의 눈", en: "Precision Striker / Eagle Eye", effect: "근접 / 원거리 기술 치명타 +5%", note: "공격 방식에 맞춰 선택." }
    ]
  },
  {
    id: "positive-stability",
    group: "추천 고정 긍정 기벽",
    title: "안정성",
    description: "장기 원정과 보스전에서 뜻밖의 붕괴·죽음의 문턱을 줄이는 방어형 선택입니다.",
    items: [
      { name: "단단한 피부", en: "Hard Skinned", effect: "방어 +10%", note: "보호도 운용 영웅과 잘 맞음." },
      { name: "돌머리", en: "Hard Noggin", effect: "기절 저항 +15%", note: "기절 한 번이 치명적인 영웅에 좋음." },
      { name: "안정적", en: "Steady", effect: "받는 스트레스 -10%", note: "모든 던전에서 실속 있는 생존성." },
      { name: "빛 집착", en: "Photomania", effect: "밝기 76 이상에서 스트레스 -20%", note: "밝은 횃불 원정 전용 강력한 선택." }
    ]
  },
  {
    id: "positive-damage",
    group: "추천 고정 긍정 기벽",
    title: "딜 관련",
    description: "영웅의 실제 공격 방식과 밝기 운영이 맞을 때만 고정 가치가 큽니다.",
    items: [
      { name: "강타자", en: "Slugger", effect: "근접 기술 피해 +10%", note: "근접 딜러 전용." },
      { name: "정확한 조준", en: "Unerring", effect: "원거리 기술 피해 +10%", note: "원거리 딜러 전용." },
      { name: "빛의 전사", en: "Warrior of Light", effect: "밝기 76 이상에서 피해 +10%", note: "횃불 밝게 유지할 때." },
      { name: "XX 혐오", en: "XX Hater", effect: "해당 적 종 대상 피해 +15% · 받는 스트레스 -15%", note: "지역 고정 파티에 특히 좋음." }
    ]
  },
  {
    id: "positive-control",
    group: "추천 고정 긍정 기벽",
    title: "제어 관련",
    description: "기절·이동·약화가 성공하려면 선턴과 명중이 먼저입니다. 이 분류는 사용자 요청에 맞춰 제어 관점으로 재정렬했습니다.",
    items: [
      { name: "상시 경계", en: "On Guard", effect: "첫 차례 속도 +4 · 회피 +5", note: "기절·이동·약화 같은 첫 턴 제어에 좋음." },
      { name: "날랜 손놀림", en: "Quickdraw", effect: "첫 차례 속도 +4", note: "첫 행동 제어가 필요한 영웅용." },
      { name: "재빠른 반사신경", en: "Quick Reflexes", effect: "속도 +2", note: "어떤 라운드에도 적용되는 선턴 보조." },
      { name: "타고난 검술가", en: "Natural Swing", effect: "명중 +5", note: "기절·약화·끌어오기 명중도 보완." }
    ]
  },
  {
    id: "negative-lock",
    group: "추천 고정 부정 기벽",
    title: "해가 작거나 역할에 무관한 ‘슬롯 막이’",
    description: "부정 기벽도 이미 있는 5칸을 차지합니다. 실제 전투·기물 상호작용에 영향이 거의 없는 것만 직업과 스트레스 해소 시설을 확인한 뒤 유지하세요.",
    items: [
      { name: "시설 1곳 제한", en: "Resolution / Deviant Tastes / Known Cheat", effect: "술집 / 사창가 / 도박장 중 한 곳 이용 불가", note: "다른 스트레스 해소 수단이 남을 때만 유지 후보." },
      { name: "공격 방식 불일치 페널티", en: "Lazy Eye / Weak Grip", effect: "원거리 명중 -5 / 근접 치명타 -5%", note: "해당 공격을 전혀 쓰지 않는 영웅에서만 후보." },
      { name: "조건부 밤 페널티", en: "Nyctalopia / Nocturnal", effect: "어두울 때 피해 -10% / 밝을 때 속도 -2", note: "밝은 횃불 고정 운용 등 조건이 분명할 때만." }
    ]
  },
  {
    id: "negative-remove",
    group: "피해야 할 부정 기벽",
    title: "우선 제거 후보",
    description: "기물 강제 조사, 핵심 전투 수치 저하, 파티 역할과 정면으로 충돌하는 기벽은 긍정 기벽 고정보다 먼저 처리하는 편이 안전합니다.",
    items: [
      { name: "도벽", en: "Kleptomaniac", effect: "보물 관련 기물을 멋대로 조사하고 보상을 훔침", note: "초반 재정과 열쇠 상자를 망칠 수 있어 최우선 제거." },
      { name: "강박증 · 광신 계열", en: "Compulsive / Demonomania / Dark Temptation", effect: "기물을 멋대로 조사", note: "특히 쉠블러 제단 등 위험 기물과 조합되면 매우 위험." },
      { name: "느린 반사신경 · 방심", en: "Slow Reflexes / Off Guard", effect: "속도 -1 / 첫 차례 속도 -4·회피 -5", note: "선턴 제어가 핵심인 영웅은 빠르게 제거." },
      { name: "수전증 · 빛 민감증", en: "The Yips / Light Sensitive", effect: "명중 -5 / 밝기 76 이상에서 피해 -10%", note: "명중·밝은 횃불 딜러의 핵심 성능을 훼손." },
      { name: "인대 파열 · 연약함", en: "Torn Rotator / Soft", effect: "근접 피해 -5% / 최대 체력 -10%", note: "근접 딜러·전열 생존 영웅은 우선 정리." }
    ]
  }
];

const BOSS_AREAS = [
  {
    area: "ruins", name: "Ruins", subtitle: "폐허", types: "주요 적 타입 · 불경 · 인간", feature: "언데드 중심이라 출혈 의존보다 기본 딜·기절·명중이 편합니다.",
    bosses: [
      { name: "강령술사", en: "Necromancer", detail: "시체를 불러 전열을 막고 후열을 압박합니다. 후열 타격과 시체 정리가 핵심입니다." },
      { name: "예언자", en: "Prophet", detail: "낙석 표식으로 특정 영웅을 노립니다. 위치·회피·피해 완화 관리가 중요합니다." }
    ]
  },
  {
    area: "warrens", name: "Warrens", subtitle: "사육장", types: "주요 적 타입 · 야수 · 인간", feature: "질병·출혈·스트레스와 높은 보호도를 자주 만납니다. 약초·붕대가 기물과 전투 양쪽에서 유용합니다.",
    bosses: [
      { name: "돼지 왕자", en: "Swine Prince", detail: "윌버의 표식 뒤 강력한 공격이 이어집니다. 윌버 처치 순서와 표식 대응을 계획하세요." },
      { name: "살점", en: "Flesh", detail: "네 부위가 형태를 바꾸며 하나의 체력을 공유합니다. 지속 피해와 광역 압박이 잘 맞습니다." }
    ]
  },
  {
    area: "weald", name: "Weald", subtitle: "삼림지대", types: "주요 적 타입 · 인간 · 이물 · 야수", feature: "중독·질병, 회피 높은 적, 단단한 전열이 섞인 가장 복합적인 일반 지역입니다.",
    bosses: [
      { name: "마녀", en: "Hag", detail: "아군 한 명을 솥에 넣어 전장을 불리하게 만듭니다. 보스를 빠르게 압박할 화력이 필요합니다." },
      { name: "산적 대포", en: "Brigand Pounder", detail: "성냥꾼이 도화선을 붙이기 전에 끊어야 합니다. 후열을 즉시 때릴 수 있어야 합니다." }
    ]
  },
  {
    area: "cove", name: "Cove", subtitle: "해안 만", types: "주요 적 타입 · 이물 · 불경", feature: "해양 이물과 높은 보호도, 출혈·기절·끌어오기를 조심하세요. 삽·붕대·약초 가치가 높습니다.",
    bosses: [
      { name: "세이렌", en: "Siren", detail: "아군을 유혹해 일시적으로 적 편으로 만듭니다. 저항과 아군 피해 조절을 고려하세요." },
      { name: "익사한 선원단", en: "Drowned Crew", detail: "닻으로 아군을 묶고 위치를 흔듭니다. 닻과 구속 상태에 대응할 수단이 필요합니다." }
    ]
  },
  {
    area: "courtyard", name: "Courtyard +", subtitle: "Crimson Court / Courtyard Plus", types: "주요 적 타입 · 흡혈귀 (Bloodsucker)", feature: "에픽 길이의 장거리 원정이며 진홍의 저주와 피 관리가 핵심입니다. Courtyard Plus 기물 변경도 첫 탭에 반영했습니다.",
    bosses: [
      { name: "악어", en: "Crocodilian", detail: "빠른 행동과 이동·출혈 압박이 특징입니다. 초반부터 전열 안정화가 필요합니다." },
      { name: "남작", en: "Baron", detail: "긴 안뜰 진행 끝의 첫 흡혈귀 보스입니다. 고치와 전장 정보 관리가 중요합니다." },
      { name: "자작", en: "Viscount", detail: "시체를 먹어 회복·강화할 수 있습니다. 시체 처리와 장기전 준비가 필요합니다." },
      { name: "백작부인", en: "Countess", detail: "여러 단계로 압박하는 안뜰 최종 보스입니다. 저주·출혈·스트레스 대비가 필요합니다." },
      { name: "정원 수호자", en: "Garden Guardian", detail: "Crimson Court의 특수 보스입니다. 부위와 보호를 고려한 편성이 요구됩니다." }
    ]
  },
  {
    area: "farmstead", name: "Farmstead", subtitle: "Color of Madness", types: "주요 적 타입 · 허스크 · 전 지역 혼성", feature: "방을 탐색하지 않는 웨이브 전투입니다. 첫 웨이브는 허스크, 이후에는 일반 지역과 가장 어두운 던전 적도 섞입니다.",
    bosses: [
      { name: "밀러", en: "Miller", detail: "베테랑 원정의 마무리 보스입니다. 지속 웨이브를 버틴 뒤 싸우는 소모전입니다." },
      { name: "잠자는 자", en: "The Sleeper", detail: "농장의 심화 보스입니다. 장기 연속전이므로 회복·스트레스·장신구 계획을 넉넉히 잡으세요." }
    ]
  },
  {
    area: "special", name: "특수 출현", subtitle: "일반 지역의 변칙 보스", types: "주요 적 타입 · 출현 조건별 상이", feature: "일반 지역 원정에서 조건에 따라 마주칠 수 있으며, Courtyard와 Farmstead에는 출현하지 않는 떠돌이 보스가 있습니다.",
    bosses: [
      { name: "쉠블러", en: "Shambler", detail: "일반 지역 원정 중 조건에 따라 출현합니다. 제단에 횃불을 쓰면 의도적으로 소환됩니다." },
      { name: "수집가", en: "Collector", detail: "일반 원정 중 출현하는 떠돌이 보스입니다. 후열 타격과 소환물 대응이 중요합니다." },
      { name: "광신자", en: "Fanatic", detail: "진홍의 저주 영웅을 데려간 일반 원정에서 출현할 수 있습니다. 불길과 구속에 주의하세요." },
      { name: "별에서 온 존재", en: "Thing From the Stars", detail: "Color of Madness 설치 후 일반 지역에서 출현할 수 있는 떠돌이 보스입니다." },
      { name: "산적 불프", en: "Brigand Vvulf", detail: "특정 마을 이벤트로 등장하는 보스입니다. 경호와 폭발 압박에 대비하세요." },
      { name: "비명자", en: "Shrieker", detail: "둥지·도난 장신구 관련 이벤트에서 등장합니다. 목표와 퇴각 조건을 먼저 확인하세요." }
    ]
  }
];
