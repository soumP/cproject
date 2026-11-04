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
    { name: "Roti", kcal: 120, emoji: "🫓" },
    { name: "Dal, 1 bowl", kcal: 180, emoji: "🍲" },
    { name: "Rice, 1 cup", kcal: 205, emoji: "🍚" },
    { name: "Chai", kcal: 100, emoji: "☕" },
    { name: "Samosa", kcal: 260, emoji: "🥟" },
    { name: "Idli × 2", kcal: 130, emoji: "🍙" },
    { name: "Banana", kcal: 105, emoji: "🍌" },
    { name: "Apple", kcal: 95, emoji: "🍎" },
    { name: "Boiled egg", kcal: 78, emoji: "🥚" },
    { name: "Pizza slice", kcal: 285, emoji: "🍕" },
    { name: "Cookie", kcal: 80, emoji: "🍪" },
  ];

  const ITEMS = [
    { id: "bow", name: "Bow", emoji: "🎀", slot: "head", level: 2 },
    { id: "glasses", name: "Specs", emoji: "👓", slot: "face", level: 3 },
    { id: "flowers", name: "Flowers", emoji: "🌸", slot: "head", level: 4 },
    { id: "scarf", name: "Scarf", emoji: "🧣", slot: "neck", level: 5 },
    { id: "party", name: "Party hat", emoji: "🥳", slot: "head", level: 6 },
    { id: "crown", name: "Crown", emoji: "👑", slot: "head", level: 8 },
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
    [/coffee|latte|espresso|chai|tea/, "☕"], [/boba/, "🧋"], [/juice|smoothie|shake/, "🧃"],
    [/apple/, "🍎"], [/banana/, "🍌"], [/strawberr|berr/, "🍓"], [/grape/, "🍇"],
    [/orange/, "🍊"], [/mango/, "🥭"], [/avocado/, "🥑"], [/melon/, "🍉"],
    [/carrot/, "🥕"], [/broccoli|veg/, "🥦"], [/corn|bhutta/, "🌽"], [/potato|aloo/, "🥔"],
    [/nut|almond|peanut/, "🥜"],
  ];

  const $ = (id) => document.getElementById(id);

  // ---------- storage ----------
  const freshState = () => ({ pet: null, goal: 2000, equipped: { head: null, face: null, neck: null }, days: {} });

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const base = freshState();
        return {
          pet: s.pet && SPECIES.some((x) => x.id === s.pet.species) ? s.pet : null,
          goal: Number(s.goal) || base.goal,
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

  // ---------- dates ----------
  const keyOf = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const fromKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const shift = (k, n) => { const d = fromKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
  const todayKey = () => keyOf(new Date());

  let selected = todayKey();

  const day = (k) => state.days[k] || { entries: [], water: 0, pets: 0 };
  const ensureDay = (k) => {
    const d = (state.days[k] ||= { entries: [], water: 0, pets: 0 });
    d.water ||= 0; d.pets ||= 0;
    return d;
  };
  const total = (k) => day(k).entries.reduce((s, e) => s + e.kcal, 0);
  const goalHit = (k) => { const p = total(k) / state.goal; return p >= 0.9 && p <= 1.1; };

  // ---------- progress ----------
  function dayXP(k) {
    const d = day(k);
    return Math.min(d.entries.length, 8) * 5 + Math.min(d.water || 0, CUPS) * 3 +
      Math.min(d.pets || 0, 5) + (goalHit(k) ? 20 : 0);
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
      return { mood: "eating", bubble: null, text: "Nom nom nom…" };
    }
    if (timeOfDay() === "night" && eaten > 0) return { mood: "sleeping", bubble: "💤", text: `${name} is sleeping. Sweet dreams!` };
    if (eaten === 0) return { mood: "hungry", bubble: "🍙", text: `${name} is hungry! Feed me something?` };
    if (p < 0.5) {
      if (water < 2 && h >= 12) return { mood: "hungry", bubble: "💧", text: `${name} is thirsty. A cup of water?` };
      return { mood: "hungry", bubble: "🍙", text: "Yummy! Still a little hungry…" };
    }
    if (p < 0.9) {
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

  function renderStats() {
    const k = todayKey();
    const eaten = total(k);
    const p = eaten / state.goal;
    const tb = $("tummyBar");
    tb.style.width = `${Math.min(p, 1) * 100}%`;
    tb.classList.toggle("full", p >= 0.9 && p <= 1.1);
    tb.classList.toggle("over", p > 1.1);
    const left = state.goal - eaten;
    $("tummyText").textContent = `${eaten.toLocaleString()} / ${state.goal.toLocaleString()} kcal` +
      (left >= 0 ? ` · ${left.toLocaleString()} left` : ` · ${(-left).toLocaleString()} over`);

    const w = day(k).water || 0;
    $("waterBar").style.width = `${(w / CUPS) * 100}%`;
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
      const logged = day(k).entries.length > 0;
      const b = el("button", "wday" + (k === selected ? " sel" : ""));
      b.type = "button";
      b.disabled = k > t;
      const stamp = el("span", "stamp" + (logged ? "" : " blank"), goalHit(k) ? "⭐" : "🐾");
      b.append(stamp, el("span", "d", fromKey(k).toLocaleDateString(undefined, { weekday: "short" })));
      b.setAttribute("aria-label", `${fromKey(k).toLocaleDateString(undefined, { weekday: "long" })}: ${total(k)} kcal${goalHit(k) ? ", goal reached" : ""}`);
      b.addEventListener("click", () => { selected = k; renderDiary(); });
      week.append(b);
    }

    const log = $("log");
    log.replaceChildren();
    const entries = day(selected).entries;
    if (!entries.length) {
      const empty = el("div", "empty");
      empty.append(el("span", "emo", "🍽️"), el("span", null, selected === t ? "No food yet today." : "Nothing logged this day."));
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
        const del = el("button", "del", "×");
        del.type = "button";
        del.setAttribute("aria-label", `Remove ${e.name}`);
        del.addEventListener("click", () => removeEntry(e.id));
        row.append(el("span", "emo", e.emoji), el("span", "name", e.name), el("span", "kcal", String(e.kcal)), del);
        group.append(row);
      }
      log.append(group);
    }
  }

  function renderWardrobe() {
    const lvl = levelInfo().lvl;
    const box = $("wardrobe");
    box.replaceChildren();
    for (const it of ITEMS) {
      const unlocked = lvl >= it.level;
      const on = state.equipped[it.slot] === it.id;
      const b = el("button", "item" + (unlocked ? "" : " locked") + (on ? " on" : ""));
      b.type = "button";
      b.append(el("span", "i-emo", it.emoji), el("span", "i-name", unlocked ? it.name : `🔒 Lv ${it.level}`));
      b.setAttribute("aria-label", unlocked ? `${it.name}${on ? ", wearing" : ""}` : `${it.name}, unlocks at level ${it.level}`);
      if (unlocked) b.setAttribute("aria-pressed", String(on));
      b.addEventListener("click", () => {
        if (!unlocked) { toast(`Reach level ${it.level} to unlock the ${it.name.toLowerCase()}`); return; }
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

  // Run an action, then celebrate any level-up it caused.
  function withLevelCheck(fn) {
    const before = levelInfo().lvl;
    fn();
    const after = levelInfo().lvl;
    if (after > before) {
      const unlocked = ITEMS.filter((it) => it.level > before && it.level <= after);
      setTimeout(() => {
        confetti();
        toast(unlocked.length
          ? `🎉 Level ${after}! Unlocked ${unlocked.map((u) => u.emoji + " " + u.name).join(", ")}`
          : `🎉 ${petName()} reached level ${after}!`, 3200);
      }, 500);
    }
  }

  // ---------- actions ----------
  function addEntry(name, kcal, meal, emoji) {
    const emo = emoji || pickEmoji(name);
    const isToday = selected === todayKey();
    withLevelCheck(() => {
      ensureDay(selected).entries.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name, kcal, meal, emoji: emo,
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

  function currentMeal() {
    const c = document.querySelector('input[name="meal"]:checked');
    return c ? c.value : defaultMeal();
  }

  // ---------- setup dialog ----------
  const setup = $("setup");
  let pickedSpecies = "cat";

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
    $("setupCancel").hidden = first;
    renderSpeciesPick();
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
    if (setup.returnValue !== "save") return;
    const name = $("petName").value.trim().slice(0, 16) || "Biscuit";
    const goal = Math.round(Number($("goalInput").value));
    const first = !state.pet;
    state.pet = { species: pickedSpecies, name };
    if (goal >= 800 && goal <= 6000) state.goal = goal;
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
    chip.append(`${q.emoji} ${q.name} `, el("b", null, String(q.kcal)));
    chip.addEventListener("click", () => addEntry(q.name, q.kcal, currentMeal(), q.emoji));
    $("quickChips").append(chip);
  }

  $("addForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = $("foodName").value.trim();
    const kcal = Math.round(Number($("foodKcal").value));
    if (!name || !Number.isFinite(kcal) || kcal < 1 || kcal > 5000) return;
    addEntry(name, kcal, currentMeal());
    $("foodName").value = "";
    $("foodKcal").value = "";
  });

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
