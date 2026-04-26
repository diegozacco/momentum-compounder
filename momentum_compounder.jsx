import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─────────────────────────────────────────────
   MOMENTUM COMPOUNDER — Premium Fintech Dashboard
   Next.js App Router ready (React SPA preview)
   ───────────────────────────────────────────── */

// ━━━ MOCK DATA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MOCK_PORTFOLIO = {
  totalValue: 847293.42,
  dailyPnl: 12847.33,
  dailyPnlPct: 1.54,
  weeklyPnl: 34291.08,
  weeklyPnlPct: 4.21,
  winRate: 68.4,
  sharpe: 2.31,
  maxDrawdown: -4.8,
  streak: 7,
};

const MOCK_POSITIONS = [
  { sym: "NVDA", name: "NVIDIA Corp", qty: 120, entry: 138.22, current: 149.87, pnl: 1398.0, pnlPct: 8.42, sector: "Tech", momentum: 94, signal: "STRONG BUY", rsi: 71 },
  { sym: "AVGO", name: "Broadcom Inc", qty: 45, entry: 186.50, current: 201.33, pnl: 667.35, pnlPct: 7.95, sector: "Tech", momentum: 89, signal: "BUY", rsi: 66 },
  { sym: "LLY", name: "Eli Lilly", qty: 30, entry: 812.40, current: 847.90, pnl: 1065.0, pnlPct: 4.37, sector: "Health", momentum: 82, signal: "BUY", rsi: 62 },
  { sym: "GE", name: "GE Aerospace", qty: 200, entry: 178.10, current: 189.44, pnl: 2268.0, pnlPct: 6.37, sector: "Industrial", momentum: 78, signal: "HOLD", rsi: 58 },
  { sym: "PANW", name: "Palo Alto Networks", qty: 60, entry: 324.80, current: 311.20, pnl: -816.0, pnlPct: -4.19, sector: "Tech", momentum: 45, signal: "WEAK", rsi: 38 },
  { sym: "META", name: "Meta Platforms", qty: 55, entry: 502.30, current: 538.10, pnl: 1969.0, pnlPct: 7.13, sector: "Tech", momentum: 91, signal: "STRONG BUY", rsi: 69 },
  { sym: "VST", name: "Vistra Corp", qty: 150, entry: 98.40, current: 112.80, pnl: 2160.0, pnlPct: 14.63, sector: "Utility", momentum: 96, signal: "STRONG BUY", rsi: 74 },
  { sym: "PLTR", name: "Palantir Tech", qty: 300, entry: 72.10, current: 78.55, pnl: 1935.0, pnlPct: 8.94, sector: "Tech", momentum: 87, signal: "BUY", rsi: 64 },
];

const MOCK_SCANNER = [
  { sym: "SMCI", name: "Super Micro Computer", score: 97, momentum: 96, vol: "342%", rsi: 73, sector: "Tech", pattern: "Bull Flag", catalyst: "AI server demand surge" },
  { sym: "CRDO", name: "Credo Technology", score: 94, momentum: 93, vol: "287%", rsi: 68, sector: "Tech", pattern: "Cup & Handle", catalyst: "800G switch cycle" },
  { sym: "CEG", name: "Constellation Energy", score: 92, momentum: 91, vol: "198%", rsi: 71, sector: "Utility", pattern: "Ascending Triangle", catalyst: "Nuclear AI data center deals" },
  { sym: "ANET", name: "Arista Networks", score: 89, momentum: 88, vol: "156%", rsi: 65, sector: "Tech", pattern: "Breakout", catalyst: "Campus networking wins" },
  { sym: "APP", name: "AppLovin Corp", score: 87, momentum: 85, vol: "234%", rsi: 67, sector: "Tech", pattern: "Higher Low", catalyst: "E-commerce AXON expansion" },
  { sym: "TRGP", name: "Targa Resources", score: 85, momentum: 84, vol: "134%", rsi: 63, sector: "Energy", pattern: "Channel Breakout", catalyst: "NGL export capacity" },
  { sym: "TT", name: "Trane Technologies", score: 83, momentum: 81, vol: "112%", rsi: 61, sector: "Industrial", pattern: "Consolidation Break", catalyst: "Data center cooling" },
  { sym: "FICO", name: "Fair Isaac Corp", score: 81, momentum: 79, vol: "98%", rsi: 59, sector: "Finance", pattern: "Bull Pennant", catalyst: "Pricing power expansion" },
];

const MOCK_ROTATION = [
  { sector: "Technology", weight: 42, change: 3.2, score: 94, flow: "+$2.4B", status: "OVERWEIGHT" },
  { sector: "Utilities", weight: 14, change: 5.8, score: 89, flow: "+$890M", status: "ADDING" },
  { sector: "Healthcare", weight: 12, change: -1.1, score: 72, flow: "+$340M", status: "NEUTRAL" },
  { sector: "Industrials", weight: 10, change: 2.4, score: 78, flow: "+$560M", status: "ADDING" },
  { sector: "Energy", weight: 8, change: -2.8, score: 55, flow: "-$420M", status: "REDUCING" },
  { sector: "Financials", weight: 7, change: 0.6, score: 64, flow: "+$180M", status: "NEUTRAL" },
  { sector: "Consumer Disc.", weight: 4, change: -3.2, score: 38, flow: "-$780M", status: "UNDERWEIGHT" },
  { sector: "Materials", weight: 3, change: -1.4, score: 41, flow: "-$210M", status: "REDUCING" },
];

const MOCK_JOURNAL = [
  { id: 1, date: "2026-04-24", sym: "VST", side: "LONG", entry: 98.40, exit: 112.80, pnl: 2160, pnlPct: 14.63, note: "Entered on nuclear catalyst breakout above 50-day MA. Thesis: AI data center power demand. Held through consolidation. Exited at measured move target.", grade: "A", tags: ["momentum", "catalyst", "sector-rotation"] },
  { id: 2, date: "2026-04-22", sym: "NVDA", side: "LONG", entry: 132.10, exit: 149.87, pnl: 2132.40, pnlPct: 13.45, note: "Added to winner on earnings beat pullback. Strong relative strength vs SPX. Position sized at 2% risk.", grade: "A", tags: ["earnings", "add-to-winner", "relative-strength"] },
  { id: 3, date: "2026-04-18", sym: "PANW", side: "LONG", entry: 324.80, exit: null, pnl: -816, pnlPct: -4.19, note: "Entered on cybersecurity sector strength. Broke below support, holding for now but stop is tight. Need to review sector thesis.", grade: "C", tags: ["sector-bet", "underwater", "review-thesis"] },
  { id: 4, date: "2026-04-15", sym: "META", side: "LONG", entry: 502.30, exit: null, pnl: 1969, pnlPct: 7.13, note: "Core position. AI monetization thesis intact. Added on pullback to 21-EMA. Strong institutional accumulation on volume.", grade: "A", tags: ["core-position", "AI-thesis", "accumulation"] },
  { id: 5, date: "2026-04-10", sym: "SMCI", side: "LONG", entry: 42.80, exit: 58.20, pnl: 4620, pnlPct: 35.98, note: "Caught the bottom after delisting scare resolved. Massive short squeeze. Took profits at 3R target. Best trade of the month.", grade: "A+", tags: ["mean-reversion", "short-squeeze", "home-run"] },
  { id: 6, date: "2026-04-08", sym: "TSLA", side: "SHORT", entry: 178.50, exit: 185.20, pnl: -670, pnlPct: -3.75, note: "Tried to fade the rally. Got squeezed. Lesson: don't short momentum names in a bull market. Cut loss quickly at least.", grade: "D", tags: ["counter-trend", "mistake", "lesson-learned"] },
];

// ━━━ FONTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FONT_LINK = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap";

// ━━━ STYLE CONSTANTS ━━━━━━━━━━━━━━━━━━━━━━━━━
const C = {
  bg: "#0a0b0f",
  surface: "#12131a",
  surface2: "#1a1b25",
  surface3: "#22232f",
  border: "#2a2b3a",
  borderHover: "#3a3b4f",
  text: "#e8e9f0",
  textMuted: "#7a7b8f",
  textDim: "#4a4b5f",
  accent: "#00d4aa",
  accentDim: "rgba(0,212,170,0.12)",
  accentGlow: "rgba(0,212,170,0.25)",
  red: "#ff4757",
  redDim: "rgba(255,71,87,0.12)",
  amber: "#ffa502",
  amberDim: "rgba(255,165,2,0.12)",
  blue: "#3742fa",
  purple: "#8b5cf6",
};

// ━━━ UTILITY COMPONENTS ━━━━━━━━━━━━━━━━━━━━━━

function fmt(n, dec = 2) {
  return n?.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) ?? "—";
}

function fmtK(n) {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(0);
}

const PnlText = ({ value, size = "sm", showSign = true }) => {
  const pos = value >= 0;
  const sz = size === "lg" ? "text-2xl font-bold" : size === "md" ? "text-lg font-semibold" : "text-sm font-medium";
  return (
    <span className={`${sz} font-mono`} style={{ color: pos ? C.accent : C.red }}>
      {showSign && (pos ? "+" : "")}{fmt(value)}
    </span>
  );
};

const Badge = ({ children, color = "accent", size = "sm" }) => {
  const colors = {
    accent: { bg: C.accentDim, text: C.accent, border: "rgba(0,212,170,0.2)" },
    red: { bg: C.redDim, text: C.red, border: "rgba(255,71,87,0.2)" },
    amber: { bg: C.amberDim, text: C.amber, border: "rgba(255,165,2,0.2)" },
    gray: { bg: "rgba(122,123,143,0.12)", text: C.textMuted, border: "rgba(122,123,143,0.2)" },
    purple: { bg: "rgba(139,92,246,0.12)", text: C.purple, border: "rgba(139,92,246,0.2)" },
  };
  const c = colors[color] || colors.accent;
  const pad = size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  return (
    <span className={`${pad} rounded-full font-semibold tracking-wide uppercase`}
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {children}
    </span>
  );
};

const MomentumBar = ({ value, height = 6 }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ background: C.surface3, height }}>
    <div className="h-full rounded-full transition-all duration-700"
      style={{
        width: `${value}%`,
        background: value > 80 ? `linear-gradient(90deg, ${C.accent}, #00ffcc)` :
          value > 50 ? `linear-gradient(90deg, ${C.amber}, #ffcc00)` :
            `linear-gradient(90deg, ${C.red}, #ff6b81)`,
        boxShadow: value > 80 ? `0 0 12px ${C.accentGlow}` : "none",
      }} />
  </div>
);

const Card = ({ children, className = "", style = {}, hover = false, onClick }) => (
  <div className={`rounded-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
    onClick={onClick}
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      transition: "all 0.2s ease",
      ...(hover ? {} : {}),
      ...style,
    }}
    onMouseEnter={e => { if (hover) { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.transform = "translateY(-1px)"; } }}
    onMouseLeave={e => { if (hover) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; } }}>
    {children}
  </div>
);

const MiniChart = ({ data, color = C.accent, width = 120, height = 40 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height * 0.8 - height * 0.1}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`mc-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#mc-${color.replace("#", "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ━━━ ICONS (inline SVG) ━━━━━━━━━━━━━━━━━━━━━━
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    scanner: <><circle cx="11" cy="11" r="8" fill="none" stroke={color} strokeWidth="2" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" /></>,
    trade: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" fill="none" stroke={color} strokeWidth="2" /><polyline points="16 7 22 7 22 13" fill="none" stroke={color} strokeWidth="2" /></>,
    rotation: <><path d="M21 12a9 9 0 1 1-6.219-8.56" fill="none" stroke={color} strokeWidth="2" /><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" /></>,
    journal: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke={color} strokeWidth="2" /><polyline points="14 2 14 8 20 8" fill="none" stroke={color} strokeWidth="2" /><line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" /><line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="none" stroke={color} strokeWidth="2" /><polyline points="16 17 21 12 16 7" fill="none" stroke={color} strokeWidth="2" /><line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" /></>,
    chevron: <><polyline points="9 18 15 12 9 6" fill="none" stroke={color} strokeWidth="2" /></>,
    fire: <><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" fill="none" stroke={color} strokeWidth="2" /></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke={color} strokeWidth="2" /></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" /><line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" /><line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" /></>,
    close: <><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" /><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" stroke={color} strokeWidth="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke={color} strokeWidth="2" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={color} strokeWidth="2" /><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" /></>,
    eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" fill="none" stroke={color} strokeWidth="2" /><line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

// ━━━ SPARKLINE DATA ━━━━━━━━━━━━━━━━━━━━━━━━━━
const sparkData = () => Array.from({ length: 20 }, (_, i) => 100 + Math.sin(i * 0.5) * 15 + Math.random() * 10 + i * 2);

// ━━━ LOGIN PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (!email || !pass) { setShake(true); setTimeout(() => setShake(false), 600); return; }
    setLoading(true);
    setTimeout(() => onLogin(), 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: C.bg }}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)` }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
        style={{ background: `radial-gradient(circle, ${C.purple} 0%, transparent 70%)` }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `linear-gradient(${C.text} 1px, transparent 1px), linear-gradient(90deg, ${C.text} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className={`relative z-10 w-full max-w-md mx-4 ${shake ? "animate-shake" : ""}`}>
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`, boxShadow: `0 0 30px ${C.accentGlow}` }}>
              <span className="text-black font-black text-lg" style={{ fontFamily: "Outfit" }}>M</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "Outfit", color: C.text }}>
              Momentum<span style={{ color: C.accent }}>.</span>
            </h1>
          </div>
          <p className="text-sm tracking-widest uppercase" style={{ color: C.textMuted, fontFamily: "JetBrains Mono", letterSpacing: "0.2em" }}>
            Compound your edge
          </p>
        </div>

        {/* Login card */}
        <Card className="p-8" style={{ background: "rgba(18,19,26,0.8)", backdropFilter: "blur(20px)" }}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text, fontFamily: "JetBrains Mono" }}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.border}
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all pr-12"
                  style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text, fontFamily: "JetBrains Mono" }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.border}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={() => setShowPass(!showPass)}>
                  <Icon name={showPass ? "eyeOff" : "eye"} size={16} color={C.textMuted} />
                </button>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
              style={{
                background: loading ? C.surface3 : `linear-gradient(135deg, ${C.accent}, #00b894)`,
                color: loading ? C.textMuted : "#000",
                fontFamily: "Outfit",
                boxShadow: loading ? "none" : `0 4px 20px ${C.accentGlow}`,
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : "Sign In"}
            </button>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: C.border }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: C.border }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Google", "GitHub"].map(p => (
              <button key={p} onClick={() => { setLoading(true); setTimeout(onLogin, 1000); }}
                className="py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all hover:border-opacity-50"
                style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: "JetBrains Mono" }}>
                {p}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

// ━━━ SIDEBAR + LAYOUT ━━━━━━━━━━━━━━━━━━━━━━━━
function AppLayout({ page, setPage, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "scanner", label: "Scanner", icon: "scanner" },
    { id: "trade", label: "Trade Detail", icon: "trade" },
    { id: "rotation", label: "Rotation", icon: "rotation" },
    { id: "journal", label: "Journal", icon: "journal" },
  ];

  const Nav = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "" : ""}`}>
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.blue})` }}>
          <span className="text-black font-black text-sm" style={{ fontFamily: "Outfit" }}>M</span>
        </div>
        <span className="text-base font-bold tracking-tight" style={{ fontFamily: "Outfit", color: C.text }}>
          Momentum<span style={{ color: C.accent }}>.</span>
        </span>
      </div>

      <div className="px-3 mt-2 flex-1">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Navigate</p>
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id}
              onClick={() => { setPage(item.id); if (mobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all text-left"
              style={{
                background: active ? C.accentDim : "transparent",
                color: active ? C.accent : C.textMuted,
              }}>
              <Icon name={item.icon} size={18} color={active ? C.accent : C.textMuted} />
              <span className="text-sm font-medium" style={{ fontFamily: "Outfit" }}>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />}
            </button>
          );
        })}
      </div>

      <div className="px-3 pb-6">
        <div className="h-px mb-4" style={{ background: C.border }} />
        <div className="px-3 mb-4">
          <p className="text-xs font-medium" style={{ color: C.textMuted, fontFamily: "Outfit" }}>Diego</p>
          <p className="text-[10px] mt-0.5" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Phase 1 · Demo</p>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
          style={{ color: C.textMuted }}>
          <Icon name="logout" size={18} color={C.textMuted} />
          <span className="text-sm font-medium" style={{ fontFamily: "Outfit" }}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: C.bg }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 flex-shrink-0 border-r" style={{ background: C.surface, borderColor: C.border }}>
        <Nav />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 border-r" style={{ background: C.surface, borderColor: C.border }}>
            <button className="absolute top-4 right-4" onClick={() => setMobileOpen(false)}>
              <Icon name="close" size={20} color={C.textMuted} />
            </button>
            <Nav mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b" style={{ background: C.surface, borderColor: C.border }}>
          <button onClick={() => setMobileOpen(true)}>
            <Icon name="menu" size={22} color={C.textMuted} />
          </button>
          <span className="text-sm font-bold" style={{ fontFamily: "Outfit", color: C.text }}>
            Momentum<span style={{ color: C.accent }}>.</span>
          </span>
          <div className="w-6" />
        </div>
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ━━━ DASHBOARD PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━
function DashboardPage({ setPage }) {
  const p = MOCK_PORTFOLIO;
  const stats = [
    { label: "Portfolio Value", value: `$${fmtK(p.totalValue)}`, sub: null },
    { label: "Daily P&L", value: `+$${fmtK(p.dailyPnl)}`, sub: `+${p.dailyPnlPct}%`, color: C.accent },
    { label: "Win Rate", value: `${p.winRate}%`, sub: `${p.streak} streak`, color: C.accent },
    { label: "Sharpe Ratio", value: p.sharpe.toFixed(2), sub: `DD: ${p.maxDrawdown}%`, color: C.amber },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "Outfit", color: C.text }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="accent">LIVE</Badge>
          <Badge color="gray">US MARKET OPEN</Badge>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {stats.map((s, i) => (
          <Card key={i} className="p-4 lg:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{s.label}</p>
            <p className="text-xl lg:text-2xl font-bold" style={{ fontFamily: "JetBrains Mono", color: s.color || C.text }}>{s.value}</p>
            {s.sub && <p className="text-xs mt-1 font-medium" style={{ color: s.color || C.textMuted, fontFamily: "JetBrains Mono" }}>{s.sub}</p>}
          </Card>
        ))}
      </div>

      {/* Equity curve placeholder + positions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "Outfit", color: C.text }}>Equity Curve</h2>
            <div className="flex gap-1">
              {["1W", "1M", "3M", "YTD"].map(t => (
                <button key={t} className="px-2.5 py-1 rounded text-[10px] font-semibold uppercase"
                  style={{ background: t === "1M" ? C.accentDim : "transparent", color: t === "1M" ? C.accent : C.textDim, fontFamily: "JetBrains Mono" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* SVG chart */}
          <div className="w-full" style={{ height: 200 }}>
            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const pts = Array.from({ length: 60 }, (_, i) => {
                  const y = 140 - i * 1.5 - Math.sin(i * 0.3) * 20 - Math.random() * 8;
                  return `${i * 10.2},${Math.max(20, Math.min(180, y))}`;
                });
                return <>
                  <polygon points={`0,200 ${pts.join(" ")} 600,200`} fill="url(#eqGrad)" />
                  <polyline points={pts.join(" ")} fill="none" stroke={C.accent} strokeWidth="2" />
                </>;
              })()}
            </svg>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "Outfit", color: C.text }}>Sector Allocation</h2>
          <div className="space-y-3">
            {[{ s: "Technology", w: 62, c: C.accent }, { s: "Healthcare", w: 14, c: C.blue }, { s: "Industrials", w: 12, c: C.purple }, { s: "Utilities", w: 8, c: C.amber }, { s: "Other", w: 4, c: C.textDim }].map(item => (
              <div key={item.s}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>{item.s}</span>
                  <span className="font-semibold" style={{ color: item.c, fontFamily: "JetBrains Mono" }}>{item.w}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.surface3 }}>
                  <div className="h-full rounded-full" style={{ width: `${item.w}%`, background: item.c }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active positions table */}
      <Card className="p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "Outfit", color: C.text }}>Active Positions</h2>
          <button onClick={() => setPage("trade")} className="text-xs font-semibold hover:underline" style={{ color: C.accent, fontFamily: "JetBrains Mono" }}>
            View All →
          </button>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border }}>
                {["Symbol", "Momentum", "Signal", "Entry", "Current", "P&L", ""].map((h, i) => (
                  <th key={i} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em]"
                    style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_POSITIONS.slice(0, 5).map((pos, i) => (
                <tr key={i} className="border-b transition-colors cursor-pointer"
                  style={{ borderColor: "rgba(42,43,58,0.5)" }}
                  onClick={() => setPage("trade")}
                  onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold" style={{ fontFamily: "JetBrains Mono", color: C.text }}>{pos.sym}</span>
                    <span className="text-xs ml-2" style={{ color: C.textDim }}>{pos.name}</span>
                  </td>
                  <td className="px-5 py-3 w-28"><MomentumBar value={pos.momentum} /></td>
                  <td className="px-5 py-3"><Badge color={pos.signal.includes("STRONG") ? "accent" : pos.signal === "WEAK" ? "red" : "amber"} size="xs">{pos.signal}</Badge></td>
                  <td className="px-5 py-3 text-sm font-mono" style={{ color: C.textMuted }}>${fmt(pos.entry)}</td>
                  <td className="px-5 py-3 text-sm font-mono" style={{ color: C.text }}>${fmt(pos.current)}</td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold font-mono" style={{ color: pos.pnl >= 0 ? C.accent : C.red }}>
                      {pos.pnl >= 0 ? "+" : ""}{pos.pnlPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-3"><Icon name="chevron" size={14} color={C.textDim} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ━━━ SCANNER PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ScannerPage() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const filtered = useMemo(() => {
    let list = [...MOCK_SCANNER];
    if (filter !== "all") list = list.filter(s => s.sector.toLowerCase() === filter);
    list.sort((a, b) => b[sortBy] - a[sortBy]);
    return list;
  }, [filter, sortBy]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "Outfit", color: C.text }}>Scanner</h1>
          <p className="text-sm mt-1" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>Momentum breakout candidates</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "tech", "utility", "energy", "industrial", "finance"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: filter === f ? C.accentDim : C.surface2,
                color: filter === f ? C.accent : C.textMuted,
                border: `1px solid ${filter === f ? "rgba(0,212,170,0.3)" : C.border}`,
                fontFamily: "JetBrains Mono",
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((stock, i) => (
          <Card key={stock.sym} hover className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ fontFamily: "JetBrains Mono", color: C.text }}>{stock.sym}</span>
                  <Badge color={stock.score >= 90 ? "accent" : stock.score >= 80 ? "amber" : "gray"} size="xs">
                    {stock.score >= 90 ? "🔥 HOT" : stock.score >= 80 ? "WARM" : "WATCH"}
                  </Badge>
                </div>
                <p className="text-xs mt-0.5" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{stock.name}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold" style={{ fontFamily: "JetBrains Mono", color: C.accent }}>{stock.score}</div>
                <p className="text-[9px] uppercase tracking-widest" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>SCORE</p>
              </div>
            </div>

            <MomentumBar value={stock.momentum} height={4} />

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>RSI</p>
                <p className="text-sm font-bold font-mono" style={{ color: stock.rsi > 70 ? C.amber : C.text }}>{stock.rsi}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Rel.Vol</p>
                <p className="text-sm font-bold font-mono" style={{ color: C.accent }}>{stock.vol}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Pattern</p>
                <p className="text-sm font-semibold truncate" style={{ color: C.text, fontFamily: "Outfit" }}>{stock.pattern}</p>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg" style={{ background: C.surface2 }}>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Catalyst</p>
              <p className="text-xs" style={{ color: C.textMuted, fontFamily: "Outfit" }}>{stock.catalyst}</p>
            </div>

            <MiniChart data={sparkData()} color={stock.score >= 90 ? C.accent : C.amber} width={280} height={30} />
          </Card>
        ))}
      </div>
    </div>
  );
}

// ━━━ TRADE DETAIL PAGE ━━━━━━━━━━━━━━━━━━━━━━━
function TradeDetailPage() {
  const [selected, setSelected] = useState(0);
  const pos = MOCK_POSITIONS[selected];

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "Outfit", color: C.text }}>Trade Detail</h1>
      <p className="text-sm mb-8" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>Position analysis & management</p>

      {/* Position selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {MOCK_POSITIONS.map((p, i) => (
          <button key={p.sym} onClick={() => setSelected(i)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              background: selected === i ? C.accentDim : C.surface2,
              color: selected === i ? C.accent : C.textMuted,
              border: `1px solid ${selected === i ? "rgba(0,212,170,0.3)" : C.border}`,
              fontFamily: "JetBrains Mono",
            }}>
            {p.sym}
            <span className="ml-1.5" style={{ color: p.pnl >= 0 ? C.accent : C.red }}>
              {p.pnl >= 0 ? "↑" : "↓"}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main info */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-extrabold" style={{ fontFamily: "JetBrains Mono", color: C.text }}>{pos.sym}</h2>
                <Badge color={pos.signal.includes("STRONG") ? "accent" : pos.signal === "WEAK" ? "red" : "amber"}>{pos.signal}</Badge>
              </div>
              <p className="text-sm mt-1" style={{ color: C.textDim, fontFamily: "Outfit" }}>{pos.name} · {pos.sector}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold font-mono" style={{ color: C.text }}>${fmt(pos.current)}</p>
              <p className="text-sm font-semibold font-mono mt-1" style={{ color: pos.pnl >= 0 ? C.accent : C.red }}>
                {pos.pnl >= 0 ? "+" : ""}{pos.pnlPct.toFixed(2)}% · {pos.pnl >= 0 ? "+" : ""}${fmt(pos.pnl)}
              </p>
            </div>
          </div>

          {/* Chart area */}
          <div className="rounded-lg p-4 mb-6" style={{ background: C.surface2 }}>
            <svg width="100%" height="180" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={pos.pnl >= 0 ? C.accent : C.red} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={pos.pnl >= 0 ? C.accent : C.red} stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const seed = pos.sym.charCodeAt(0);
                const pts = Array.from({ length: 50 }, (_, i) => {
                  const trend = pos.pnl >= 0 ? -1.2 : 0.8;
                  const y = 100 + trend * i + Math.sin(i * 0.4 + seed) * 18 + (Math.random() * 10 - 5);
                  return `${i * 10.2},${Math.max(15, Math.min(165, y))}`;
                });
                return <>
                  <line x1="0" y1="90" x2="500" y2="90" stroke={C.border} strokeDasharray="4,4" />
                  <polygon points={`0,180 ${pts.join(" ")} 500,180`} fill="url(#tdGrad)" />
                  <polyline points={pts.join(" ")} fill="none" stroke={pos.pnl >= 0 ? C.accent : C.red} strokeWidth="2" />
                </>;
              })()}
            </svg>
            <div className="flex justify-between text-[10px] mt-2" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>
              <span>Entry: ${fmt(pos.entry)}</span>
              <span>Current: ${fmt(pos.current)}</span>
            </div>
          </div>

          {/* Trade stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { l: "Quantity", v: pos.qty },
              { l: "Entry Price", v: `$${fmt(pos.entry)}` },
              { l: "Position Size", v: `$${fmtK(pos.qty * pos.entry)}` },
              { l: "RSI (14)", v: pos.rsi, c: pos.rsi > 70 ? C.amber : pos.rsi < 30 ? C.red : C.accent },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: C.surface2 }}>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{s.l}</p>
                <p className="text-base font-bold" style={{ fontFamily: "JetBrains Mono", color: s.c || C.text }}>{s.v}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Side panel */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "Outfit", color: C.text }}>Momentum Score</h3>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full" style={{ border: `3px solid ${pos.momentum > 70 ? C.accent : pos.momentum > 40 ? C.amber : C.red}`, boxShadow: `0 0 20px ${pos.momentum > 70 ? C.accentGlow : "transparent"}` }}>
                <span className="text-3xl font-extrabold" style={{ fontFamily: "JetBrains Mono", color: pos.momentum > 70 ? C.accent : pos.momentum > 40 ? C.amber : C.red }}>
                  {pos.momentum}
                </span>
              </div>
            </div>
            <MomentumBar value={pos.momentum} />
          </Card>

          <Card className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "Outfit", color: C.text }}>Risk Levels</h3>
            <div className="space-y-3">
              {[
                { l: "Stop Loss", v: `$${fmt(pos.entry * 0.95)}`, c: C.red },
                { l: "Target 1 (1R)", v: `$${fmt(pos.entry * 1.05)}`, c: C.amber },
                { l: "Target 2 (2R)", v: `$${fmt(pos.entry * 1.10)}`, c: C.accent },
                { l: "Target 3 (3R)", v: `$${fmt(pos.entry * 1.15)}`, c: C.accent },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded" style={{ background: C.surface2 }}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{r.l}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: r.c }}>{r.v}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{ background: C.accentDim, color: C.accent, border: `1px solid rgba(0,212,170,0.2)`, fontFamily: "JetBrains Mono" }}>
              Add Size
            </button>
            <button className="py-3 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{ background: C.redDim, color: C.red, border: `1px solid rgba(255,71,87,0.2)`, fontFamily: "JetBrains Mono" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━ ROTATION PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function RotationPage() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "Outfit", color: C.text }}>Sector Rotation</h1>
      <p className="text-sm mb-8" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>Capital flow & relative strength analysis</p>

      {/* Rotation heatmap */}
      <Card className="p-5 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "Outfit", color: C.text }}>Rotation Heatmap</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MOCK_ROTATION.map(r => {
            const intensity = r.score / 100;
            const bg = r.change > 0
              ? `rgba(0,212,170,${intensity * 0.3})`
              : `rgba(255,71,87,${Math.abs(r.change / 10) * 0.3})`;
            return (
              <div key={r.sector} className="p-4 rounded-lg text-center transition-all cursor-pointer"
                style={{ background: bg, border: `1px solid ${r.change > 0 ? "rgba(0,212,170,0.15)" : "rgba(255,71,87,0.15)"}` }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <p className="text-xs font-bold" style={{ fontFamily: "Outfit", color: C.text }}>{r.sector}</p>
                <p className="text-lg font-extrabold mt-1 font-mono" style={{ color: r.change >= 0 ? C.accent : C.red }}>
                  {r.change >= 0 ? "+" : ""}{r.change}%
                </p>
                <p className="text-[10px] mt-1" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>{r.weight}% alloc</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detailed table */}
      <Card className="p-5 overflow-hidden">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "Outfit", color: C.text }}>Rotation Detail</h2>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border }}>
                {["Sector", "Weight", "Momentum", "Change", "Flow", "Action"].map((h, i) => (
                  <th key={i} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em]"
                    style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ROTATION.map((r, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "rgba(42,43,58,0.5)" }}>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ fontFamily: "Outfit", color: C.text }}>{r.sector}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16"><MomentumBar value={r.weight * 2.5} height={4} /></div>
                      <span className="text-xs font-mono" style={{ color: C.textMuted }}>{r.weight}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono" style={{ color: r.score > 70 ? C.accent : r.score > 50 ? C.amber : C.red }}>{r.score}</span>
                      <MiniChart data={sparkData()} color={r.score > 70 ? C.accent : C.amber} width={60} height={20} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold font-mono" style={{ color: r.change >= 0 ? C.accent : C.red }}>
                      {r.change >= 0 ? "+" : ""}{r.change}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono" style={{ color: r.flow.startsWith("+") ? C.accent : C.red }}>{r.flow}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge color={r.status === "OVERWEIGHT" || r.status === "ADDING" ? "accent" : r.status === "REDUCING" || r.status === "UNDERWEIGHT" ? "red" : "gray"} size="xs">
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rotation cycle visual */}
      <Card className="p-5 mt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "Outfit", color: C.text }}>Economic Cycle Position</h2>
        <div className="flex items-center justify-between gap-1 overflow-x-auto">
          {["Recovery", "Expansion", "Peak", "Contraction"].map((phase, i) => {
            const active = i === 1;
            return (
              <div key={phase} className="flex-1 min-w-[100px] text-center p-4 rounded-lg transition-all"
                style={{
                  background: active ? C.accentDim : C.surface2,
                  border: `1px solid ${active ? "rgba(0,212,170,0.3)" : C.border}`,
                }}>
                <p className="text-xs font-bold" style={{ fontFamily: "Outfit", color: active ? C.accent : C.textMuted }}>{phase}</p>
                {active && <p className="text-[10px] mt-1" style={{ color: C.accent, fontFamily: "JetBrains Mono" }}>← CURRENT</p>}
                <p className="text-[9px] mt-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>
                  {["Financials, Consumer", "Tech, Industrials", "Energy, Materials", "Utilities, Healthcare"][i]}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ━━━ JOURNAL PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function JournalPage() {
  const [expanded, setExpanded] = useState(null);
  const [newEntry, setNewEntry] = useState(false);

  const gradeColor = g => {
    if (g.startsWith("A")) return C.accent;
    if (g === "B") return C.blue;
    if (g === "C") return C.amber;
    return C.red;
  };

  // Stats
  const totalPnl = MOCK_JOURNAL.reduce((a, j) => a + j.pnl, 0);
  const winners = MOCK_JOURNAL.filter(j => j.pnl > 0).length;
  const avgWin = MOCK_JOURNAL.filter(j => j.pnl > 0).reduce((a, j) => a + j.pnl, 0) / winners || 0;
  const losers = MOCK_JOURNAL.filter(j => j.pnl < 0);
  const avgLoss = losers.reduce((a, j) => a + j.pnl, 0) / losers.length || 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "Outfit", color: C.text }}>Trade Journal</h1>
          <p className="text-sm mt-1" style={{ color: C.textMuted, fontFamily: "JetBrains Mono" }}>Track execution & identify patterns</p>
        </div>
        <button onClick={() => setNewEntry(!newEntry)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all self-start"
          style={{ background: `linear-gradient(135deg, ${C.accent}, #00b894)`, color: "#000", fontFamily: "JetBrains Mono", boxShadow: `0 4px 15px ${C.accentGlow}` }}>
          + New Entry
        </button>
      </div>

      {/* Journal stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Total P&L", v: `$${fmtK(totalPnl)}`, c: totalPnl >= 0 ? C.accent : C.red },
          { l: "Win Rate", v: `${((winners / MOCK_JOURNAL.length) * 100).toFixed(0)}%`, c: C.accent },
          { l: "Avg Win", v: `$${fmtK(avgWin)}`, c: C.accent },
          { l: "Avg Loss", v: `$${fmtK(Math.abs(avgLoss))}`, c: C.red },
        ].map((s, i) => (
          <Card key={i} className="p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{s.l}</p>
            <p className="text-xl font-bold" style={{ fontFamily: "JetBrains Mono", color: s.c }}>{s.v}</p>
          </Card>
        ))}
      </div>

      {/* New entry form */}
      {newEntry && (
        <Card className="p-5 mb-6" style={{ border: `1px solid rgba(0,212,170,0.3)` }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "Outfit", color: C.accent }}>New Journal Entry</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {["Symbol", "Side", "Entry $", "Exit $"].map(f => (
              <div key={f}>
                <label className="block text-[9px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{f}</label>
                <input className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text, fontFamily: "JetBrains Mono" }}
                  placeholder={f} />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-[9px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Trade Notes</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
              style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text, fontFamily: "Outfit" }}
              placeholder="What was your thesis? Entry trigger? Execution quality?" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-xs font-bold uppercase"
              style={{ background: C.accentDim, color: C.accent, fontFamily: "JetBrains Mono" }}>Save Entry</button>
            <button onClick={() => setNewEntry(false)} className="px-4 py-2 rounded-lg text-xs font-bold uppercase"
              style={{ background: C.surface2, color: C.textMuted, fontFamily: "JetBrains Mono" }}>Cancel</button>
          </div>
        </Card>
      )}

      {/* Journal entries */}
      <div className="space-y-3">
        {MOCK_JOURNAL.map(entry => (
          <Card key={entry.id} className="overflow-hidden" hover onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: entry.pnl >= 0 ? C.accentDim : C.redDim }}>
                    <span className="text-sm font-extrabold font-mono" style={{ color: entry.pnl >= 0 ? C.accent : C.red }}>
                      {entry.sym}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ fontFamily: "Outfit", color: C.text }}>{entry.sym}</span>
                      <Badge color={entry.side === "LONG" ? "accent" : "red"} size="xs">{entry.side}</Badge>
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold"
                        style={{
                          background: `rgba(${gradeColor(entry.grade) === C.accent ? "0,212,170" : gradeColor(entry.grade) === C.red ? "255,71,87" : gradeColor(entry.grade) === C.amber ? "255,165,2" : "55,66,250"},0.15)`,
                          color: gradeColor(entry.grade),
                          fontFamily: "JetBrains Mono",
                        }}>
                        {entry.grade}
                      </span>
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>{entry.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-base font-bold font-mono" style={{ color: entry.pnl >= 0 ? C.accent : C.red }}>
                      {entry.pnl >= 0 ? "+" : ""}${fmt(entry.pnl, 0)}
                    </p>
                    <p className="text-xs font-mono" style={{ color: entry.pnl >= 0 ? C.accent : C.red }}>
                      {entry.pnl >= 0 ? "+" : ""}{entry.pnlPct.toFixed(1)}%
                    </p>
                  </div>
                  <div className="transition-transform" style={{ transform: expanded === entry.id ? "rotate(90deg)" : "none" }}>
                    <Icon name="chevron" size={16} color={C.textDim} />
                  </div>
                </div>
              </div>
            </div>

            {expanded === entry.id && (
              <div className="px-5 pb-5 pt-0" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-2.5 rounded-lg" style={{ background: C.surface2 }}>
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Entry</p>
                    <p className="text-xs font-bold font-mono" style={{ color: C.text }}>${fmt(entry.entry)}</p>
                  </div>
                  <div className="p-2.5 rounded-lg" style={{ background: C.surface2 }}>
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Exit</p>
                    <p className="text-xs font-bold font-mono" style={{ color: C.text }}>{entry.exit ? `$${fmt(entry.exit)}` : "OPEN"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg" style={{ background: C.surface2 }}>
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>P&L</p>
                    <p className="text-xs font-bold font-mono" style={{ color: entry.pnl >= 0 ? C.accent : C.red }}>
                      {entry.pnl >= 0 ? "+" : ""}${fmt(entry.pnl, 0)}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg" style={{ background: C.surface2 }}>
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Grade</p>
                    <p className="text-xs font-bold" style={{ color: gradeColor(entry.grade), fontFamily: "JetBrains Mono" }}>{entry.grade}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg mb-3" style={{ background: C.surface2 }}>
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.textDim, fontFamily: "JetBrains Mono" }}>Trade Notes</p>
                  <p className="text-xs leading-relaxed" style={{ color: C.textMuted, fontFamily: "Outfit" }}>{entry.note}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map(tag => (
                    <Badge key={tag} color="purple" size="xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ━━━ MAIN APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState("dashboard");

  const pages = {
    dashboard: <DashboardPage setPage={setPage} />,
    scanner: <ScannerPage />,
    trade: <TradeDetailPage />,
    rotation: <RotationPage />,
    journal: <JournalPage />,
  };

  if (!authed) return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`* { box-sizing: border-box; } body { margin: 0; font-family: 'Outfit', sans-serif; }`}</style>
      <LoginPage onLogin={() => setAuthed(true)} />
    </>
  );

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`* { box-sizing: border-box; } body { margin: 0; font-family: 'Outfit', sans-serif; } ::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; } ::-webkit-scrollbar-thumb:hover { background: ${C.borderHover}; }`}</style>
      <AppLayout page={page} setPage={setPage} onLogout={() => setAuthed(false)}>
        {pages[page]}
      </AppLayout>
    </>
  );
}
