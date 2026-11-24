// @ts-nocheck
"use client";
/* =========================================================================
   InfraTrack landing page — "Auralis" visual theme (from the Stitch export).
   Warm neutrals (#F7F7F5 / #F3F2EF / #FCFCFB), black pill buttons, Geist type,
   24px cards on 1px #E7E7E4 borders, soft coral/blue/green "glows".
   Same props as LandingPage:  onLogin(role, mode)  and  updated.
   The old dark landing page is still in LandingPage.tsx (switch back in landing-client.tsx).
   ========================================================================= */
import React, { useEffect, useState } from "react";
import {
  GitMerge, Layers, Waypoints, TrendingUp, HardHat, Camera, Building2, CloudRain, Truck, Wrench, Boxes,
  AlertTriangle, ArrowRight, Menu, X, Plus, Minus, Check, Send, Shield, FolderKanban,
} from "lucide-react";
import { useBackdrop } from "./useBackdrop";
import { sendContactMessage } from "./SiteExtras";

const FONT = "'Geist', 'Inter', 'Segoe UI', system-ui, sans-serif";
const C = { bg: "#F7F7F5", panel: "#F3F2EF", card: "#FCFCFB", line: "#E7E7E4", ink: "#111111", mute: "#6B6B6B", coral: "#FF8A6B", blue: "#6FA8FF", green: "#6FD3A0", violet: "#B79CFF" };

const NAV = [["Platform", "platform"], ["Features", "features"], ["Sectors", "sectors"], ["Roles", "roles"], ["FAQ", "faq"], ["Contact", "contact"]];
const FEATURES = [
  { icon: GitMerge, title: "Plan vs Actual", text: "Enter the plan once. Each day's workers, machines and progress % are compared with it, with status rules from On track to Delayed." },
  { icon: Layers, title: "Data Entry", text: "Daily report, activity quantities, cost, safety incidents, and bulk paste from Excel or CSV, with checks on every entry." },
  { icon: Waypoints, title: "Activities and Gantt", text: "Log quantity done per activity and see each one against its planned dates on a timeline." },
  { icon: TrendingUp, title: "Cost and forecast", text: "Budget vs actual cost, plus a predicted finish date worked out from the pace reported so far." },
  { icon: HardHat, title: "Safety and site log", text: "Incidents and near misses by type and severity, with weather and hours lost recorded in the daily report." },
  { icon: Camera, title: "Reports and backup", text: "Daily progress report, PDF and Excel project reports, an audit trail, and cloud sync to your own account." },
];
const PILLARS = [
  { tint: "violet", icon: Camera, title: "Field Data Capture", text: "Turn site evidence, photos and daily numbers into schedule-linked actual progress." },
  { tint: "green", icon: AlertTriangle, title: "Delay Detection", text: "Scan activity data for risk signals before they move the finish date." },
];
const SECTORS = [
  ["Highways & Expressways", Waypoints], ["Rail Corridors", Layers], ["Metro & Depots", Building2], ["Bridges & Structures", HardHat],
  ["Drainage & Culverts", CloudRain], ["Pavement", Truck], ["Utilities & Ducting", Wrench], ["Earthworks", Boxes],
];
const ROLES = [
  { id: "admin", label: "Admin", icon: Shield, blurb: "Full platform & access control" },
  { id: "pm", label: "Project Manager", icon: FolderKanban, blurb: "Schedule, budget & delivery" },
  { id: "site", label: "Site Engineer", icon: HardHat, blurb: "Field capture & daily reports" },
  { id: "contractor", label: "Contractor", icon: Truck, blurb: "Package progress & crews" },
  { id: "client", label: "Client / Owner", icon: Building2, blurb: "Read-only project visibility" },
];
const FAQ = [
  ["Do I need an account to use InfraTrack?", "Yes. Create an account with your email and sign in. Your projects are saved to your own account, so you can open them from any device."],
  ["Who can see my project data?", "Only you. Each account's data is stored in rows that only that account can read or change."],
  ["Can I enter many daily reports at once?", "Yes. In Data Entry, paste cells from Excel or Google Sheets, or load a CSV file. Every row is checked before it is imported, and rows with problems are skipped."],
  ["How does InfraTrack decide a project is delayed?", "It compares the cumulative progress reported with the planned progress for the same day. Two points behind is At Risk, six points behind is Delayed, and four points ahead is Ahead."],
  ["What can I export?", "The daily progress report, the project report as PDF and Excel, and the plan vs actual table as CSV. A full backup of your data can be saved from Backup & Cloud."],
  ["Which languages are supported?", "English and Hindi."],
  ["Does it work on a phone?", "The workspace has a layout and a bottom menu for small screens, so daily entries can be made from site."],
];

function Logo({ size = 28 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: size, height: size, borderRadius: 9, background: C.ink, display: "grid", placeItems: "center" }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
          <path d="M2.5 17.5 L8.5 10.5 L13 14 L21.5 4.5" stroke="#FCFCFB" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 4.5 L21.5 4.5 L21.5 9.5" stroke="#FCFCFB" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em" }}>InfraTrack</span>
    </span>
  );
}

function Chip({ children, dot }) {
  return <span className="au-chip">{dot && <i style={{ background: dot }} />}{children}</span>;
}

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "", website: "" });
  const [st, setSt] = useState("idle");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (st === "sending") return;
    if (!f.name.trim()) { setErr("Enter your name."); setSt("error"); return; }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { setErr("Enter a valid email address."); setSt("error"); return; }
    if (f.message.trim().length < 5) { setErr("Write a message of at least 5 characters."); setSt("error"); return; }
    if (f.website) { setSt("sent"); return; } // hidden field: a bot filled it
    setSt("sending"); setErr("");
    const r = await sendContactMessage(f);
    if (r.ok) { setSt("sent"); setF({ name: "", email: "", message: "", website: "" }); } else { setSt("error"); setErr(r.error); }
  };
  if (st === "sent") return (
    <div role="status" className="au-card" style={{ padding: 32, textAlign: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#6FD3A033", display: "grid", placeItems: "center", margin: "0 auto 12px" }}><Check size={22} color="#1C8A56" /></div>
      <div style={{ fontWeight: 600, fontSize: 18 }}>Message sent</div>
      <p style={{ color: C.mute, margin: "6px 0 16px" }}>Thank you. We will read it soon.</p>
      <button className="au-btn au-ghost" onClick={() => setSt("idle")}>Send another</button>
    </div>
  );
  return (
    <form onSubmit={submit} noValidate className="au-card" style={{ padding: 28, display: "grid", gap: 12 }}>
      <input className="au-input" aria-label="Your name" placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input className="au-input" aria-label="Your email" type="email" placeholder="Your email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <textarea className="au-input" aria-label="Message" placeholder="How can we help?" rows={4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
      {st === "error" && <div role="alert" style={{ color: "#BA1A1A", fontSize: 13.5, fontWeight: 600 }}>{err}</div>}
      <button type="submit" disabled={st === "sending"} className="au-btn au-solid" style={{ justifySelf: "start" }}><Send size={15} /> {st === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}

export default function AuralisLanding({ onLogin = () => {}, updated = "" }) {
  useBackdrop(C.bg);
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState(0);
  const [tab, setTab] = useState(0);
  const go = (id) => { setMenu(false); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const signIn = () => onLogin(null, "login");
  const signUp = () => onLogin(null, "register");
  const TABS = [["Plan vs Actual", "Cumulative progress", 42, 37], ["Delay detection", "Activities at risk", 8, 3], ["Forecast", "Projected finish slip (days)", 30, 21]];
  const t = TABS[tab];

  useEffect(() => { const id = setInterval(() => setTab((x) => (x + 1) % 3), 6000); return () => clearInterval(id); }, []);

  return (
    <div className="au" style={{ fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
        .au { background:${C.bg}; color:${C.ink}; min-height:100vh; -webkit-font-smoothing:antialiased; }
        .au * { box-sizing:border-box; }
        .au a { color:inherit; text-decoration:none; }
        .au-wrap { max-width:1280px; margin:0 auto; padding:0 32px; }
        .au-nav { position:sticky; top:0; z-index:50; background:rgba(247,247,245,.86); backdrop-filter:blur(14px); border-bottom:1px solid ${C.line}; }
        .au-nav-in { height:64px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
        .au-links { display:flex; gap:26px; font-size:13.5px; color:${C.mute}; }
        .au-links button { background:none; border:0; font:inherit; color:inherit; cursor:pointer; padding:6px 0; }
        .au-links button:hover { color:${C.ink}; }
        .au-btn { font-family:inherit; font-size:13.5px; font-weight:600; padding:11px 20px; border-radius:999px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:transform .15s, background .15s; }
        .au-btn:active { transform:scale(.97); }
        .au-solid { background:${C.ink}; color:${C.card}; border:1px solid ${C.ink}; }
        .au-solid:hover { background:#2a2a2a; }
        .au-ghost { background:transparent; color:${C.ink}; border:1px solid ${C.line}; }
        .au-ghost:hover { background:${C.panel}; }
        .au-card { background:${C.card}; border:1px solid ${C.line}; border-radius:24px; position:relative; overflow:hidden; }
        .au-input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid transparent; border-bottom:1px solid ${C.line}; background:${C.panel}; font:inherit; font-size:15px; color:${C.ink}; outline:none; }
        .au-input:focus { box-shadow:0 0 0 3px rgba(111,168,255,.28); }
        .au-chip { display:inline-flex; align-items:center; gap:8px; padding:6px 12px; border-radius:999px; background:${C.panel}; font-size:12px; color:${C.mute}; }
        .au-chip i { width:6px; height:6px; border-radius:50%; display:inline-block; }
        .au-label { font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:${C.mute}; }
        .au h1 { font-size:clamp(40px,6.4vw,84px); line-height:1.05; letter-spacing:-.04em; font-weight:600; margin:0; }
        .au h2 { font-size:clamp(30px,4.4vw,56px); line-height:1.1; letter-spacing:-.03em; font-weight:600; margin:0; }
        .au h3 { font-size:22px; line-height:1.2; letter-spacing:-.02em; font-weight:600; margin:0; }
        .au p { margin:0; }
        .au-sec { padding:clamp(80px,11vw,150px) 0 0; }
        .au-lead { font-size:18px; line-height:1.6; color:${C.mute}; letter-spacing:-.01em; }
        .au-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .au-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .au-glow { position:absolute; inset:auto auto -60px -40px; width:260px; height:200px; border-radius:50%; filter:blur(60px); opacity:.0; transition:opacity .35s; pointer-events:none; }
        .au-hov:hover .au-glow { opacity:.55; }
        .au-hov { transition:transform .2s; }
        .au-hov:hover { transform:translateY(-2px); }
        .au-orb { position:absolute; left:50%; top:46%; width:min(520px,78%); aspect-ratio:1.5; transform:translate(-50%,-50%); filter:blur(46px); border-radius:50%;
          background:radial-gradient(40% 50% at 30% 40%, ${C.coral}cc, transparent 70%), radial-gradient(45% 55% at 68% 38%, ${C.blue}d9, transparent 72%), radial-gradient(40% 50% at 52% 70%, ${C.violet}b3, transparent 70%);
          animation:auFloat 9s ease-in-out infinite; }
        @keyframes auFloat { 0%,100% { transform:translate(-50%,-50%) scale(1) } 50% { transform:translate(-50%,-52%) scale(1.06) } }
        @keyframes auRise { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
        .au-rise { animation:auRise .7s ease both; }
        .au-burger { display:none; background:none; border:1px solid ${C.line}; border-radius:12px; width:40px; height:40px; cursor:pointer; place-items:center; color:${C.ink}; }
        .au-mob { display:none; }
        @media (max-width:900px) {
          .au-links, .au-nav .au-hide-m { display:none; }
          .au-burger { display:grid; }
          .au-mob { display:grid; gap:2px; padding:8px 32px 18px; border-top:1px solid ${C.line}; background:${C.bg}; }
          .au-mob button { text-align:left; background:none; border:0; font:inherit; font-size:16px; padding:12px 0; border-bottom:1px solid ${C.line}; cursor:pointer; }
          .au-grid2, .au-grid3 { grid-template-columns:1fr; }
          .au-split { grid-template-columns:1fr !important; }
          .au-wrap { padding:0 20px; }
        }
        @media (prefers-reduced-motion:reduce) { .au-orb, .au-rise { animation:none; } }
      `}</style>

      {/* ---------- nav ---------- */}
      <header className="au-nav no-print">
        <div className="au-wrap au-nav-in">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", padding: 0 }} aria-label="InfraTrack home"><Logo /></button>
          <nav className="au-links" aria-label="Sections">{NAV.map(([l, id]) => <button key={id} onClick={() => go(id)}>{l}</button>)}</nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="au-btn au-ghost au-hide-m" onClick={signIn}>Sign in</button>
            <button className="au-btn au-solid" onClick={signUp}>Sign up</button>
            <button className="au-burger" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((m) => !m)}>{menu ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
        {menu && <div className="au-mob">{NAV.map(([l, id]) => <button key={id} onClick={() => go(id)}>{l}</button>)}<button onClick={signIn}>Sign in</button></div>}
      </header>

      <main id="main">
        {/* ---------- hero ---------- */}
        <section className="au-wrap au-rise" style={{ paddingTop: "clamp(48px,7vw,96px)" }}>
          <div className="au-split" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "end" }}>
            <h1>Plans meet reality on every site.</h1>
            <p className="au-lead" style={{ maxWidth: 420, justifySelf: "end" }}>Enter the plan once. InfraTrack compares each day's workers, machines and progress with it, flags delays early and forecasts the finish date.</p>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <button className="au-btn au-solid" onClick={signUp}>Sign up</button>
            <button className="au-btn au-ghost" onClick={() => go("contact")}>Contact us</button>
          </div>

          <div id="platform" className="au-card" style={{ marginTop: 64, background: C.panel, borderRadius: 28, padding: "clamp(16px,2.4vw,28px)", minHeight: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TABS.map(([name], i) => (
                  <button key={name} onClick={() => setTab(i)} className="au-chip" style={{ border: `1px solid ${tab === i ? C.ink : C.line}`, background: tab === i ? C.card : "transparent", color: C.ink, cursor: "pointer", font: "inherit", fontSize: 12.5 }}>{name}</button>
                ))}
              </div>
              <Chip dot={C.green}>Live site tracking</Chip>
            </div>
            <div className="au-orb" aria-hidden="true" />
            <div style={{ position: "relative", zIndex: 2, display: "grid", placeItems: "center", minHeight: 330 }}>
              <div style={{ background: "rgba(252,252,251,.72)", backdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.8)", borderRadius: 24, padding: "22px 28px", width: "min(360px,100%)" }}>
                <div className="au-label">{t[0]} · sample</div>
                <div style={{ fontSize: 14, color: C.mute, margin: "4px 0 14px" }}>{t[1]}</div>
                <div style={{ display: "flex", gap: 28 }}>
                  <div><div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-.03em" }}>{t[2]}{tab === 2 ? "" : tab === 0 ? "%" : ""}</div><div className="au-label" style={{ marginTop: 2 }}>Planned</div></div>
                  <div><div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-.03em", color: "#B3402A" }}>{t[3]}{tab === 0 ? "%" : ""}</div><div className="au-label" style={{ marginTop: 2 }}>Actual</div></div>
                </div>
                <div style={{ height: 6, background: C.line, borderRadius: 9, marginTop: 18, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, (t[3] / t[2]) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${C.coral}, ${C.blue})`, borderRadius: 9, transition: "width .5s" }} />
                </div>
              </div>
            </div>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", background: "rgba(252,252,251,.8)", border: `1px solid ${C.line}`, borderRadius: 16, padding: "10px 12px 10px 18px" }}>
              <span style={{ fontSize: 13, color: C.mute }}>Plan vs actual · Delay detection · Forecast · Cost · Safety</span>
              <button className="au-btn au-solid" onClick={signUp}>Sign up</button>
            </div>
          </div>
        </section>

        {/* ---------- built-for strip ---------- */}
        <section className="au-wrap" style={{ paddingTop: 64 }}>
          <div className="au-label" style={{ textAlign: "center", marginBottom: 20 }}>Built for</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 34px", color: C.mute, fontSize: 15, fontWeight: 500 }}>
            {SECTORS.slice(0, 6).map(([n]) => <span key={n}>{n}</span>)}
          </div>
        </section>

        {/* ---------- two pillars ---------- */}
        <section className="au-wrap au-sec">
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 56px" }}>
            <h2>Two ways in, one source of truth</h2>
            <p className="au-lead" style={{ marginTop: 20 }}>What the site reports each day and what the schedule expects, kept side by side.</p>
          </div>
          <div className="au-grid2">
            {PILLARS.map(({ tint, icon: Icon, title, text }) => (
              <div key={title} className="au-card au-hov" style={{ padding: 32, minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "space-between", background: `linear-gradient(160deg, ${tint === "violet" ? C.violet + "33" : C.green + "33"}, ${C.card} 70%)` }}>
                <Icon size={22} />
                <div><h3>{title}</h3><p style={{ color: C.mute, marginTop: 10, lineHeight: 1.55 }}>{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- dark showcase ---------- */}
        <section className="au-wrap" style={{ paddingTop: 24 }}>
          <div style={{ background: "#2E3033", borderRadius: 28, padding: "clamp(24px,4vw,56px)", color: "#F4F0EF", display: "grid", placeItems: "center", minHeight: 420, border: "1px solid #444" }}>
            <div style={{ width: "min(720px,100%)", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 24, padding: 28, backdropFilter: "blur(14px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span className="au-label" style={{ color: "#C8C6C5" }}>Progress curve · sample data</span>
                <span className="au-chip" style={{ background: "rgba(111,211,160,.18)", color: "#9BE6BE" }}><i style={{ background: C.green }} />Forecast: later than plan</span>
              </div>
              <svg viewBox="0 0 640 220" width="100%" role="img" aria-label="Sample planned versus actual progress curve">
                {[40, 90, 140, 190].map((y) => <line key={y} x1="0" x2="640" y1={y} y2={y} stroke="rgba(255,255,255,.1)" />)}
                <path d="M0 200 C120 190 200 150 320 105 S520 30 640 18" fill="none" stroke="#C8C6C5" strokeWidth="2.5" strokeDasharray="6 6" />
                <path d="M0 200 C120 196 200 165 320 125 S440 85 470 78" fill="none" stroke={C.coral} strokeWidth="3.5" strokeLinecap="round" />
                <path d="M470 78 C520 66 580 54 640 44" fill="none" stroke={C.blue} strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
                <circle cx="470" cy="78" r="6" fill={C.coral} />
              </svg>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 10, fontSize: 12.5, color: "#C8C6C5" }}>
                <span>— — Planned</span><span style={{ color: C.coral }}>━ Actual</span><span style={{ color: C.blue }}>· · · Projected</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- features ---------- */}
        <section id="features" className="au-wrap au-sec">
          <div className="au-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end", marginBottom: 48 }}>
            <div><Chip dot={C.coral}>InfraTrack workspace</Chip><h2 style={{ marginTop: 18 }}>Everything a site needs, in one workspace</h2></div>
            <p className="au-lead">From the first daily report to the final handover pack: quantities, cost, safety and forecasts, all linked to the same plan.</p>
          </div>
          <div className="au-grid3">
            {FEATURES.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="au-card au-hov" style={{ padding: 28, minHeight: 230 }}>
                <span className="au-glow" style={{ background: [C.coral, C.blue, C.green][i % 3] }} />
                <div style={{ width: 40, height: 40, borderRadius: 12, background: C.panel, display: "grid", placeItems: "center", marginBottom: 40 }}><Icon size={19} /></div>
                <h3 style={{ fontSize: 19 }}>{title}</h3>
                <p style={{ color: C.mute, marginTop: 8, lineHeight: 1.55, fontSize: 14.5 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- sectors ---------- */}
        <section id="sectors" className="au-wrap au-sec">
          <div className="au-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end", marginBottom: 40 }}>
            <div><Chip dot={C.blue}>Sectors</Chip><h2 style={{ marginTop: 18 }}>One method, every kind of build</h2></div>
            <p className="au-lead">Roads, rail, metro, bridges and utilities all use the same plan vs actual routine, so teams learn it once.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 12 }}>
            {SECTORS.map(([n, Icon]) => (
              <div key={n} style={{ background: C.panel, borderRadius: 18, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14, fontWeight: 500 }}>
                <Icon size={18} color={C.mute} />{n}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- roles ---------- */}
        <section id="roles" className="au-wrap au-sec">
          <div style={{ marginBottom: 40 }}><Chip dot={C.green}>Roles</Chip><h2 style={{ marginTop: 18 }}>Everyone on the project, one sign-in</h2></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16 }}>
            {ROLES.map(({ id, label, icon: Icon, blurb }) => (
              <button key={id} onClick={() => onLogin(id, "login")} className="au-card au-hov" style={{ padding: 24, textAlign: "left", cursor: "pointer", font: "inherit", color: "inherit" }}>
                <Icon size={20} />
                <div style={{ fontWeight: 600, marginTop: 28, fontSize: 16 }}>{label}</div>
                <div style={{ color: C.mute, fontSize: 13.5, marginTop: 4 }}>{blurb}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ---------- faq ---------- */}
        <section id="faq" className="au-wrap au-sec">
          <div className="au-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 48 }}>
            <div><Chip dot={C.violet}>FAQ</Chip><h2 style={{ marginTop: 18 }}>Questions, answered</h2></div>
            <div>
              {FAQ.map(([q, a], i) => (
                <div key={q} style={{ borderTop: `1px solid ${C.line}`, borderBottom: i === FAQ.length - 1 ? `1px solid ${C.line}` : 0 }}>
                  <button onClick={() => setFaq(faq === i ? -1 : i)} aria-expanded={faq === i} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, background: "none", border: 0, padding: "22px 0", font: "inherit", fontSize: 17, fontWeight: 500, textAlign: "left", cursor: "pointer", color: C.ink }}>
                    {q}{faq === i ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  {faq === i && <p style={{ color: C.mute, lineHeight: 1.65, paddingBottom: 22, maxWidth: 640 }}>{a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="au-wrap au-sec" style={{ textAlign: "center" }}>
          <h2 style={{ maxWidth: 760, margin: "0 auto" }}>Ready to connect your plan to what is happening on site?</h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <button className="au-btn au-solid" onClick={signUp}>Get started <ArrowRight size={15} /></button>
            <button className="au-btn au-ghost" onClick={signIn}>Sign in</button>
          </div>
        </section>

        {/* ---------- contact ---------- */}
        <section id="contact" className="au-wrap au-sec">
          <div className="au-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div><Chip dot={C.coral}>Contact</Chip><h2 style={{ marginTop: 18 }}>Talk to us</h2><p className="au-lead" style={{ marginTop: 18 }}>Questions about your project setup or a feature you need? Send a note and we will reply.</p></div>
            <Contact />
          </div>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="au-wrap" style={{ marginTop: "clamp(80px,10vw,140px)", padding: "28px 32px 40px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, fontSize: 13, color: C.mute }}>
        <span style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo size={22} /><span>© {new Date().getFullYear()} InfraTrack{updated ? ` · Updated ${updated}` : ""}</span></span>
        <span style={{ display: "flex", gap: 22 }}><a href="/privacy">Privacy</a><a href="/terms">Terms</a></span>
      </footer>
    </div>
  );
}
