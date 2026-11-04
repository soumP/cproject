(() => {
  "use strict";

  const STORE_KEY = "mochi-bites-v1";
  const RING_LEN = 2 * Math.PI * 88;
  const WATER_CUPS = 8;
  const MEALS = [
    { id: "breakfast", label: "Breakfast", emoji: "🌅" },
    { id: "lunch", label: "Lunch", emoji: "☀️" },
    { id: "dinner", label: "Dinner", emoji: "🌙" },
    { id: "snack", label: "Snacks", emoji: "🍪" },
  ];

  // Rough, typical-portion estimates. Labelled as such in the UI.
  const QUICK = [
    { name: "Apple", kcal: 95, emoji: "🍎" },
    { name: "Banana", kcal: 105, emoji: "🍌" },
    { name: "Boiled egg", kcal: 78, emoji: "🥚" },
    { name: "Toast slice", kcal: 80, emoji: "🍞" },
    { name: "Oatmeal bowl", kcal: 150, emoji: "🥣" },
    { name: "Rice, 1 cup", kcal: 205, emoji: "🍚" },
    { name: "Chicken breast, 100 g", kcal: 165, emoji: "🍗" },
    { name: "Latte, 12 oz", kcal: 190, emoji: "☕" },
    { name: "Pizza slice", kcal: 285, emoji: "🍕" },
    { name: "Cookie", kcal: 80, emoji: "🍪" },
  ];

  // First keyword match wins, so put specific words before general ones.
  const EMOJI_RULES = [
    [/pizza/, "🍕"], [/burger/, "🍔"], [/fries|chips/, "🍟"], [/taco|burrito/, "🌮"],
    [/sushi/, "🍣"], [/ramen|noodle|pho|udon/, "🍜"], [/pasta|spaghetti/, "🍝"],
    [/salad/, "🥗"], [/sandwich|sub\b/, "🥪"], [/soup|stew/, "🍲"], [/curry/, "🍛"],
    [/rice/, "🍚"], [/egg/, "🥚"], [/bacon/, "🥓"], [/chicken|wing/, "🍗"],
    [/steak|beef|meat/, "🥩"], [/fish|salmon|tuna/, "🐟"], [/shrimp|prawn/, "🍤"],
    [/toast|bread|bagel/, "🍞"], [/croissant/, "🥐"], [/pancake|waffle/, "🥞"],
    [/oat|cereal|granola/, "🥣"], [/cheese/, "🧀"], [/yogurt|yoghurt/, "🍦"],
    [/ice cream|gelato/, "🍨"], [/cake/, "🍰"], [/cookie|biscuit/, "🍪"],
    [/donut|doughnut/, "🍩"], [/chocolate|candy/, "🍫"], [/coffee|latte|espresso|cappuccino/, "☕"],
    [/tea|matcha|boba/, "🧋"], [/juice|smoothie/, "🧃"], [/milk/, "🥛"], [/beer/, "🍺"], [/wine/, "🍷"],
    [/apple/, "🍎"], [/banana/, "🍌"], [/strawberr|berr/, "🍓"], [/grape/, "🍇"],
    [/orange|clementine|mandarin/, "🍊"], [/peach/, "🍑"], [/mango/, "🥭"], [/avocado/, "🥑"],
    [/watermelon|melon/, "🍉"], [/carrot/, "🥕"], [/broccoli|veg/, "🥦"], [/corn/, "🌽"],
    [/potato/, "🥔"], [/nut|almond|peanut/, "🥜"], [/mochi|dango/, "🍡"], [/dumpling|gyoza/, "🥟"],
  ];

  const $ = (id) => document.getElementById(id);

  // ---------- storage ----------
  const defaultState = () => ({ goal: 2000, days: {} });

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || typeof parsed.days !== "object") return defaultState();
      return { goal: Number(parsed.goal) || 2000, days: parsed.days || {} };
    } catch {
      return defaultState();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      /* private mode or full storage: keep working in memory */
    }
  }

  const state = load();

  // ---------- dates ----------
  const keyOf = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const fromKey = (k) => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const shift = (k, n) => {
    const d = fromKey(k);
    d.setDate(d.getDate() + n);
    return keyOf(d);
  };
  const todayKey = () => keyOf(new Date());

  let selected = todayKey();

  const day = (k) => state.days[k] || { entries: [], water: 0 };
  const ensureDay = (k) => (state.days[k] ||= { entries: [], water: 0 });
  const total = (k) => day(k).entries.reduce((s, e) => s + e.kcal, 0);

  // ---------- helpers ----------
  function pickEmoji(name) {
    const n = name.toLowerCase();
    for (const [re, emo] of EMOJI_RULES) if (re.test(n)) return emo;
    return "🍽️";
  }

  function defaultMeal() {
    const h = new Date().getHours();
    if (h < 11) return "breakfast";
    if (h < 16) return "lunch";
    if (h < 21) return "dinner";
    return "snack";
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  function boing() {
    const m = $("mochi");
    m.classList.remove("boing");
    void m.getBoundingClientRect();
    m.classList.add("boing");
  }

  // ---------- mochi faces (static markup only) ----------
  const FACES = {
    sleepy: `
      <path class="face-line" d="M38 58 q6 4 12 0" /><path class="face-line" d="M70 58 q6 4 12 0" />
      <path class="face-line" d="M55 74 q5 -3 10 0" />
      <text x="88" y="38" font-size="12" fill="#9a8794" font-family="Nunito" font-weight="900">z</text>
      <text x="96" y="28" font-size="9" fill="#9a8794" font-family="Nunito" font-weight="900">z</text>`,
    hungry: `
      <circle class="face-ink" cx="44" cy="58" r="5" /><circle class="face-ink" cx="76" cy="58" r="5" />
      <circle cx="46" cy="56" r="1.6" fill="#fff" /><circle cx="78" cy="56" r="1.6" fill="#fff" />
      <ellipse class="face-ink" cx="60" cy="76" rx="6" ry="5" />`,
    happy: `
      <circle class="face-ink" cx="44" cy="58" r="5" /><circle class="face-ink" cx="76" cy="58" r="5" />
      <circle cx="46" cy="56" r="1.6" fill="#fff" /><circle cx="78" cy="56" r="1.6" fill="#fff" />
      <path class="face-line" d="M52 72 q8 8 16 0" />`,
    yay: `
      <path class="face-line" d="M38 60 q6 -7 12 0" /><path class="face-line" d="M70 60 q6 -7 12 0" />
      <path class="face-ink" d="M50 70 q10 0 20 0 q0 11 -10 11 q-10 0 -10 -11 Z" />
      <path class="face-tongue" d="M55 77 q5 -3 10 0 q-1 4 -5 4 q-4 0 -5 -4 Z" />`,
    stuffed: `
      <path class="face-line" d="M38 55 l10 5 l-10 5" /><path class="face-line" d="M82 55 l-10 5 l10 5" />
      <path class="face-line" d="M50 76 q5 -4 10 0 q5 4 10 0" />`,
  };

  function moodFor(eaten, goal, k) {
    const p = eaten / goal;
    const isToday = k === todayKey();
    if (eaten === 0) return { face: "sleepy", text: isToday ? "Feed me something yummy!" : "Nothing logged this day." };
    if (p < 0.35) return { face: "hungry", text: "Ooh, a little snack! More please?" };
    if (p < 0.9) return { face: "happy", text: "Yum! We're doing great today." };
    if (p <= 1.05) return { face: "yay", text: "Goal reached! Mochi is so proud ✨" };
    return { face: "stuffed", text: "Oof, a bit over. That's okay, tomorrow is new!" };
  }

  // ---------- render ----------
  function renderHeader() {
    const t = todayKey();
    let label;
    if (selected === t) label = "Today";
    else if (selected === shift(t, -1)) label = "Yesterday";
    else label = fromKey(selected).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    $("dayLabel").textContent = label;
    $("nextDay").disabled = selected >= t;
  }

  function renderHero() {
    const eaten = total(selected);
    const goal = state.goal;
    const p = eaten / goal;
    const fill = $("ringFill");
    fill.style.strokeDashoffset = String(RING_LEN * (1 - Math.min(p, 1)));
    fill.classList.toggle("done", p >= 0.9 && p <= 1.05);
    fill.classList.toggle("over", p > 1.05);

    $("eaten").textContent = eaten.toLocaleString();
    $("goalText").textContent = goal.toLocaleString();
    const left = goal - eaten;
    const pill = $("leftPill");
    pill.textContent = left >= 0 ? `${left.toLocaleString()} left` : `${(-left).toLocaleString()} over`;
    pill.classList.toggle("over", left < 0);

    const mood = moodFor(eaten, goal, selected);
    $("mood").textContent = mood.text;
    $("mochiFace").innerHTML = FACES[mood.face];
    $("mochi").setAttribute("aria-label", `Mochi looks ${mood.face}`);
  }

  function renderLog() {
    const log = $("log");
    log.replaceChildren();
    const entries = day(selected).entries;
    if (!entries.length) {
      const empty = el("div", "empty");
      empty.append(el("span", "emo", "🍽️"), el("span", null, "Your plate is empty. Add a bite above!"));
      log.append(empty);
      return;
    }
    for (const meal of MEALS) {
      const items = entries.filter((e) => e.meal === meal.id);
      if (!items.length) continue;
      const group = el("div", "meal-group");
      const head = el("div", "meal-head");
      head.append(
        el("span", null, `${meal.emoji} ${meal.label}`),
        el("span", null, `${items.reduce((s, e) => s + e.kcal, 0)} kcal`)
      );
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

  function renderWater() {
    const n = day(selected).water || 0;
    const cups = $("cups");
    cups.replaceChildren();
    for (let i = 0; i < WATER_CUPS; i++) {
      const b = el("button", "cup" + (i < n ? " full" : ""));
      b.type = "button";
      b.setAttribute("aria-label", `Cup ${i + 1}${i < n ? ", drunk" : ""}`);
      b.setAttribute("aria-pressed", String(i < n));
      b.addEventListener("click", () => setWater(i < n && i === n - 1 ? i : i + 1));
      cups.append(b);
    }
    $("waterText").textContent = `${n} / ${WATER_CUPS} cups${n >= WATER_CUPS ? " 💧" : ""}`;
  }

  function renderWeek() {
    const week = $("week");
    week.replaceChildren();
    const keys = Array.from({ length: 7 }, (_, i) => shift(selected, i - 6));
    const totals = keys.map(total);
    const max = Math.max(state.goal * 1.25, ...totals);

    const line = el("div", "goal-line");
    // Bars live in the top part of each column, above the day label (~20px).
    line.style.bottom = `calc(20px + (100% - 24px) * ${state.goal / max})`;
    line.append(el("span", null, "goal"));
    week.append(line);

    keys.forEach((k, i) => {
      const t = totals[i];
      const p = t / state.goal;
      const col = el("button", "bar-col" + (k === selected ? " sel" : ""));
      col.type = "button";
      col.style.cssText = "border:0;background:none;padding:0;font:inherit;cursor:pointer;color:inherit";
      col.setAttribute("aria-label", `${fromKey(k).toLocaleDateString(undefined, { weekday: "long" })}: ${t} kcal`);
      col.disabled = k > todayKey();
      col.addEventListener("click", () => { selected = k; render(); });
      const slot = el("div", "bar-slot");
      const bar = el("div", "bar " + (t === 0 ? "none" : p > 1.05 ? "over" : p >= 0.9 ? "ok" : ""));
      bar.style.height = `${(t / max) * 100}%`;
      bar.title = `${t} kcal`;
      slot.append(bar);
      col.append(slot, el("span", "bar-day", fromKey(k).toLocaleDateString(undefined, { weekday: "narrow" })));
      week.append(col);
    });

    const logged = totals.filter((t) => t > 0);
    $("weekAvg").textContent = logged.length
      ? `avg ${Math.round(logged.reduce((a, b) => a + b, 0) / logged.length).toLocaleString()} kcal`
      : "";
  }

  function render() {
    renderHeader();
    renderHero();
    renderLog();
    renderWater();
    renderWeek();
  }

  // ---------- actions ----------
  function addEntry(name, kcal, meal, emoji) {
    const d = ensureDay(selected);
    d.entries.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      kcal,
      meal,
      emoji: emoji || pickEmoji(name),
    });
    save();
    render();
    boing();
    toast(`${emoji || pickEmoji(name)} ${name} added! Nom nom`);
  }

  function removeEntry(id) {
    const d = ensureDay(selected);
    d.entries = d.entries.filter((e) => e.id !== id);
    save();
    render();
  }

  function setWater(n) {
    const d = ensureDay(selected);
    d.water = Math.max(0, Math.min(WATER_CUPS, n));
    save();
    renderWater();
    if (d.water === WATER_CUPS) toast("💧 All cups done! Mochi is so hydrated");
  }

  function currentMeal() {
    const checked = document.querySelector('input[name="meal"]:checked');
    return checked ? checked.value : defaultMeal();
  }

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
    $("foodName").focus();
  });

  $("prevDay").addEventListener("click", () => { selected = shift(selected, -1); render(); });
  $("nextDay").addEventListener("click", () => {
    if (selected < todayKey()) { selected = shift(selected, 1); render(); }
  });
  $("dayLabel").addEventListener("click", () => { selected = todayKey(); render(); });

  const dialog = $("goalDialog");
  $("editGoal").addEventListener("click", () => {
    $("goalInput").value = state.goal;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else {
      const v = Number(prompt("Daily calorie goal", String(state.goal)));
      if (v >= 800 && v <= 6000) { state.goal = Math.round(v); save(); render(); }
    }
  });
  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "save") return;
    const v = Math.round(Number($("goalInput").value));
    if (v >= 800 && v <= 6000) {
      state.goal = v;
      save();
      render();
      toast("🎯 New goal saved");
    }
  });

  $("mochi").addEventListener("click", boing);

  // Roll over to the new day if the app is left open past midnight.
  let lastToday = todayKey();
  setInterval(() => {
    const t = todayKey();
    if (t !== lastToday) {
      if (selected === lastToday) selected = t;
      lastToday = t;
      render();
    }
  }, 60_000);

  render();
})();
