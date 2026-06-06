const state = {
  screen: "dashboard",
  detail: null,
  techPeriod: "today",
  dealerPeriod: "today",
  detailPeriod: "today",
  calY: null,
  calM: null,
  calSelected: null,
  data: null,
  mode: "loading",
  updated: ""
};

const DEMO = {
  config: {
    packageValue: 50,
    dailyGoal: 150,
    monthlyGoal: 3300,
    companyName: "PackageIQ",
    managerName: "Manager"
  },
  dashboard: {
    actualTodayKey: "2026-06-06",
    actualYesterdayKey: "2026-06-05",
    lastLoggedKey: "2026-06-05",
    todayKey: "2026-06-06",
    yesterdayKey: "2026-06-05",
    todayPackages: 0,
    todayGross: 0,
    todayNet: 0,
    yesterdayPackages: 140,
    yesterdayGross: 7000,
    yesterdayNet: 3500,
    weekPackages: 470,
    weekGross: 23500,
    weekNet: 11750,
    monthPackages: 1080,
    monthGross: 54000,
    monthNet: 27000,
    dailyGoal: 150,
    monthlyGoal: 3300,
    weekTrend: [
      { date: "2026-05-31", packages: 0 },
      { date: "2026-06-01", packages: 130 },
      { date: "2026-06-02", packages: 160 },
      { date: "2026-06-03", packages: 40 },
      { date: "2026-06-04", packages: 140 },
      { date: "2026-06-05", packages: 140 },
      { date: "2026-06-06", packages: 0 }
    ],
    attention: [
      { type: "nolog", title: "Demo data", sub: "Paste your Apps Script /exec URL into index.html" }
    ]
  },
  techs: [
    {
      name: "Jeremy",
      today: { pk: 0, gross: 0, net: 0 },
      yesterday: { pk: 18, gross: 900, net: 450 },
      week: { pk: 66, gross: 3300, net: 1650 },
      month: { pk: 210, gross: 10500, net: 5250 }
    },
    {
      name: "Josh",
      today: { pk: 0, gross: 0, net: 0 },
      yesterday: { pk: 14, gross: 700, net: 350 },
      week: { pk: 48, gross: 2400, net: 1200 },
      month: { pk: 180, gross: 9000, net: 4500 }
    }
  ],
  dealers: [
    {
      name: "Mazda Central",
      today: { pk: 0, gross: 0, net: 0 },
      yesterday: { pk: 20, gross: 1000, net: 500 },
      week: { pk: 60, gross: 3000, net: 1500 },
      month: { pk: 130, gross: 6500, net: 3250 }
    }
  ],
  upholstery: {
    todayRevenue: 0,
    todayEquiv: 0,
    yesterdayRevenue: 500,
    yesterdayEquiv: 10,
    monthRevenue: 5000,
    monthEquiv: 100,
    revenueTrend: [0, 1200, 0, 800, 500, 500, 0],
    monthBars: [0, 1200, 0, 800, 500, 500],
    entries: [
      { date: "Jun 5", rawDate: "2026-06-05", desc: "Seat Repair", dealer: "Mazda Central", amount: 500, pk: 10 }
    ]
  },
  calendar: {
    "2026-06-01": 130,
    "2026-06-02": 160,
    "2026-06-03": 40,
    "2026-06-04": 140,
    "2026-06-05": 140,
    "2026-06-06": 0
  },
  calendarDays: [
    { date: "2026-06-01", packages: 130, gross: 6500, net: 3250, goal: 150, notes: "", entries: [] },
    { date: "2026-06-02", packages: 160, gross: 8000, net: 4000, goal: 150, notes: "", entries: [] },
    { date: "2026-06-03", packages: 40, gross: 2000, net: 1000, goal: 150, notes: "Rain day. Jeremy and Josh PTO.", entries: [] },
    { date: "2026-06-04", packages: 140, gross: 7000, net: 3500, goal: 150, notes: "", entries: [] },
    { date: "2026-06-05", packages: 140, gross: 7000, net: 3500, goal: 150, notes: "Demo completed day.", entries: [] }
  ],
  dailyNotes: {
    "2026-06-03": "Rain day. Jeremy and Josh PTO.",
    "2026-06-05": "Demo completed day."
  },
  techActivity: {
    Jeremy: {
      today: [],
      yesterday: [
        { date: "2026-06-05", dealer: "Mazda Central", desc: "Package cars", label: "18 package cars", pk: 18, gross: 900, net: 450 }
      ],
      week: [],
      month: []
    }
  },
  dealerActivity: {
    "Mazda Central": {
      today: [],
      yesterday: [
        { date: "2026-06-05", tech: "Jeremy", desc: "Package cars", label: "18 package cars", pk: 18, gross: 900, net: 450 }
      ],
      week: [],
      month: []
    }
  },
  dayDetails: {},
  meta: {
    generated: new Date().toISOString(),
    timezone: "America/Chicago"
  }
};

const $ = selector => document.querySelector(selector);

const I = {
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M9 21v-3h6v3"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9v11h14V9"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h6M9 18h4"/></svg>',
  seat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 19v-7a3 3 0 013-3h3a3 3 0 013 3"/><path d="M16 12l2 1a2 2 0 011 1.7V19"/><path d="M6 19h12M5 19v2M19 19v2"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>',
  chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 6l-6 6 6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9.5 16.5h-19L12 3z"/><path d="M12 9v5M12 17.5v.01"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h11l3 3v15H5z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-2.64-6.36"/><path d="M21 3v6h-6"/></svg>'
};

const money = n => "$" + Math.round(Number(n) || 0).toLocaleString();
const pk = n => Math.round((Number(n) || 0) * 10) / 10;
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;
const periodLabel = p => p[0].toUpperCase() + p.slice(1);
const periods = ["today", "yesterday", "week", "month"];

function safeDateLabel(key, opts = { month: "short", day: "numeric" }) {
  if (!key) return "";
  const parts = String(key).slice(0, 10).split("-");
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString("en-US", opts);
}

function donut(p, options = {}) {
  const size = options.size || 72;
  const stroke = options.stroke || 8;
  const track = options.track || "#EEF0F3";
  const color = options.color || "var(--red)";
  const txt = options.txt || "var(--text)";
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(p / 100, 1));

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-size="${size * 0.26}" font-weight="800" fill="${txt}">${p}%</text>
  </svg>`;
}

function bars(vals, options = {}) {
  const w = 300;
  const h = options.h || 70;
  const color = options.color || "var(--gold)";
  const arr = vals && vals.length ? vals : [0];
  const max = Math.max(...arr) || 1;
  const gap = 3;
  const bw = (w - gap * (arr.length - 1)) / arr.length;

  return `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    ${arr.map((v, i) => {
      const bh = (v / max) * (h - 6);
      return `<rect x="${(i * (bw + gap)).toFixed(1)}" y="${(h - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${color}"/>`;
    }).join("")}
  </svg>`;
}

async function loadData() {
  if (!API_URL || API_URL.includes("PASTE_YOUR")) {
    return { data: DEMO, mode: "demo" };
  }

  try {
    const response = await fetch(API_URL, { redirect: "follow", cache: "no-store" });
    if (!response.ok) throw new Error("Bad API response");
    const data = await response.json();
    localStorage.setItem("piq_cache", JSON.stringify({ data, cachedAt: new Date().toISOString() }));
    return { data, mode: "live" };
  } catch (error) {
    const cached = localStorage.getItem("piq_cache");
    if (cached) return { data: JSON.parse(cached).data, mode: "cache" };
    return { data: DEMO, mode: "error" };
  }
}

function banner() {
  if (state.mode === "demo") return `<div class="banner warn">Demo data. Paste your Apps Script /exec URL into index.html.</div>`;
  if (state.mode === "cache") return `<div class="banner warn">Offline or API failed. Showing last cached data.</div>`;
  if (state.mode === "error") return `<div class="banner err">Could not load the sheet. Check the Apps Script URL and deployment permissions.</div>`;
  return "";
}

function dashHeader() {
  const d = state.data;
  const attentionCount = d.dashboard.attention.length;

  return `<div class="hdr">
    <div class="logo">Package<span class="iq">IQ</span></div>
    <button class="icon-btn bell" data-action="attention">
      ${I.bell}
      ${attentionCount ? `<span class="badge">${attentionCount}</span>` : ""}
    </button>
  </div>
  <div class="greeting-wrap">
    <div class="greeting">Good morning, ${d.config.managerName}</div>
    <div class="subtitle">Yesterday tells the story. Today shows the pace.</div>
  </div>
  ${banner()}`;
}

function topHeader(title) {
  return `<div class="hdr">
    <button class="icon-btn" data-action="screen" data-arg="more">${I.dots}</button>
    <div class="hdr-title">${title}</div>
    <button class="icon-btn" data-action="refresh">${I.refresh}</button>
  </div>${banner()}`;
}

function detailHeader(title) {
  return `<div class="hdr">
    <button class="icon-btn" data-action="back">${I.back}</button>
    <div class="hdr-title">${title}</div>
    <button class="icon-btn ghost"></button>
  </div>`;
}

function tabsBar(active, action, includeYesterday = true) {
  const list = includeYesterday ? periods : ["today", "week", "month"];
  return `<div class="tabs">
    ${list.map(p => `<div class="tab ${active === p ? "active" : ""}" data-action="${action}" data-arg="${p}">${periodLabel(p)}</div>`).join("")}
  </div>`;
}

function screenDashboard() {
  const d = state.data;
  const db = d.dashboard;
  const todayPercent = pct(db.todayPackages, db.dailyGoal);
  const monthPercent = pct(db.monthPackages, db.monthlyGoal);
  const todayBehind = pk(db.dailyGoal - db.todayPackages);
  const monthBehind = pk(db.monthlyGoal - db.monthPackages);

  const topYesterday = [...d.techs]
    .sort((a, b) => b.yesterday.pk - a.yesterday.pk)
    .slice(0, 3);

  return dashHeader() + `<div class="section">
    <div class="hero">
      <div>
        <div class="label">Today’s Packages</div>
        <div class="big">${db.todayPackages}</div>
        <div class="goal">/ ${db.dailyGoal} Goal</div>
        <div class="status">${todayBehind > 0 ? `Behind by ${todayBehind} pkgs` : `Ahead by ${Math.abs(todayBehind)} pkgs`}</div>
      </div>
      ${donut(todayPercent, { size: 88, stroke: 9, track: "rgba(255,255,255,.3)", color: "#fff", txt: "#fff" })}
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="ic ic-red">${I.dollar}</div><div><div class="val">${money(db.todayGross)}</div><div class="lab">Gross Today</div></div></div>
      <div class="kpi"><div class="ic ic-red">${I.wallet}</div><div><div class="val">${money(db.todayNet)}</div><div class="lab">Net Today</div></div></div>
      <div class="kpi"><div class="ic ic-blue">${I.cal}</div><div><div class="val">${db.yesterdayPackages}</div><div class="lab">Yesterday</div></div></div>
      <div class="kpi"><div class="ic ic-gold">${I.chart}</div><div><div class="val">${db.weekPackages}</div><div class="lab">This Week</div></div></div>
    </div>

    <div class="card">
      <div class="row-label">Yesterday’s Story</div>
      <div style="display:flex;align-items:baseline;gap:8px;margin-top:6px;">
        <span style="font-size:34px;font-weight:800;">${db.yesterdayPackages}</span>
        <span class="muted">packages</span>
      </div>
      <div class="kpi-grid" style="margin-top:12px;margin-bottom:0;">
        <div class="kpi"><div><div class="val">${money(db.yesterdayGross)}</div><div class="lab">Gross</div></div></div>
        <div class="kpi"><div><div class="val">${money(db.yesterdayNet)}</div><div class="lab">Net</div></div></div>
      </div>
    </div>

    <div class="mtd">
      <div class="row-label">Month To Date</div>
      <div style="display:flex;align-items:baseline;gap:6px;margin-top:4px;">
        <span class="num">${db.monthPackages.toLocaleString()}</span>
        <span class="goal">/ ${db.monthlyGoal.toLocaleString()} Goal</span>
        <span style="margin-left:auto;font-weight:800;">${monthPercent}%</span>
      </div>
      <div class="bar"><span style="width:${Math.min(monthPercent, 100)}%"></span></div>
      <div class="behind">${monthBehind > 0 ? `Behind by ${monthBehind.toLocaleString()} pkgs` : `Ahead by ${Math.abs(monthBehind).toLocaleString()} pkgs`}</div>
    </div>

    <div id="attentionCard" class="card">
      <div class="row-label" style="color:var(--red);margin-bottom:6px;">Needs Attention</div>
      ${db.attention.length ? db.attention.map(a => `<div class="att-row">
        <div class="att-ic ${a.type === "under" ? "ic-gold" : "ic-red"}">${a.type === "pace" ? I.target : I.alert}</div>
        <div><div class="att-title">${a.title}</div><div class="att-sub">${a.sub}</div></div>
      </div>`).join("") : `<div class="empty">Nothing flagged today.</div>`}
    </div>

    <div class="card">
      <div class="flex between" style="margin-bottom:8px;">
        <span class="row-label">Top Techs Yesterday</span>
        <span class="viewall" data-action="screen" data-arg="techs">View all</span>
      </div>
      ${topYesterday.length ? topYesterday.map((t, i) => `<div class="rank-row" data-action="tech" data-arg="${t.name}">
        <div class="rank-no rank-${i + 1}">${i + 1}</div>
        <div class="rank-name" style="flex:1;">${t.name}</div>
        <div class="rank-pk">${t.yesterday.pk} pkgs</div>
      </div>`).join("") : `<div class="empty">No production yesterday.</div>`}
    </div>

    <div class="updated">
      Today: ${safeDateLabel(db.actualTodayKey, { month: "short", day: "numeric", year: "numeric" })} · 
      Last logged: ${safeDateLabel(db.lastLoggedKey, { month: "short", day: "numeric", year: "numeric" })} · 
      Updated ${state.updated}
    </div>
  </div>`;
}

function screenTechs() {
  const d = state.data;
  const p = state.techPeriod;
  const list = [...d.techs].sort((a, b) => b[p].pk - a[p].pk);
  const max = Math.max(1, ...list.map(t => t[p].pk));
  const total = list.reduce((s, t) => s + t[p].pk, 0);
  const goal = p === "month" ? d.config.monthlyGoal : d.config.dailyGoal;

  return topHeader("Techs") + tabsBar(p, "techPeriod") + `<div class="section" style="padding-top:14px;">
    <div class="rank-card">
      <div class="redbar-head">Techs · ${periodLabel(p)}</div>
      ${list.length ? list.map((t, i) => {
        const warn = p === "today" && t.today.pk > 0 && t.today.pk < 12;
        return `<div class="rank-row" data-action="tech" data-arg="${t.name}">
          <div class="rank-no ${i < 3 ? "rank-" + (i + 1) : ""}">${i + 1}</div>
          <div style="min-width:86px;"><div class="rank-name">${t.name}</div><div class="rank-pk">${t[p].pk} pkgs</div></div>
          <div class="rank-track ${warn ? "warn" : ""}"><span style="width:${Math.round(t[p].pk / max * 100)}%"></span></div>
        </div>`;
      }).join("") : `<div class="empty">No technicians found.</div>`}
    </div>

    <div class="card">
      <div class="flex between">
        <div>
          <div class="row-label">Team Total</div>
          <div style="font-size:32px;font-weight:800;line-height:1;margin-top:6px;">${pk(total)}</div>
          <div class="muted" style="font-size:13px;">/ ${goal} Goal</div>
        </div>
        ${donut(pct(total, goal), { size: 80, stroke: 8 })}
      </div>
    </div>
  </div>`;
}

function screenDealers() {
  const d = state.data;
  const p = state.dealerPeriod;
  const list = [...d.dealers].sort((a, b) => b[p].pk - a[p].pk).filter(x => x[p].pk > 0);

  const totPk = list.reduce((s, x) => s + x[p].pk, 0);
  const totGross = list.reduce((s, x) => s + x[p].gross, 0);
  const totNet = list.reduce((s, x) => s + x[p].net, 0);

  return topHeader("Dealers") + tabsBar(p, "dealerPeriod") + `<div class="section" style="padding-top:12px;">
    <div class="card" style="padding:6px 14px 10px;">
      <div class="tbl-head"><span>Dealer</span><span class="tbl-num">Pkgs</span><span class="c r">Gross</span><span class="c r">Net</span></div>
      ${list.length ? list.map(x => `<div class="tbl-row" data-action="dealer" data-arg="${x.name}">
        <span class="dn">${I.building}${x.name}</span>
        <span class="tbl-num">${x[p].pk}</span>
        <span class="c r">${money(x[p].gross)}</span>
        <span class="c r">${money(x[p].net)}</span>
      </div>`).join("") : `<div class="empty">No dealer production for ${periodLabel(p)}.</div>`}
    </div>

    <div class="total-red">
      <div><div class="tv">${pk(totPk)}</div><div class="tl">PKGS</div></div>
      <div class="sep"><div class="tv">${money(totGross)}</div><div class="tl">GROSS</div></div>
      <div class="sep"><div class="tv">${money(totNet)}</div><div class="tl">NET</div></div>
    </div>
  </div>`;
}

function screenUpholstery() {
  const u = state.data.upholstery;

  return topHeader("Upholstery") + `<div class="section" style="padding-top:6px;">
    <div class="card">
      <div class="row-label">Revenue Today</div>
      <div style="font-size:34px;font-weight:800;margin:4px 0 6px;">${money(u.todayRevenue)}</div>
      <div class="muted">${u.todayEquiv} package equivalent</div>
    </div>

    <div class="card">
      <div class="row-label">Yesterday</div>
      <div style="font-size:28px;font-weight:800;margin-top:4px;">${money(u.yesterdayRevenue)}</div>
      <div class="muted">${u.yesterdayEquiv} package equivalent</div>
    </div>

    <div class="uph-month">
      <div class="row-label" style="color:#7a5b00;">This Month</div>
      <div class="grid2" style="margin:6px 0 12px;">
        <div><div class="v">${money(u.monthRevenue)}</div><div class="l">Revenue</div></div>
        <div><div class="v">${u.monthEquiv} <span style="font-size:13px;">pkgs</span></div><div class="l">Equivalent</div></div>
      </div>
      ${bars(u.monthBars)}
    </div>

    <div class="card">
      <div class="row-label" style="margin-bottom:6px;">Recent Entries</div>
      ${u.entries && u.entries.length ? u.entries.map(e => `<div class="entry">
        <span class="date">${e.date}</span>
        <span class="desc">${e.desc}${e.dealer ? " · " + e.dealer : ""}</span>
        <span class="amt">${money(e.amount)}</span>
        <span class="pk">${Number(e.pk).toFixed(1)} pkgs</span>
      </div>`).join("") : `<div class="empty">No upholstery entries.</div>`}
    </div>
  </div>`;
}

function calendarStatus(packages, goal) {
  if (packages === undefined || packages === null) return "gray";
  if (!goal) return "gray";
  const ratio = packages / goal;
  if (ratio >= 1) return "green";
  if (ratio >= 0.8) return "gold";
  return "red";
}

function screenCalendar() {
  const d = state.data;
  const y = state.calY;
  const m = state.calM;
  const goal = d.config.dailyGoal;
  const calendar = d.calendar || {};

  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const monthLabel = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const pad = n => String(n).padStart(2, "0");
  const prefix = `${y}-${pad(m + 1)}`;

  let cells = [];
  for (let i = 0; i < startDow; i++) cells.push({ blank: true });

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${prefix}-${pad(day)}`;
    cells.push({ blank: false, day, key, packages: calendar[key] });
  }

  const monthTotal = Object.keys(calendar)
    .filter(k => k.slice(0, 7) === prefix)
    .reduce((s, k) => s + Number(calendar[k] || 0), 0);

  const monthPercent = pct(monthTotal, d.config.monthlyGoal);
  const monthBehind = pk(d.config.monthlyGoal - monthTotal);

  return topHeader("Calendar") + `<div class="section" style="padding-top:4px;">
    <div class="cal-nav">
      <button class="icon-btn" data-action="calPrev">${I.chevL}</button>
      <span class="mo">${monthLabel}</span>
      <button class="icon-btn" data-action="calNext">${I.chevR}</button>
    </div>

    <div class="cal-grid">
      ${["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(x => `<div class="cal-dow">${x}</div>`).join("")}
      ${cells.map(c => {
        if (c.blank) return `<div></div>`;
        const st = calendarStatus(c.packages, goal);
        const isToday = c.key === d.dashboard.actualTodayKey;
        return `<div class="cal-cell ${isToday ? "today" : ""}" data-action="day" data-arg="${c.key}">
          <span class="dn">${c.day}</span>
          ${c.packages !== undefined ? `<span class="pk">${c.packages}</span><span class="dot dot-${st}"></span>` : `<span class="pk">—</span><span class="dot dot-gray"></span>`}
        </div>`;
      }).join("")}
    </div>

    <div class="legend">
      <div class="li"><span class="dot dot-green"></span>On Track</div>
      <div class="li"><span class="dot dot-gold"></span>At Risk</div>
      <div class="li"><span class="dot dot-red"></span>Behind</div>
      <div class="li"><span class="dot dot-gray"></span>No Data</div>
    </div>

    <div class="card" style="margin-top:8px;">
      <div class="row-label">Monthly Summary</div>
      <div style="display:flex;align-items:baseline;gap:6px;margin-top:4px;">
        <span style="font-size:28px;font-weight:800;">${pk(monthTotal).toLocaleString()}</span>
        <span class="muted" style="font-size:13px;">/ ${d.config.monthlyGoal.toLocaleString()} Goal</span>
        <span style="margin-left:auto;font-weight:800;">${monthPercent}%</span>
      </div>
      <div class="bar"><span style="width:${Math.min(monthPercent, 100)}%"></span></div>
      <div style="color:var(--red);font-weight:700;font-size:13px;">
        ${monthBehind > 0 ? `Behind by ${monthBehind.toLocaleString()} pkgs` : `Ahead by ${Math.abs(monthBehind).toLocaleString()} pkgs`}
      </div>
    </div>
  </div>`;
}

function screenMore() {
  const c = state.data.config;
  const settings = [
    { icon: I.dollar, name: "Package Value", value: "$" + Number(c.packageValue).toFixed(2) },
    { icon: I.target, name: "Daily Goal", value: c.dailyGoal + " pkgs" },
    { icon: I.target, name: "Monthly Goal", value: Number(c.monthlyGoal).toLocaleString() + " pkgs" },
    { icon: I.user, name: "Technicians", value: state.data.techs.length },
    { icon: I.building, name: "Dealers", value: state.data.dealers.length },
    { icon: I.note, name: "Last Logged Day", value: safeDateLabel(state.data.dashboard.lastLoggedKey) }
  ];

  return topHeader("More") + `<div class="section" style="padding-top:6px;">
    <div class="subhead">Settings</div>
    <div class="list-card">
      ${settings.map(r => `<div class="list-row">
        <span class="list-ic">${r.icon}</span>
        <span class="list-name">${r.name}</span>
        <span class="list-val">${r.value}</span>
      </div>`).join("")}
    </div>

    <div class="card">
      <div class="row-label">How PackageIQ Works</div>
      <p style="font-size:13.5px;line-height:1.5;margin-bottom:0;color:var(--muted);">
        All entries are managed in Google Sheets. This app is read-only and shows package equivalents, gross, net, tech performance, dealer performance, upholstery revenue, and daily notes.
      </p>
    </div>
  </div>`;
}

function detailTech(name) {
  const d = state.data;
  const t = d.techs.find(x => x.name === name);
  const p = state.detailPeriod;
  const acts = ((d.techActivity || {})[name] || {})[p] || [];

  if (!t) return detailHeader(name) + `<div class="section"><div class="card empty">No data.</div></div>`;

  const total = acts.reduce((s, a) => s + Number(a.pk || 0), 0);

  return detailHeader(name) + tabsBar(p, "detailPeriod") + `<div class="section" style="padding-top:14px;">
    <div class="stat-grid">
      <div class="stat"><div class="v">${t[p].pk}</div><div class="l">Pkgs</div></div>
      <div class="stat"><div class="v">${money(t[p].gross)}</div><div class="l">Gross</div></div>
      <div class="stat"><div class="v">${money(t[p].net)}</div><div class="l">Net</div></div>
    </div>

    <div class="card">
      <div class="row-label" style="margin-bottom:6px;">Activity · ${periodLabel(p)}</div>
      ${acts.length ? acts.map(a => `<div class="act-row">
        <div>
          <div class="a-main">${a.dealer || "No dealer"}</div>
          <div class="a-sub">${safeDateLabel(a.date)} · ${a.label || a.desc}</div>
        </div>
        <div class="a-pk">${Number(a.pk).toFixed(1)} pkgs</div>
      </div>`).join("") + `<div class="act-row" style="border-top:2px solid var(--text);"><div class="a-main">Total</div><div class="a-pk">${pk(total)} pkgs</div></div>` : `<div class="empty">No activity for ${periodLabel(p)}.</div>`}
    </div>
  </div>`;
}

function detailDealer(name) {
  const d = state.data;
  const dealer = d.dealers.find(x => x.name === name);
  const p = state.detailPeriod;
  const acts = ((d.dealerActivity || {})[name] || {})[p] || [];

  if (!dealer) return detailHeader(name) + `<div class="section"><div class="card empty">No data.</div></div>`;

  return detailHeader(name) + tabsBar(p, "detailPeriod") + `<div class="section" style="padding-top:14px;">
    <div class="stat-grid">
      <div class="stat"><div class="v">${dealer[p].pk}</div><div class="l">Pkgs</div></div>
      <div class="stat"><div class="v">${money(dealer[p].gross)}</div><div class="l">Gross</div></div>
      <div class="stat"><div class="v">${money(dealer[p].net)}</div><div class="l">Net</div></div>
    </div>

    <div class="card">
      <div class="row-label" style="margin-bottom:6px;">Activity · ${periodLabel(p)}</div>
      ${acts.length ? acts.map(a => `<div class="act-row">
        <div>
          <div class="a-main">${a.tech || a.desc || "Upholstery"}</div>
          <div class="a-sub">${safeDateLabel(a.date)} · ${a.label || a.desc}</div>
        </div>
        <div class="a-pk">${Number(a.pk).toFixed(1)} pkgs</div>
      </div>`).join("") : `<div class="empty">No activity for ${periodLabel(p)}.</div>`}
    </div>
  </div>`;
}

function detailDay(key) {
  const d = state.data;
  const day = (d.calendarDays || []).find(x => x.date === key) || {
    date: key,
    packages: 0,
    gross: 0,
    net: 0,
    goal: d.config.dailyGoal,
    notes: d.dailyNotes[key] || "",
    entries: []
  };

  const label = safeDateLabel(key, { month: "long", day: "numeric", year: "numeric" });
  const p = pct(day.packages, day.goal);

  return detailHeader(label) + `<div class="section" style="padding-top:6px;">
    <div class="hero">
      <div>
        <div class="label">Packages</div>
        <div class="big">${day.packages}</div>
        <div class="goal">/ ${day.goal} Goal</div>
      </div>
      ${donut(p, { size: 84, stroke: 9, track: "rgba(255,255,255,.3)", color: "#fff", txt: "#fff" })}
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="ic ic-red">${I.dollar}</div><div><div class="val">${money(day.gross)}</div><div class="lab">Gross</div></div></div>
      <div class="kpi"><div class="ic ic-red">${I.wallet}</div><div><div class="val">${money(day.net)}</div><div class="lab">Net</div></div></div>
    </div>

    <div class="card">
      <div class="row-label" style="margin-bottom:6px;">Daily Notes</div>
      <div style="font-size:13.5px;line-height:1.5;color:var(--muted);">${day.notes || "No notes recorded for this day."}</div>
    </div>

    <div class="card">
      <div class="row-label" style="margin-bottom:6px;">Entries</div>
      ${day.entries && day.entries.length ? day.entries.map(e => `<div class="act-row">
        <div>
          <div class="a-main">${e.tech || e.dealer || e.desc}</div>
          <div class="a-sub">${e.dealer ? e.dealer + " · " : ""}${e.desc}</div>
        </div>
        <div class="a-pk">${Number(e.pk).toFixed(1)} pkgs</div>
      </div>`).join("") : `<div class="empty">No entries for this day.</div>`}
    </div>
  </div>`;
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: I.home },
  { id: "techs", label: "Techs", icon: I.user },
  { id: "dealers", label: "Dealers", icon: I.clipboard },
  { id: "upholstery", label: "Upholstery", icon: I.seat },
  { id: "calendar", label: "Calendar", icon: I.cal },
  { id: "more", label: "More", icon: I.dots }
];

function renderNav() {
  const active = state.detail ? state.detail.parent : state.screen;
  $("#nav").innerHTML = NAV.map(n => `<button class="nav-item ${active === n.id ? "active" : ""}" data-action="screen" data-arg="${n.id}">
    ${n.icon}<span>${n.label}</span>
  </button>`).join("");
}

function renderBody() {
  if (state.detail) {
    if (state.detail.type === "tech") return detailTech(state.detail.id);
    if (state.detail.type === "dealer") return detailDealer(state.detail.id);
    if (state.detail.type === "day") return detailDay(state.detail.id);
  }

  if (state.screen === "dashboard") return screenDashboard();
  if (state.screen === "techs") return screenTechs();
  if (state.screen === "dealers") return screenDealers();
  if (state.screen === "upholstery") return screenUpholstery();
  if (state.screen === "calendar") return screenCalendar();
  if (state.screen === "more") return screenMore();

  return screenDashboard();
}

function render() {
  const scroll = $("#scroll");
  scroll.innerHTML = `<div class="fade">${renderBody()}</div>`;
  scroll.scrollTop = 0;
  renderNav();
}

document.addEventListener("click", event => {
  const el = event.target.closest("[data-action]");
  if (!el) return;

  const action = el.dataset.action;
  const arg = el.dataset.arg;

  if (action === "screen") {
    state.screen = arg;
    state.detail = null;
    render();
  }

  if (action === "attention") {
    const card = document.getElementById("attentionCard");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (action === "tech") {
    state.detailPeriod = state.techPeriod;
    state.detail = { type: "tech", id: arg, parent: "techs" };
    render();
  }

  if (action === "dealer") {
    state.detailPeriod = state.dealerPeriod;
    state.detail = { type: "dealer", id: arg, parent: "dealers" };
    render();
  }

  if (action === "day") {
    state.detail = { type: "day", id: arg, parent: "calendar" };
    render();
  }

  if (action === "back") {
    state.detail = null;
    render();
  }

  if (action === "techPeriod") {
    state.techPeriod = arg;
    render();
  }

  if (action === "dealerPeriod") {
    state.dealerPeriod = arg;
    render();
  }

  if (action === "detailPeriod") {
    state.detailPeriod = arg;
    render();
  }

  if (action === "calPrev") {
    state.calM--;
    if (state.calM < 0) {
      state.calM = 11;
      state.calY--;
    }
    render();
  }

  if (action === "calNext") {
    state.calM++;
    if (state.calM > 11) {
      state.calM = 0;
      state.calY++;
    }
    render();
  }

  if (action === "refresh") {
    boot(true);
  }
});

async function boot(forceRender = false) {
  const result = await loadData();

  state.data = result.data;
  state.mode = result.mode;
  state.updated = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (state.calY === null || forceRender) {
    const key = state.data.dashboard.actualTodayKey || state.data.dashboard.lastLoggedKey;
    const parts = key.split("-");
    state.calY = Number(parts[0]);
    state.calM = Number(parts[1]) - 1;
    state.calSelected = key;
  }

  render();
}

boot();
setInterval(() => boot(false), 60000);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
