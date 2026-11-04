(() => {
  "use strict";

  const STORE_KEY = "tummy-pals-v1";
  const OLD_KEY = "mochi-bites-v1";
  const CUPS = 8;

  const MEALS = [
    { id: "breakfast", label: "Breakfast", emoji: "🌅" },
    { id: "lunch", label: "Lunch", emoji: "☀️" },
    { id: "dinner", label: "Dinner", emoji: "🌙" },
    { id: "snack", label: "Snacks", emoji: "🍪" },
  ];

  const SPECIES = [
    { id: "cat", label: "Kitty" },
    { id: "bunny", label: "Bunny" },
    { id: "puppy", label: "Puppy" },
    { id: "bear", label: "Bear" },
  ];

  // Rough, typical-portion estimates. Labelled as such in the UI.
  const QUICK = [
    { name: "Roti", kcal: 120, protein: 3, emoji: "🫓" },
    { name: "Dal, 1 bowl", kcal: 180, protein: 9, emoji: "🍲" },
    { name: "Rice, 1 cup", kcal: 205, protein: 4, emoji: "🍚" },
    { name: "Paneer, 100 g", kcal: 265, protein: 18, emoji: "🧀" },
    { name: "Chicken breast, 100 g", kcal: 165, protein: 31, emoji: "🍗" },
    { name: "Boiled egg", kcal: 78, protein: 6, emoji: "🥚" },
    { name: "Protein shake", kcal: 120, protein: 24, emoji: "🥤" },
    { name: "Curd, 1 bowl", kcal: 100, protein: 6, emoji: "🍦" },
    { name: "Chai", kcal: 100, protein: 3, emoji: "☕" },
    { name: "Samosa", kcal: 260, protein: 4, emoji: "🥟" },
    { name: "Idli × 2", kcal: 130, protein: 4, emoji: "🍙" },
    { name: "Banana", kcal: 105, protein: 1, emoji: "🍌" },
    { name: "Apple", kcal: 95, protein: 0, emoji: "🍎" },
    { name: "Pizza slice", kcal: 285, protein: 12, emoji: "🍕" },
  ];

  const WORKOUTS = [
    { id: "walk", label: "Walk", emoji: "🚶" },
    { id: "run", label: "Run", emoji: "🏃" },
    { id: "gym", label: "Gym", emoji: "🏋️" },
    { id: "yoga", label: "Yoga", emoji: "🧘" },
    { id: "cycle", label: "Cycle", emoji: "🚴" },
    { id: "dance", label: "Dance", emoji: "💃" },
    { id: "sport", label: "Sport", emoji: "🏸" },
  ];

  const THEMES = [
    { id: "mint", label: "Mint", color: "#4cc49a" },
    { id: "sky", label: "Sky", color: "#5aa9f0" },
    { id: "sunny", label: "Sunny", color: "#f2a42a" },
    { id: "lavender", label: "Lavender", color: "#9b85f0" },
    { id: "pink", label: "Pink", color: "#ff8fab" },
  ];

  const ITEMS = [
    { id: "bow", name: "Bow", emoji: "🎀", slot: "head", level: 2 },
    { id: "glasses", name: "Specs", emoji: "👓", slot: "face", level: 3 },
    { id: "flowers", name: "Flowers", emoji: "🌸", slot: "head", level: 4 },
    { id: "scarf", name: "Scarf", emoji: "🧣", slot: "neck", level: 5 },
    { id: "party", name: "Party hat", emoji: "🥳", slot: "head", level: 6 },
    { id: "crown", name: "Crown", emoji: "👑", slot: "head", level: 8 },
    // Earned by hitting fitness goals rather than by level.
    { id: "sweatband", name: "Sweatband", emoji: "🎽", slot: "head", need: { kind: "workout", n: 3, text: "3 workout days" } },
    { id: "medal", name: "Medal", emoji: "🏅", slot: "neck", need: { kind: "power", n: 1, text: "1 power day" } },
  ];

  // First match wins, so specific words go before general ones.
  const EMOJI_RULES = [
    [/pizza/, "🍕"], [/burger/, "🍔"], [/fries|chips/, "🍟"], [/taco|burrito|wrap|roll/, "🌯"],
    [/samosa|momo|dumpling|gyoza/, "🥟"], [/roti|chapati|paratha|naan|dosa/, "🫓"],
    [/biryani|curry|sabzi|sabji|rajma|chole/, "🍛"], [/dal|daal|soup|stew/, "🍲"],
    [/idli/, "🍙"], [/sushi/, "🍣"], [/ramen|noodle|maggi|pho/, "🍜"], [/pasta|spaghetti/, "🍝"],
    [/salad/, "🥗"], [/sandwich/, "🥪"], [/rice|khichdi|pulao/, "🍚"], [/egg|omelet/, "🥚"],
    [/chicken|wing/, "🍗"], [/mutton|steak|beef|meat/, "🥩"], [/fish|salmon|tuna/, "🐟"],
    [/paneer|cheese/, "🧀"], [/toast|bread|bagel|pav/, "🍞"], [/pancake|waffle/, "🥞"],
    [/oat|cereal|granola|poha|upma/, "🥣"], [/lassi|milk/, "🥛"], [/yogurt|curd|dahi/, "🍦"],
    [/ice cream|kulfi/, "🍨"], [/cake/, "🍰"], [/cookie|biscuit/, "🍪"], [/donut/, "🍩"],
    [/chocolate|candy|laddoo|ladoo|barfi|sweet|mithai/, "🍫"],
    [/coffee|latte|espresso|chai|tea/, "☕"], [/boba/, "🧋"], [/protein|whey/, "🥤"], [/juice|smoothie|shake/, "🧃"],
    [/apple/, "🍎"], [/banana/, "🍌"], [/strawberr|berr/, "🍓"], [/grape/, "🍇"],
    [/orange/, "🍊"], [/mango/, "🥭"], [/avocado/, "🥑"], [/melon/, "🍉"],
    [/carrot/, "🥕"], [/broccoli|veg/, "🥦"], [/corn|bhutta/, "🌽"], [/potato|aloo/, "🥔"],
    [/nut|almond|peanut/, "🥜"],
  ];

  const $ = (id) => document.getElementById(id);

  // ---------- storage ----------
  const freshState = () => ({ pet: null, goal: 2000, proteinGoal: 60, workoutGoal: 30, stepsGoal: 8000, theme: "mint", equipped: { head: null, face: null, neck: null }, days: {} });

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const base = freshState();
        return {
          pet: s.pet && SPECIES.some((x) => x.id === s.pet.species) ? s.pet : null,
          goal: Number(s.goal) || base.goal,
          proteinGoal: Number(s.proteinGoal) || base.proteinGoal,
          workoutGoal: Number(s.workoutGoal) || base.workoutGoal,
          stepsGoal: Number(s.stepsGoal) || base.stepsGoal,
          theme: THEMES.some((t) => t.id === s.theme) ? s.theme : base.theme,
          equipped: { ...base.equipped, ...(s.equipped || {}) },
          days: s.days && typeof s.days === "object" ? s.days : {},
        };
      }
      // Carry over food logs from the earlier Mochi Bites version.
      const old = JSON.parse(localStorage.getItem(OLD_KEY) || "null");
      if (old && old.days) return { ...freshState(), goal: Number(old.goal) || 2000, days: old.days };
    } catch {
      /* unreadable storage: start fresh */
    }
    return freshState();
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* in-memory only */ }
  }

  const state = load();

  function applyTheme(id) {
    document.documentElement.dataset.accent = id;
  }
  applyTheme(state.theme);

  // ---------- dates ----------
  const keyOf = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const fromKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const shift = (k, n) => { const d = fromKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
  const todayKey = () => keyOf(new Date());

  let selected = todayKey();

  const blankDay = () => ({ entries: [], workouts: [], water: 0, pets: 0, steps: 0 });
  const day = (k) => ({ ...blankDay(), ...(state.days[k] || {}) });
  const ensureDay = (k) => {
    const d = (state.days[k] ||= blankDay());
    d.entries ||= []; d.workouts ||= []; d.water ||= 0; d.pets ||= 0; d.steps ||= 0;
    return d;
  };
  const total = (k) => day(k).entries.reduce((s, e) => s + e.kcal, 0);
  const protein = (k) => day(k).entries.reduce((s, e) => s + (e.protein || 0), 0);
  const workoutMin = (k) => day(k).workouts.reduce((s, w) => s + w.min, 0);
  const steps = (k) => day(k).steps || 0;
  const goalHit = (k) => { const p = total(k) / state.goal; return p >= 0.9 && p <= 1.1; };
  const met = (k) => ({
    protein: protein(k) >= state.proteinGoal,
    workout: workoutMin(k) >= state.workoutGoal,
    steps: steps(k) >= state.stepsGoal,
  });
  // A power day is protein, workout and steps all done.
  const powerDay = (k) => { const m = met(k); return m.protein && m.workout && m.steps; };

  // ---------- progress ----------
  function dayXP(k) {
    const d = day(k);
    const m = met(k);
    return Math.min(d.entries.length, 8) * 5 + Math.min(d.water, CUPS) * 3 + Math.min(d.pets, 5) +
      (goalHit(k) ? 20 : 0) + (m.protein ? 15 : 0) + (m.workout ? 15 : 0) + (m.steps ? 15 : 0) +
      (powerDay(k) ? 25 : 0);
  }

  function achievements() {
    const keys = Object.keys(state.days);
    return {
      workout: keys.filter((k) => met(k).workout).length,
      power: keys.filter(powerDay).length,
    };
  }

  function isUnlocked(it, lvl = levelInfo().lvl, ach = achievements()) {
    return it.need ? ach[it.need.kind] >= it.need.n : lvl >= it.level;
  }

  function levelInfo() {
    let xp = Object.keys(state.days).reduce((s, k) => s + dayXP(k), 0);
    let lvl = 1;
    let need = 40;
    while (xp >= need) { xp -= need; lvl++; need = 40 + 20 * (lvl - 1); }
    return { lvl, cur: xp, need };
  }

  function streak() {
    let k = todayKey();
    if (!day(k).entries.length) k = shift(k, -1);
    let n = 0;
    while (day(k).entries.length) { n++; k = shift(k, -1); }
    return n;
  }

  function happiness() {
    const d = day(todayKey());
    return Math.min(100, 20 + Math.min(d.entries.length, 4) * 12 + (d.water || 0) * 3 + Math.min(d.pets || 0, 5) * 2);
  }

  // ---------- helpers ----------
  function pickEmoji(name) {
    const n = name.toLowerCase();
    for (const [re, emo] of EMOJI_RULES) if (re.test(n)) return emo;
    return "🍽️";
  }

  function defaultMeal() {
    const h = new Date().getHours();
    return h < 11 ? "breakfast" : h < 16 ? "lunch" : h < 21 ? "dinner" : "snack";
  }

  function timeOfDay() {
    const h = new Date().getHours();
    return h >= 5 && h < 11 ? "morning" : h >= 11 && h < 17 ? "day" : h >= 17 && h < 21 ? "evening" : "night";
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const petName = () => (state.pet ? state.pet.name : "Your pal");

  let toastTimer;
  function toast(msg, ms = 2000) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  // ---------- pet drawing (static markup only, no user text) ----------
  function eyesSVG(kind) {
    const L = 78, R = 122, Y = 96;
    const pair = (fn) => fn(L) + fn(R);
    switch (kind) {
      case "sparkle":
        return `<g class="eyes">${pair((x) => `<circle class="ink" cx="${x}" cy="${Y}" r="10"/><circle class="shine" cx="${x + 3}" cy="${Y - 4}" r="3.6"/><circle class="shine" cx="${x - 3.5}" cy="${Y + 3.5}" r="1.8"/>`)}</g>`;
      case "smile":
        return pair((x) => `<path class="stroke" d="M${x - 8} ${Y + 2} q8 -10 16 0"/>`);
      case "sleep":
        return pair((x) => `<path class="stroke" d="M${x - 8} ${Y - 1} q8 8 16 0"/>`);
      case "love":
        return pair((x) => `<path fill="#ff5d8f" d="M${x} ${Y + 8} C${x - 14} ${Y - 2} ${x - 7} ${Y - 13} ${x} ${Y - 5} C${x + 7} ${Y - 13} ${x + 14} ${Y - 2} ${x} ${Y + 8} Z"/>`);
      case "squish":
        return `<path class="stroke" d="M${L - 6} ${Y - 6} l11 6 l-11 6"/><path class="stroke" d="M${R + 6} ${Y - 6} l-11 6 l11 6"/>`;
      default:
        return `<g class="eyes">${pair((x) => `<circle class="ink" cx="${x}" cy="${Y}" r="7.5"/><circle class="shine" cx="${x + 2.5}" cy="${Y - 3}" r="2.6"/>`)}</g>`;
    }
  }

  function mouthSVG(kind) {
    switch (kind) {
      case "open":
        return `<g class="mouth"><path class="ink" d="M91 113 q9 15 18 0 Z"/><ellipse class="tongue" cx="100" cy="120" rx="5" ry="3"/></g>`;
      case "o":
        return `<g class="mouth"><ellipse class="ink" cx="100" cy="118" rx="4.5" ry="5.5"/></g>`;
      case "flat":
        return `<g class="mouth"><path class="stroke" d="M95 116 q5 2 10 0"/></g>`;
      default:
        return `<g class="mouth"><path class="stroke" d="M90 113 q5 6 10 0 q5 6 10 0"/></g>`;
    }
  }

  const FACE_FOR = {
    hungry: ["sparkle", "o"],
    happy: ["open", "w"],
    content: ["smile", "w"],
    stuffed: ["squish", "flat"],
    sleeping: ["sleep", "flat"],
    love: ["love", "open"],
    eating: ["smile", "open"],
    cheer: ["smile", "open"],
    champion: ["sparkle", "open"],
  };

  function accessorySVG(id) {
    const line = "var(--line-c)";
    switch (id) {
      case "bow":
        return `<g transform="translate(138 50) rotate(18)"><path d="M0 0 L-20 -12 L-20 12 Z" fill="#ff6b9a" stroke="${line}" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 0 L20 -12 L20 12 Z" fill="#ff6b9a" stroke="${line}" stroke-width="2.5" stroke-linejoin="round"/><circle r="6" fill="#ff4f87" stroke="${line}" stroke-width="2.5"/></g>`;
      case "flowers": {
        const pts = [[62, 58], [78, 47], [100, 43], [122, 47], [138, 58]];
        const cols = ["#ff8fab", "#ffd166", "#c4b0ff", "#ffd166", "#ff8fab"];
        return pts.map(([x, y], i) => {
          const petals = [0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180;
            return `<circle cx="${(x + Math.cos(r) * 5).toFixed(1)}" cy="${(y + Math.sin(r) * 5).toFixed(1)}" r="4.2" fill="${cols[i]}"/>`;
          }).join("");
          return petals + `<circle cx="${x}" cy="${y}" r="3" fill="#fff6c9"/>`;
        }).join("") + `<path d="M58 62 Q100 34 142 62" fill="none" stroke="#7fc79f" stroke-width="2.5" opacity="0.8"/>`;
      }
      case "party":
        return `<g><path d="M82 50 L100 2 L118 50 Z" fill="#8cc8ff" stroke="${line}" stroke-width="2.5" stroke-linejoin="round"/><path d="M88 34 L112 34 M93 20 L107 20" stroke="#ffd166" stroke-width="5"/><circle cx="100" cy="3" r="7" fill="#ff8fab" stroke="${line}" stroke-width="2.5"/></g>`;
      case "crown":
        return `<g><path d="M74 52 L78 24 L90 40 L100 20 L110 40 L122 24 L126 52 Z" fill="#ffd166" stroke="${line}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="42" r="4" fill="#ff6b9a"/><circle cx="84" cy="45" r="3" fill="#8cc8ff"/><circle cx="116" cy="45" r="3" fill="#8cc8ff"/></g>`;
      case "glasses":
        return `<g fill="rgba(255,255,255,0.25)" stroke="#5a4a7a" stroke-width="3"><circle cx="78" cy="96" r="15"/><circle cx="122" cy="96" r="15"/><path d="M93 94 q7 -5 14 0" fill="none"/></g>`;
      case "sweatband":
        return `<g stroke="${line}" stroke-width="2.5" stroke-linejoin="round"><path d="M47 80 Q100 44 153 80 L151 94 Q100 60 49 94 Z" fill="#5aa9f0"/><path d="M52 86 Q100 55 148 86" fill="none" stroke="#fff" stroke-width="3" opacity="0.85"/></g>`;
      case "medal":
        return `<g><path d="M84 140 L95 162 L105 162 L116 140" fill="none" stroke="#5aa9f0" stroke-width="7" stroke-linejoin="round"/><circle cx="100" cy="168" r="12" fill="#ffd166" stroke="${line}" stroke-width="2.5"/><path d="M100 160.5 l2.3 4.8 l5.2 0.6 l-3.9 3.5 l1.1 5.1 l-4.7 -2.6 l-4.7 2.6 l1.1 -5.1 l-3.9 -3.5 l5.2 -0.6 Z" fill="#fff6c9"/></g>`;
      case "scarf":
        return `<g stroke="${line}" stroke-width="2.5" stroke-linejoin="round"><path d="M58 138 Q100 166 142 138 L144 151 Q100 180 56 151 Z" fill="#ff7a7a"/><path d="M116 160 L122 188 L136 184 L130 156 Z" fill="#ff7a7a"/><path d="M70 148 l4 6 M90 156 l3 7 M110 156 l-2 7 M130 148 l-4 6" stroke="#fff" stroke-width="2.5" opacity="0.7"/></g>`;
      default:
        return "";
    }
  }

  function petSVG(species, mood, equipped) {
    const [eyes, mouth] = FACE_FOR[mood] || FACE_FOR.happy;
    const outline = (d, w) =>
      `<path d="${d}" fill="none" stroke="var(--line-c)" stroke-width="${w + 6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--fur)" stroke-width="${w}" stroke-linecap="round"/>`;

    let tail = "", earsBack = "", earsFront = "", marks = "", muzzle = true;
    if (species === "cat") {
      tail = outline("M140 178 C182 182 186 140 166 126", 12);
      earsBack = `<g class="ears-wiggle"><path class="fur" d="M54 74 L58 26 L96 50 Z"/><path class="fur" d="M146 74 L142 26 L104 50 Z"/><path class="ear-in" d="M62 62 L64 38 L84 51 Z"/><path class="ear-in" d="M138 62 L136 38 L116 51 Z"/></g>`;
      marks = `<path class="stroke thin" style="stroke:var(--spot);stroke-width:4" d="M92 50 L94 62 M100 46 L100 60 M108 50 L106 62"/>
        <path class="stroke thin" d="M64 110 L42 106 M64 116 L44 120 M136 110 L158 106 M136 116 L156 120"/>`;
    } else if (species === "bunny") {
      tail = `<circle class="fur" cx="152" cy="180" r="13" style="fill:var(--fur2)"/>`;
      earsBack = `<g class="ears-wiggle"><ellipse class="fur" cx="76" cy="36" rx="14" ry="36" transform="rotate(-12 76 36)"/><ellipse class="fur" cx="124" cy="36" rx="14" ry="36" transform="rotate(12 124 36)"/><ellipse class="ear-in" cx="76" cy="38" rx="6.5" ry="25" transform="rotate(-12 76 38)"/><ellipse class="ear-in" cx="124" cy="38" rx="6.5" ry="25" transform="rotate(12 124 38)"/></g>`;
      muzzle = false;
    } else if (species === "puppy") {
      tail = outline("M146 170 C168 162 172 146 164 134", 12);
      earsFront = `<g class="ears-wiggle"><ellipse class="fur" style="fill:var(--ear)" cx="50" cy="92" rx="17" ry="33" transform="rotate(18 50 92)"/><ellipse class="fur" style="fill:var(--ear)" cx="150" cy="92" rx="17" ry="33" transform="rotate(-18 150 92)"/></g>`;
      marks = `<ellipse class="spot" cx="124" cy="88" rx="17" ry="15" opacity="0.75"/>`;
    } else {
      tail = `<circle class="fur" cx="150" cy="182" r="9"/>`;
      earsBack = `<g class="ears-wiggle"><circle class="fur" cx="58" cy="54" r="19"/><circle class="fur" cx="142" cy="54" r="19"/><circle class="ear-in" style="fill:var(--ear)" cx="58" cy="54" r="10"/><circle class="ear-in" style="fill:var(--ear)" cx="142" cy="54" r="10"/></g>`;
    }

    const eq = equipped || {};
    const nose = species === "cat" || species === "bunny"
      ? `<path fill="#ff8fa3" stroke="var(--line-c)" stroke-width="2" stroke-linejoin="round" d="M95 106 L105 106 L100 112 Z"/>`
      : `<ellipse class="ink" cx="100" cy="108" rx="7" ry="5"/><ellipse class="shine" cx="98" cy="106.5" rx="2.4" ry="1.4"/>`;

    return `
      <ellipse class="shadow-e" cx="100" cy="203" rx="56" ry="7"/>
      <g class="bod">
        <g class="tail">${tail}</g>
        <g class="belly-g">
          <ellipse class="fur" cx="100" cy="164" rx="52" ry="36"/>
          <ellipse class="fur2" cx="100" cy="172" rx="30" ry="22"/>
        </g>
        <ellipse class="fur" cx="74" cy="196" rx="15" ry="9"/>
        <ellipse class="fur" cx="126" cy="196" rx="15" ry="9"/>
        ${earsBack}
        <circle class="fur" cx="100" cy="96" r="54"/>
        ${earsFront}
        ${marks}
        ${eq.neck ? accessorySVG(eq.neck) : ""}
        ${muzzle ? `<ellipse class="fur2" cx="100" cy="114" rx="22" ry="15"/>` : ""}
        <ellipse class="cheek" cx="64" cy="112" rx="10" ry="6"/>
        <ellipse class="cheek" cx="136" cy="112" rx="10" ry="6"/>
        ${eyesSVG(eyes)}
        ${nose}
        ${mouthSVG(mouth)}
        ${eq.face ? accessorySVG(eq.face) : ""}
        ${eq.head ? accessorySVG(eq.head) : ""}
        ${mood === "sleeping" ? `<text x="150" y="44" font-family="Fredoka" font-weight="700" font-size="18" fill="var(--line-c)" opacity="0.6">z</text><text x="164" y="28" font-family="Fredoka" font-weight="700" font-size="13" fill="var(--line-c)" opacity="0.45">z</text>` : ""}
      </g>`;
  }

  // ---------- mood ----------
  let transient = null; // { mood, until }
  let transientTimer;

  function setTransient(mood, ms) {
    transient = { mood, until: Date.now() + ms };
    clearTimeout(transientTimer);
    transientTimer = setTimeout(() => { transient = null; renderPet(); }, ms);
    renderPet();
  }

  function currentMood() {
    const k = todayKey();
    const eaten = total(k);
    const p = eaten / state.goal;
    const water = day(k).water || 0;
    const h = new Date().getHours();
    const name = petName();

    if (transient && transient.until > Date.now()) {
      if (transient.mood === "love") return { mood: "love", bubble: null, text: `${name} loves you! 💕` };
      if (transient.mood === "cheer") return { mood: "cheer", bubble: "💪", text: "Yay, we moved! So strong 💪" };
      return { mood: "eating", bubble: null, text: "Nom nom nom…" };
    }
    if (timeOfDay() === "night" && eaten > 0) return { mood: "sleeping", bubble: "💤", text: `${name} is sleeping. Sweet dreams!` };
    if (powerDay(k)) return { mood: "champion", bubble: "🏆", text: `Power day! ${name} is doing a happy dance 🏆` };
    const needsMove = workoutMin(k) < state.workoutGoal && h >= 16;
    if (eaten === 0) return { mood: "hungry", bubble: "🍙", text: `${name} is hungry! Feed me something?` };
    if (p < 0.5) {
      if (water < 2 && h >= 12) return { mood: "hungry", bubble: "💧", text: `${name} is thirsty. A cup of water?` };
      return { mood: "hungry", bubble: "🍙", text: "Yummy! Still a little hungry…" };
    }
    if (p < 0.9) {
      if (needsMove) return { mood: "happy", bubble: "👟", text: `${name} wants to go for a walk with you!` };
      if (water < 4 && h >= 14) return { mood: "happy", bubble: "💧", text: `Feeling good! ${name} wants some water.` };
      return { mood: "happy", bubble: "💕", text: `${name} is happy and playful!` };
    }
    if (p <= 1.1) return { mood: "content", bubble: "⭐", text: `Perfect tummy! ${name} is so proud of you ✨` };
    return { mood: "stuffed", bubble: "💤", text: `So full… ${name} needs a nap. Tomorrow is a new day!` };
  }

  // ---------- render ----------
  function renderPet() {
    const pet = $("pet");
    const species = state.pet ? state.pet.species : "cat";
    const m = currentMood();
    pet.setAttribute("class", `pet ${species} ${m.mood}`);
    pet.innerHTML = petSVG(species, m.mood, state.equipped);
    const bubble = $("bubble");
    if (m.bubble) { bubble.textContent = m.bubble; bubble.classList.remove("hide"); }
    else bubble.classList.add("hide");
    $("speech").textContent = m.text;
    $("petBtn").setAttribute("aria-label", `Pet ${petName()}. ${m.text}`);
  }

  function renderRoom() {
    const tod = timeOfDay();
    const room = $("room");
    room.className = "room " + tod;
    $("sky").textContent = { morning: "🌤️", day: "☀️", evening: "🌇", night: "🌙" }[tod];
    const today = day(todayKey());
    const last = today.entries[today.entries.length - 1];
    $("foodBowl").classList.toggle("empty", !last);
    $("foodBowl").firstElementChild.textContent = last ? last.emoji : "🍖";
    $("waterBowl").classList.toggle("empty", !(today.water > 0));
  }

  const RING = 2 * Math.PI * 26;

  function renderGoals() {
    const k = todayKey();
    const eaten = total(k);
    const m = met(k);
    const goals = [
      { name: "Calories", ico: "🍽️", val: eaten, goal: state.goal, unit: "kcal", color: eaten > state.goal * 1.1 ? "var(--lilac)" : "var(--peach)", met: goalHit(k) },
      { name: "Protein", ico: "💪", val: protein(k), goal: state.proteinGoal, unit: "g", color: "#ff8a65", met: m.protein },
      { name: "Workout", ico: "🏃", val: workoutMin(k), goal: state.workoutGoal, unit: "min", color: "var(--accent)", met: m.workout },
      { name: "Steps", ico: "👟", val: steps(k), goal: state.stepsGoal, unit: "", color: "var(--sky)", met: m.steps },
    ];
    const box = $("goals");
    box.replaceChildren();
    for (const g of goals) {
      const wrap = el("div", "goal" + (g.met ? " met" : ""));
      wrap.setAttribute("aria-label", `${g.name}: ${g.val} of ${g.goal} ${g.unit}${g.met ? ", done" : ""}`);
      const ring = el("div", "goal-ring");
      const frac = Math.min(g.val / g.goal, 1);
      ring.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="trk" cx="32" cy="32" r="26"/><circle class="val" cx="32" cy="32" r="26" stroke="${g.color}" stroke-dasharray="${RING.toFixed(1)}" stroke-dashoffset="${(RING * (1 - frac)).toFixed(1)}"/></svg>`;
      ring.append(el("span", "ico", g.ico));
      const fmt = (n) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString());
      wrap.append(ring, el("span", "g-name", g.name), el("span", "g-val", `${fmt(g.val)} / ${fmt(g.goal)}${g.unit ? " " + g.unit : ""}`));
      box.append(wrap);
    }
    $("powerBadge").hidden = !powerDay(k);
  }

  function renderStats() {
    const k = todayKey();
    renderGoals();
    const w = day(k).water;
    $("waterText").textContent = `${w} / ${CUPS} cups`;

    const hap = happiness();
    $("happyBar").style.width = `${hap}%`;
    $("happyText").textContent = `${hap}%`;

    const L = levelInfo();
    $("levelNum").textContent = L.lvl;
    $("levelTop").textContent = L.lvl;
    $("xpBar").style.width = `${(L.cur / L.need) * 100}%`;
    $("xpText").textContent = `${L.cur} / ${L.need} XP`;

    const s = streak();
    $("streak").textContent = `🔥 ${s} day${s === 1 ? "" : "s"}`;
    $("petNameTop").textContent = petName();
    $("petNameFeed").textContent = petName();
    $("petNameMove").textContent = petName();

    const cups = $("cups");
    cups.replaceChildren();
    for (let i = 0; i < CUPS; i++) {
      const b = el("button", "cup" + (i < w ? " full" : ""), "💧");
      b.type = "button";
      b.setAttribute("aria-label", `Water cup ${i + 1}`);
      b.setAttribute("aria-pressed", String(i < w));
      b.addEventListener("click", () => setWater(i < w && i === w - 1 ? i : i + 1));
      cups.append(b);
    }
  }

  function renderDiary() {
    const t = todayKey();
    $("dayLabel").textContent = selected === t ? "Today" : selected === shift(t, -1) ? "Yesterday"
      : fromKey(selected).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    $("nextDay").disabled = selected >= t;

    const week = $("week");
    week.replaceChildren();
    for (let i = -6; i <= 0; i++) {
      const k = shift(selected, i);
      const dk = day(k);
      const logged = dk.entries.length > 0 || dk.workouts.length > 0 || dk.steps > 0;
      const b = el("button", "wday" + (k === selected ? " sel" : ""));
      b.type = "button";
      b.disabled = k > t;
      const stamp = el("span", "stamp" + (logged ? "" : " blank"), powerDay(k) ? "🏆" : goalHit(k) ? "⭐" : "🐾");
      b.append(stamp, el("span", "d", fromKey(k).toLocaleDateString(undefined, { weekday: "short" })));
      b.setAttribute("aria-label", `${fromKey(k).toLocaleDateString(undefined, { weekday: "long" })}: ${total(k)} kcal${powerDay(k) ? ", power day" : goalHit(k) ? ", calorie goal reached" : ""}`);
      b.addEventListener("click", () => { selected = k; renderDiary(); });
      week.append(b);
    }

    $("stepsLabel").textContent = `👟 Steps ${selected === t ? "today" : "· " + $("dayLabel").textContent}`;
    $("stepsInput").value = steps(selected) || "";

    const log = $("log");
    log.replaceChildren();
    const sel = day(selected);
    const entries = sel.entries;
    const delBtn = (label, fn) => {
      const del = el("button", "del", "×");
      del.type = "button";
      del.setAttribute("aria-label", `Remove ${label}`);
      del.addEventListener("click", fn);
      return del;
    };
    if (sel.workouts.length || sel.steps) {
      const group = el("div", "meal-group");
      const head = el("div", "meal-head");
      head.append(el("span", null, "🏃 Movement"), el("span", null, `${workoutMin(selected)} min`));
      group.append(head);
      for (const w of sel.workouts) {
        const row = el("div", "entry");
        row.append(el("span", "emo", w.emoji), el("span", "name", w.label), el("span", "kcal", `${w.min} min`),
          delBtn(w.label, () => removeWorkout(w.id)));
        group.append(row);
      }
      if (sel.steps) {
        const row = el("div", "entry");
        row.append(el("span", "emo", "👟"), el("span", "name", "Steps"), el("span", "kcal", sel.steps.toLocaleString()));
        group.append(row);
      }
      log.append(group);
    }
    if (!entries.length) {
      const empty = el("div", "empty");
      empty.append(el("span", "emo", "🍽️"), el("span", null, selected === t ? "No food yet today." : "No food logged this day."));
      log.append(empty);
      return;
    }
    for (const meal of MEALS) {
      const items = entries.filter((e) => e.meal === meal.id);
      if (!items.length) continue;
      const group = el("div", "meal-group");
      const head = el("div", "meal-head");
      head.append(el("span", null, `${meal.emoji} ${meal.label}`), el("span", null, `${items.reduce((s, e) => s + e.kcal, 0)} kcal`));
      group.append(head);
      for (const e of items) {
        const row = el("div", "entry");
        const name = el("span", "name", e.name);
        if (e.protein) name.append(el("small", "prot", ` · ${e.protein}g protein`));
        row.append(el("span", "emo", e.emoji), name, el("span", "kcal", String(e.kcal)), delBtn(e.name, () => removeEntry(e.id)));
        group.append(row);
      }
      log.append(group);
    }
  }

  function renderWardrobe() {
    const lvl = levelInfo().lvl;
    const ach = achievements();
    const box = $("wardrobe");
    box.replaceChildren();
    for (const it of ITEMS) {
      const unlocked = isUnlocked(it, lvl, ach);
      const lockText = it.need ? it.need.text : `level ${it.level}`;
      const on = state.equipped[it.slot] === it.id;
      const b = el("button", "item" + (unlocked ? "" : " locked") + (on ? " on" : ""));
      b.type = "button";
      b.append(el("span", "i-emo", it.emoji), el("span", "i-name", unlocked ? it.name : it.need ? `🔒 ${it.need.text}` : `🔒 Lv ${it.level}`));
      b.setAttribute("aria-label", unlocked ? `${it.name}${on ? ", wearing" : ""}` : `${it.name}, unlocks with ${lockText}`);
      if (unlocked) b.setAttribute("aria-pressed", String(on));
      b.addEventListener("click", () => {
        if (!unlocked) { toast(`Get ${lockText} to unlock the ${it.name.toLowerCase()}`); return; }
        state.equipped[it.slot] = on ? null : it.id;
        save();
        renderWardrobe();
        renderPet();
        if (!on) bounce();
      });
      box.append(b);
    }
  }

  function render() {
    renderRoom();
    renderPet();
    renderStats();
    renderDiary();
    renderWardrobe();
  }

  // ---------- effects ----------
  function fxSpan(text, x, y) {
    const s = el("span", null, text);
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    $("fx").append(s);
    return s;
  }

  function petPoint(fx, fy) {
    const room = $("room").getBoundingClientRect();
    const r = $("petBtn").getBoundingClientRect();
    return { x: r.left - room.left + r.width * fx, y: r.top - room.top + r.height * fy };
  }

  function hearts(n = 5, chars = ["💖", "💕", "💗"]) {
    if (reduceMotion) return;
    const c = petPoint(0.5, 0.25);
    for (let i = 0; i < n; i++) {
      const s = fxSpan(chars[i % chars.length], c.x - 12 + (Math.random() - 0.5) * 70, c.y);
      s.animate(
        [{ transform: "translateY(0) scale(0.6)", opacity: 1 }, { transform: `translate(${(Math.random() - 0.5) * 40}px, -110px) scale(1.1)`, opacity: 0 }],
        { duration: 1000 + Math.random() * 500, delay: i * 90, easing: "ease-out", fill: "forwards" }
      ).onfinish = () => s.remove();
    }
  }

  function floatText(text) {
    if (reduceMotion) return;
    const c = petPoint(0.8, 0.2);
    const s = fxSpan(text, c.x, c.y);
    s.style.fontSize = "0.95rem";
    s.style.fontWeight = "900";
    s.style.color = "#e0a800";
    s.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-50px)", opacity: 0 }],
      { duration: 1200, easing: "ease-out", fill: "forwards" }).onfinish = () => s.remove();
  }

  function bounce() {
    const pet = $("pet");
    pet.classList.remove("bounce");
    void pet.getBoundingClientRect();
    pet.classList.add("bounce");
    setTimeout(() => pet.classList.remove("bounce"), 600);
  }

  function flyFood(emoji, done) {
    if (reduceMotion) { done(); return; }
    const room = $("room").getBoundingClientRect();
    const b = $("foodBowl").getBoundingClientRect();
    const from = { x: b.left - room.left + b.width / 2 - 14, y: b.top - room.top - 26 };
    const to = petPoint(0.5, 116 / 210);
    to.x -= 14; to.y -= 14;
    const s = fxSpan(emoji, from.x, from.y);
    s.style.fontSize = "1.8rem";
    const dx = to.x - from.x, dy = to.y - from.y;
    s.animate(
      [
        { transform: "translate(0,0) scale(1)" },
        { transform: `translate(${dx * 0.5}px, ${dy - 90}px) scale(1.2) rotate(180deg)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.3) rotate(360deg)`, opacity: 0.2 },
      ],
      { duration: 650, easing: "ease-in-out", fill: "forwards" }
    ).onfinish = () => { s.remove(); done(); };
  }

  function confetti() {
    if (reduceMotion) return;
    const c = petPoint(0.5, 0.3);
    const bits = ["✨", "⭐", "🎉", "💖", "🌟"];
    for (let i = 0; i < 14; i++) {
      const s = fxSpan(bits[i % bits.length], c.x, c.y);
      const a = (Math.PI * 2 * i) / 14;
      s.animate(
        [{ transform: "translate(0,0) scale(0.4)", opacity: 1 },
         { transform: `translate(${Math.cos(a) * 130}px, ${Math.sin(a) * 100 - 30}px) scale(1.1)`, opacity: 0 }],
        { duration: 1300, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" }
      ).onfinish = () => s.remove();
    }
  }

  // Run an action, then celebrate any goals, level-ups or unlocks it caused.
  function withLevelCheck(fn) {
    const snap = () => {
      const k = todayKey();
      const lvl = levelInfo().lvl;
      const ach = achievements();
      return { lvl, m: met(k), power: powerDay(k), unlocked: ITEMS.filter((it) => isUnlocked(it, lvl, ach)).map((it) => it.id) };
    };
    const b = snap();
    fn();
    const a = snap();
    const msgs = [];
    let party = false;
    if (a.power && !b.power) { msgs.push("🏆 Power day! All goals done"); party = true; }
    else {
      for (const [key, label] of [["protein", "💪 Protein"], ["workout", "🏃 Workout"], ["steps", "👟 Steps"]])
        if (a.m[key] && !b.m[key]) msgs.push(`${label} goal done!`);
    }
    if (a.lvl > b.lvl) { msgs.push(`🎉 Level ${a.lvl}!`); party = true; }
    const fresh = ITEMS.filter((it) => a.unlocked.includes(it.id) && !b.unlocked.includes(it.id));
    if (fresh.length) msgs.push(`Unlocked ${fresh.map((u) => u.emoji + " " + u.name).join(", ")}`);
    if (msgs.length) {
      setTimeout(() => {
        if (party) confetti(); else hearts(4, ["✨", "⭐", "💪"]);
        toast(msgs.join(" · "), 3400);
      }, 500);
    }
  }

  // ---------- actions ----------
  function addEntry(name, kcal, meal, emoji, prot = 0) {
    const emo = emoji || pickEmoji(name);
    const isToday = selected === todayKey();
    withLevelCheck(() => {
      ensureDay(selected).entries.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name, kcal, meal, emoji: emo, protein: prot,
      });
      save();
    });
    renderDiary();
    renderWardrobe();
    if (!isToday) { renderStats(); toast(`${emo} Added to ${$("dayLabel").textContent}`); return; }
    renderRoom();
    $("foodBowl").firstElementChild.textContent = emo;
    // Bring the room into view so the feeding is visible, e.g. after tapping a treat lower down.
    const r = $("room").getBoundingClientRect();
    const hidden = r.bottom < r.height * 0.6 || r.top > window.innerHeight - r.height * 0.6;
    if (hidden) $("room").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setTimeout(() => flyFood(emo, () => {
      setTransient("eating", 1400);
      bounce();
      hearts(3, ["💖", "✨", "💕"]);
      floatText("+5 XP");
      renderStats();
    }), hidden ? 450 : 0);
  }

  function removeEntry(id) {
    const d = ensureDay(selected);
    d.entries = d.entries.filter((e) => e.id !== id);
    save();
    render();
  }

  function addWorkout(type, min) {
    const isToday = selected === todayKey();
    withLevelCheck(() => {
      ensureDay(selected).workouts.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        type: type.id, label: type.label, emoji: type.emoji, min,
      });
      save();
    });
    renderStats();
    renderDiary();
    renderWardrobe();
    if (!isToday) { toast(`${type.emoji} Added to ${$("dayLabel").textContent}`); return; }
    setTransient("cheer", 1600);
    bounce();
    hearts(4, [type.emoji, "💪", "✨"]);
    floatText(`+${min} min`);
  }

  function removeWorkout(id) {
    const d = ensureDay(selected);
    d.workouts = d.workouts.filter((w) => w.id !== id);
    save();
    render();
  }

  function setSteps(n) {
    const isToday = selected === todayKey();
    const prev = steps(selected);
    withLevelCheck(() => {
      ensureDay(selected).steps = Math.max(0, Math.min(100000, Math.round(n)));
      save();
    });
    renderStats();
    renderDiary();
    renderWardrobe();
    renderPet();
    if (isToday && n > prev) { bounce(); hearts(3, ["👟", "✨"]); }
  }

  function setWater(n) {
    const prev = day(todayKey()).water || 0;
    withLevelCheck(() => {
      ensureDay(todayKey()).water = Math.max(0, Math.min(CUPS, n));
      save();
    });
    renderStats();
    renderRoom();
    renderPet();
    renderWardrobe();
    if (n > prev) { bounce(); hearts(2, ["💧", "💙"]); }
    if (n === CUPS && prev < CUPS) toast(`💧 All 8 cups! ${petName()} is super hydrated`);
  }

  function petThePet() {
    withLevelCheck(() => {
      ensureDay(todayKey()).pets += 1;
      save();
    });
    setTransient("love", 1500);
    bounce();
    hearts();
    renderStats();
    renderWardrobe();
  }

  function currentWorkout() {
    const c = document.querySelector('input[name="wtype"]:checked');
    return WORKOUTS.find((w) => w.id === (c ? c.value : "walk")) || WORKOUTS[0];
  }

  function currentMeal() {
    const c = document.querySelector('input[name="meal"]:checked');
    return c ? c.value : defaultMeal();
  }

  // ---------- setup dialog ----------
  const setup = $("setup");
  let pickedSpecies = "cat";
  let pickedTheme = state.theme;

  function renderSwatches() {
    const box = $("swatches");
    box.replaceChildren();
    for (const t of THEMES) {
      const b = el("button", "swatch");
      b.type = "button";
      b.style.background = t.color;
      b.title = t.label;
      b.setAttribute("role", "radio");
      b.setAttribute("aria-label", t.label);
      b.setAttribute("aria-checked", String(t.id === pickedTheme));
      // Preview straight away; reverted on cancel.
      b.addEventListener("click", () => { pickedTheme = t.id; applyTheme(t.id); renderSwatches(); });
      box.append(b);
    }
  }

  function renderSpeciesPick() {
    const box = $("speciesPick");
    box.replaceChildren();
    for (const sp of SPECIES) {
      const b = el("button", "sp");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", String(sp.id === pickedSpecies));
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 -6 200 216");
      svg.setAttribute("class", `pet ${sp.id}`);
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = petSVG(sp.id, "happy", {});
      b.append(svg, el("span", null, sp.label));
      b.addEventListener("click", () => { pickedSpecies = sp.id; renderSpeciesPick(); });
      box.append(b);
    }
  }

  function openSetup() {
    const first = !state.pet;
    pickedSpecies = state.pet ? state.pet.species : "cat";
    $("setupTitle").textContent = first ? "Adopt a pal!" : "Your pal";
    $("petName").value = state.pet ? state.pet.name : "";
    $("goalInput").value = state.goal;
    $("proteinGoalInput").value = state.proteinGoal;
    $("workoutGoalInput").value = state.workoutGoal;
    $("stepsGoalInput").value = state.stepsGoal;
    $("setupCancel").hidden = first;
    pickedTheme = state.theme;
    renderSpeciesPick();
    renderSwatches();
    if (typeof setup.showModal === "function") setup.showModal();
    else {
      // Very old browsers: fall back to defaults.
      state.pet = { species: "cat", name: "Biscuit" };
      save();
      render();
    }
  }

  setup.addEventListener("cancel", (e) => { if (!state.pet) e.preventDefault(); });
  setup.addEventListener("close", () => {
    if (setup.returnValue !== "save") { applyTheme(state.theme); return; }
    state.theme = pickedTheme;
    const name = $("petName").value.trim().slice(0, 16) || "Biscuit";
    const goal = Math.round(Number($("goalInput").value));
    const first = !state.pet;
    state.pet = { species: pickedSpecies, name };
    if (goal >= 800 && goal <= 6000) state.goal = goal;
    const num = (id, lo, hi) => { const v = Math.round(Number($(id).value)); return v >= lo && v <= hi ? v : null; };
    state.proteinGoal = num("proteinGoalInput", 10, 300) ?? state.proteinGoal;
    state.workoutGoal = num("workoutGoalInput", 5, 300) ?? state.workoutGoal;
    state.stepsGoal = num("stepsGoalInput", 500, 50000) ?? state.stepsGoal;
    save();
    render();
    bounce();
    hearts();
    if (first) toast(`🐾 Welcome home, ${name}!`, 2600);
  });

  // ---------- wire up ----------
  const mealInput = document.querySelector(`input[name="meal"][value="${defaultMeal()}"]`);
  if (mealInput) mealInput.checked = true;

  for (const q of QUICK) {
    const chip = el("button", "chip");
    chip.type = "button";
    chip.append(`${q.emoji} ${q.name} `, el("b", null, `${q.kcal} · ${q.protein}g`));
    chip.setAttribute("aria-label", `${q.name}, ${q.kcal} kcal, ${q.protein} g protein`);
    chip.addEventListener("click", () => addEntry(q.name, q.kcal, currentMeal(), q.emoji, q.protein));
    $("quickChips").append(chip);
  }

  $("addForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = $("foodName").value.trim();
    const kcal = Math.round(Number($("foodKcal").value));
    if (!name || !Number.isFinite(kcal) || kcal < 1 || kcal > 5000) return;
    const prot = Math.max(0, Math.min(300, Math.round(Number($("foodProtein").value) || 0)));
    addEntry(name, kcal, currentMeal(), null, prot);
    $("foodName").value = "";
    $("foodKcal").value = "";
    $("foodProtein").value = "";
  });

  WORKOUTS.forEach((w, i) => {
    const lab = el("label");
    const inp = el("input");
    inp.type = "radio"; inp.name = "wtype"; inp.value = w.id; inp.checked = i === 0;
    lab.append(inp, el("span", null, `${w.emoji} ${w.label}`));
    $("workoutTypes").append(lab);
  });

  $("workoutForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const min = Math.round(Number($("workoutMin").value));
    if (!Number.isFinite(min) || min < 1 || min > 600) return;
    addWorkout(currentWorkout(), min);
    $("workoutMin").value = "";
  });

  $("stepsForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const v = Number($("stepsInput").value);
    if (Number.isFinite(v) && v >= 0) setSteps(v);
  });
  document.querySelectorAll("[data-steps]").forEach((b) =>
    b.addEventListener("click", () => setSteps(steps(selected) + Number(b.dataset.steps))));

  $("petBtn").addEventListener("click", petThePet);
  $("openSettings").addEventListener("click", openSetup);
  $("prevDay").addEventListener("click", () => { selected = shift(selected, -1); renderDiary(); });
  $("nextDay").addEventListener("click", () => { if (selected < todayKey()) { selected = shift(selected, 1); renderDiary(); } });
  $("dayLabel").addEventListener("click", () => { selected = todayKey(); renderDiary(); });

  // Keep the room's time of day and "today" fresh if the app stays open.
  let lastToday = todayKey();
  setInterval(() => {
    const t = todayKey();
    if (t !== lastToday) { if (selected === lastToday) selected = t; lastToday = t; }
    render();
  }, 60_000);

  render();
  if (!state.pet) openSetup();
})();
