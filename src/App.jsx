import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Wrench,
  Trophy,
  CheckCircle2,
  Flag,
  RotateCcw,
  Gauge,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  Award,
  Warehouse,
} from "lucide-react";
import logoLockup from "./assets/logo-lockup.png";
import logoMark from "./assets/logo-mark.png";

/* =========================================================
   GAME: Pitstoppet
   ========================================================= */
const WHEELS = [
  { id: "fl", label: "FRAM VÄNSTER", left: "25%", top: "23%" },
  { id: "fr", label: "FRAM HÖGER", left: "75%", top: "23%" },
  { id: "rl", label: "BAK VÄNSTER", left: "25%", top: "77%" },
  { id: "rr", label: "BAK HÖGER", left: "75%", top: "77%" },
];
const NUTS_PER_PHASE = 5;
const TOTAL_NUT_EVENTS = WHEELS.length * 2 * NUTS_PER_PHASE;
const SWAP_MS = 650;

function fmt(ms) {
  const cs = Math.max(0, Math.floor(ms / 10));
  const m = Math.floor(cs / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
}

function TorqueMeter({ progressCount, onResult, active, label }) {
  const [pos, setPos] = useState(0);
  const [zone, setZone] = useState({ start: 40, width: 20 });
  const [flash, setFlash] = useState(null);
  const rafRef = useRef(null);
  const startRef = useRef(performance.now());

  const frac = Math.min(1, progressCount / TOTAL_NUT_EVENTS);
  const period = 1500 - frac * 620;
  const zoneWidth = 24 - frac * 13;

  const newZone = useCallback(() => {
    const w = zoneWidth;
    const start = 6 + Math.random() * (94 - w - 6);
    setZone({ start, width: w });
  }, [zoneWidth]);

  useEffect(() => {
    newZone();
    startRef.current = performance.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active) return;
    function tick(now) {
      const t = (now - startRef.current) % period;
      const half = period / 2;
      const p = t < half ? (t / half) * 100 : (1 - (t - half) / half) * 100;
      setPos(p);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, period]);

  function handleHit() {
    if (!active) return;
    const inZone = pos >= zone.start && pos <= zone.start + zone.width;
    if (inZone) {
      setFlash("hit");
      setTimeout(() => setFlash(null), 140);
      onResult(true);
    } else {
      setFlash("miss");
      setTimeout(() => setFlash(null), 220);
      onResult(false);
      newZone();
    }
  }

  useEffect(() => {
    function onKey(e) {
      if (e.code === "Space") {
        e.preventDefault();
        handleHit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <div
        style={{
          fontFamily: "'Titillium Web', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: 1,
          color: "#ffcc00",
          textAlign: "center",
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "relative",
          height: 34,
          borderRadius: 6,
          background: "#0d0f12",
          border: "2px solid #2a2f36",
          overflow: "hidden",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,.6)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${zone.start}%`,
            width: `${zone.width}%`,
            top: 0,
            bottom: 0,
            background: "linear-gradient(180deg,#3ddc84,#1fae63)",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pos}%`,
            top: -2,
            bottom: -2,
            width: 4,
            marginLeft: -2,
            background: flash === "hit" ? "#fff" : flash === "miss" ? "#ff5a1f" : "#ffcc00",
            boxShadow: "0 0 8px rgba(255,204,0,.9)",
            transition: "background 60ms",
          }}
        />
      </div>
      <button
        onClick={handleHit}
        style={{
          marginTop: 10,
          width: "100%",
          padding: "10px 0",
          fontFamily: "'Titillium Web', sans-serif",
          fontSize: 18,
          letterSpacing: 2,
          fontWeight: 900,
          textTransform: "uppercase",
          color: "#0d0f12",
          background:
            flash === "hit"
              ? "#3ddc84"
              : flash === "miss"
              ? "#ff5a1f"
              : "linear-gradient(180deg,#ffd93d,#ffbf00)",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Dra åt (mellanslag)
      </button>
    </div>
  );
}

function CarDiagram({ activeIdx, wheelStatus, onWheelClick, phase }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 320, aspectRatio: "400/220", margin: "0 auto" }}>
      <svg viewBox="0 0 400 220" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id="body2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22262c" />
            <stop offset="100%" stopColor="#101215" />
          </linearGradient>
        </defs>
        <rect x="60" y="30" width="280" height="160" rx="34" fill="url(#body2)" stroke="#3a3f47" strokeWidth="2" />
        <rect x="150" y="46" width="100" height="46" rx="10" fill="#0a0c0e" stroke="#3a3f47" strokeWidth="1.5" />
        <rect x="76" y="104" width="248" height="12" fill="#ffcc00" opacity="0.9" />
        <rect x="76" y="104" width="248" height="4" fill="#1c3f7c" />
      </svg>
      {WHEELS.map((w, i) => {
        const status = wheelStatus[i];
        const isActive = i === activeIdx;
        return (
          <button
            key={w.id}
            onClick={() => onWheelClick(i)}
            disabled={status !== "active" || phase !== "idle"}
            style={{
              position: "absolute",
              left: w.left,
              top: w.top,
              transform: "translate(-50%,-50%)",
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: `3px solid ${status === "done" ? "#3ddc84" : isActive ? "#ffcc00" : "#3a3f47"}`,
              background: "#0d0f12",
              color: status === "done" ? "#3ddc84" : isActive ? "#ffcc00" : "#5a606a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: status === "active" && phase === "idle" ? "pointer" : "default",
              boxShadow: isActive ? "0 0 16px rgba(255,204,0,.7)" : "none",
              animation: isActive && phase === "idle" ? "pulse 1.1s infinite" : "none",
            }}
            title={w.label}
          >
            {status === "done" ? <CheckCircle2 size={24} /> : <Wrench size={20} />}
          </button>
        );
      })}
    </div>
  );
}

function PitstoppetGame() {
  const [screen, setScreen] = useState("start");
  const [wheelIdx, setWheelIdx] = useState(0);
  const [wheelStatus, setWheelStatus] = useState(["active", "pending", "pending", "pending"]);
  const [phase, setPhase] = useState("idle");
  const [nutCount, setNutCount] = useState(0);
  const [eventsCompleted, setEventsCompleted] = useState(0);
  const [penaltyMs, setPenaltyMs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const [name, setName] = useState("");
  const [board, setBoard] = useState([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const startRef = useRef(null);
  const tickRef = useRef(null);

  useEffect(() => {
    if (screen !== "playing") return;
    tickRef.current = setInterval(() => setElapsed(performance.now() - startRef.current), 40);
    return () => clearInterval(tickRef.current);
  }, [screen]);

  function startGame() {
    setWheelIdx(0);
    setWheelStatus(["active", "pending", "pending", "pending"]);
    setPhase("idle");
    setNutCount(0);
    setEventsCompleted(0);
    setPenaltyMs(0);
    setElapsed(0);
    setFinalTime(null);
    startRef.current = performance.now();
    setScreen("playing");
  }

  function handleWheelClick(i) {
    if (wheelStatus[i] !== "active" || phase !== "idle") return;
    setPhase("remove");
    setNutCount(0);
  }

  function handleNutResult(hit) {
    if (hit) {
      const next = nutCount + 1;
      setEventsCompleted((c) => c + 1);
      if (next >= NUTS_PER_PHASE) {
        if (phase === "remove") {
          setPhase("swap");
          setTimeout(() => {
            setPhase("install");
            setNutCount(0);
          }, SWAP_MS);
        } else if (phase === "install") {
          const newStatus = [...wheelStatus];
          newStatus[wheelIdx] = "done";
          const nextIdx = wheelIdx + 1;
          if (nextIdx >= WHEELS.length) {
            setWheelStatus(newStatus);
            setPhase("doneAll");
            const total = performance.now() - startRef.current + penaltyMs;
            setFinalTime(total);
            clearInterval(tickRef.current);
            setTimeout(() => setScreen("nameEntry"), 500);
          } else {
            newStatus[nextIdx] = "active";
            setWheelStatus(newStatus);
            setWheelIdx(nextIdx);
            setPhase("idle");
          }
        }
      } else {
        setNutCount(next);
      }
    } else {
      setPenaltyMs((p) => p + 320);
    }
  }

  const LB_KEY = "pitstoppet_leaderboard";

  async function submitScore() {
    const finalName = name.trim() || "Anonym";
    try {
      const raw = localStorage.getItem(LB_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push({ name: finalName, timeMs: Math.round(finalTime) });
      localStorage.setItem(LB_KEY, JSON.stringify(list));
    } catch (e) {
      /* ignore storage errors */
    }
    loadBoard();
  }

  async function loadBoard() {
    setBoardLoading(true);
    setScreen("leaderboard");
    try {
      const raw = localStorage.getItem(LB_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setBoard(list.sort((a, b) => a.timeMs - b.timeMs).slice(0, 10));
    } catch (e) {
      setBoard([]);
    }
    setBoardLoading(false);
  }

  const displayMs = screen === "playing" ? elapsed + penaltyMs : finalTime || 0;

  const btnStyle = {
    fontFamily: "'Titillium Web', sans-serif",
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 900,
    textTransform: "uppercase",
    color: "#0d0f12",
    background: "linear-gradient(180deg,#ffd93d,#ffbf00)",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    padding: "12px 0",
    width: "100%",
  };

  return (
    <div
      style={{
        background: "radial-gradient(900px 500px at 50% -20%, #1b2230 0%, #0b0d10 60%, #08090b 100%)",
        borderRadius: 16,
        border: "1px solid #22262c",
        padding: "22px 18px 26px",
        maxWidth: 460,
        margin: "0 auto",
        color: "#e8e9eb",
      }}
    >
      {screen === "start" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#b7bcc4", lineHeight: 1.5, fontSize: 14, margin: "0 0 12px" }}>
            Klicka på hjulet som lyser, lossa fem muttrar, vänta på nytt däck och
            dra åt fem till. Träffa gröna zonen — missar kostar tid.
          </p>
          <CarDiagram activeIdx={-1} wheelStatus={["pending", "pending", "pending", "pending"]} onWheelClick={() => {}} phase="preview" />
          <button onClick={startGame} style={{ ...btnStyle, marginTop: 16 }}>
            <Flag size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />
            Starta
          </button>
          <button
            onClick={loadBoard}
            style={{ marginTop: 10, background: "none", border: "none", color: "#7ab0ff", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
          >
            Visa topplistan
          </button>
        </div>
      )}

      {screen === "playing" && (
        <div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 8, fontFamily: "'Titillium Web', monospace" }}>
            <Gauge size={20} color="#ffcc00" />
            <div style={{ fontSize: 36, fontWeight: 900 }}>{fmt(displayMs)}</div>
          </div>
          <div style={{ textAlign: "center", color: "#8a919c", fontSize: 12, marginBottom: 6 }}>
            Hjul {wheelIdx + 1} av 4 — {WHEELS[wheelIdx].label}
            {penaltyMs > 0 && <span style={{ color: "#ff5a1f" }}> · +{(penaltyMs / 1000).toFixed(2)}s straff</span>}
          </div>
          <CarDiagram activeIdx={wheelIdx} wheelStatus={wheelStatus} onWheelClick={handleWheelClick} phase={phase} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            {phase === "idle" && (
              <div style={{ color: "#ffcc00", fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 16, textTransform: "uppercase" }}>
                Klicka på det gula hjulet →
              </div>
            )}
            {phase === "remove" && (
              <TorqueMeter active progressCount={eventsCompleted} onResult={handleNutResult} label={`Lossa mutter ${nutCount + 1}/${NUTS_PER_PHASE}`} />
            )}
            {phase === "swap" && (
              <div style={{ color: "#3ddc84", fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 18, textTransform: "uppercase" }}>
                <RotateCcw size={18} style={{ verticalAlign: "-3px", marginRight: 6 }} />
                Monterar nytt däck…
              </div>
            )}
            {phase === "install" && (
              <TorqueMeter active progressCount={eventsCompleted} onResult={handleNutResult} label={`Dra åt mutter ${nutCount + 1}/${NUTS_PER_PHASE}`} />
            )}
          </div>
        </div>
      )}

      {screen === "nameEntry" && (
        <div style={{ textAlign: "center" }}>
          <Trophy size={34} color="#ffcc00" />
          <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 900, fontSize: 20, margin: "4px 0", textTransform: "uppercase" }}>
            Alla fyra klara!
          </div>
          <div style={{ fontFamily: "'Titillium Web', monospace", fontWeight: 900, fontSize: 42, color: "#ffcc00" }}>{fmt(finalTime)}</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={18}
            placeholder="Ditt namn"
            style={{
              marginTop: 10,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "2px solid #2a2f36",
              background: "#0d0f12",
              color: "#e8e9eb",
              fontSize: 15,
              boxSizing: "border-box",
            }}
          />
          <button onClick={submitScore} style={{ ...btnStyle, marginTop: 10 }}>
            Skicka till topplistan
          </button>
        </div>
      )}

      {screen === "leaderboard" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Trophy size={20} color="#ffcc00" />
            <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 900, fontSize: 20, textTransform: "uppercase" }}>Topplista</div>
          </div>
          {boardLoading ? (
            <div style={{ textAlign: "center", color: "#8a919c", marginTop: 16 }}>Laddar…</div>
          ) : board.length === 0 ? (
            <div style={{ textAlign: "center", color: "#8a919c", marginTop: 16, fontSize: 14 }}>Ingen har tävlat än — bli först!</div>
          ) : (
            <div style={{ marginTop: 10 }}>
              {board.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    marginBottom: 5,
                    borderRadius: 6,
                    background: i === 0 ? "#2a2410" : "#15171a",
                    border: i === 0 ? "1px solid #ffcc00" : "1px solid #24272c",
                  }}
                >
                  <span style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 15 }}>#{i + 1} {b.name}</span>
                  <span style={{ fontFamily: "'Titillium Web', monospace", fontWeight: 900, fontSize: 15, color: "#ffcc00" }}>{fmt(b.timeMs)}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={startGame} style={{ ...btnStyle, marginTop: 14 }}>
            Kör igen
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   RACING UI BITS
   ========================================================= */
function CheckeredDivider() {
  return (
    <div
      style={{
        height: 10,
        backgroundImage:
          "repeating-conic-gradient(#e8e9eb 0% 25%, #101215 0% 50%)",
        backgroundSize: "16px 16px",
        opacity: 0.9,
      }}
    />
  );
}

function StartLights() {
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setLit((l) => (l >= 5 ? 0 : l + 1));
    }, 550);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 18 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: i < lit ? "#ff2b2b" : "#3a1010",
            boxShadow: i < lit ? "0 0 10px rgba(255,43,43,.9)" : "none",
            border: "1px solid #1c1f24",
            transition: "background .15s, box-shadow .15s",
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   SITE CONTENT
   ========================================================= */
const NAV_LINKS = ["Hem", "Om oss", "Tjänster", "Tävling", "Våra stationer", "Kontakt"];

const SERVICES = [
  { n: "01", title: "Däckskifte", text: "Vi hjälper dig få på rätt däck inför kommande säsong.", icon: <Wrench size={20} /> },
  { n: "02", title: "Däckhotell", text: "Slipp ha däcken liggandes och skräpa hemma – vi sköter förvaringen.", icon: <Warehouse size={20} /> },
  { n: "03", title: "Hjulinställning", text: "Har bilen börjat dra åt något håll? Dags för en hjulinställning.", icon: <Gauge size={20} /> },
  { n: "04", title: "Däckbalansering", text: "Vibrerar ratten? Då är det läge att balansera däcken.", icon: <RotateCcw size={20} /> },
  { n: "05", title: "Företag & lastbilar", text: "Bli företagskund och få hjälp med reparation eller byte av däck.", icon: <Users size={20} /> },
  { n: "06", title: "Massiva däck", text: "Professionellt byte av massiva däck och truckdäck.", icon: <ShieldCheck size={20} /> },
];

const STATIONS = [
  { city: "UMEÅ", address: "Kabelvägen 6", phone: "090-77 24 24", hours: "07:00–16:30" },
  { city: "NORDMALING", address: "Rödviksvägen 90", phone: "0930-311 25", hours: "07:00–16:00" },
  { city: "VINDELN", address: "Lidvägen 13", phone: "0933-106 60", hours: "07:00–16:00" },
];

const WHY = [
  { title: "Rätt utrustning", text: "Modern och säker utrustning för ett jobb utfört med precision.", icon: <ShieldCheck size={20} /> },
  { title: "Bra kundbemötande", text: "Vi hjälper dig genom hela bilresan, från första frågan till klart byte.", icon: <Users size={20} /> },
  { title: "Lång erfarenhet", text: "Vi har hållt på länge och vet exakt vad som gör skillnad.", icon: <Award size={20} /> },
  { title: "Nöjda kunder", text: "Många återkommande kunder som vet att jobbet blir rätt.", icon: <Trophy size={20} /> },
];

function Section({ id, children, style }) {
  return (
    <section id={id} style={{ padding: "70px 20px", ...style }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Titillium Web', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: 3,
        color: "#ffcc00",
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 18, height: 3, background: "#ffcc00", display: "inline-block" }} />
      {children}
    </div>
  );
}

const H1 = { fontFamily: "'Titillium Web', sans-serif", fontWeight: 900, fontStyle: "italic" };
const H2 = { fontFamily: "'Titillium Web', sans-serif", fontWeight: 800, textTransform: "uppercase" };

export default function App() {
  return (
    <div style={{ background: "#0b0d10", color: "#e8e9eb", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,600;0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{ box-shadow:0 0 10px rgba(255,204,0,.6);} 50%{ box-shadow:0 0 22px rgba(255,204,0,1);} }
        a { color: inherit; }
        .navlink { position:relative; cursor:pointer; font-family:'Titillium Web',sans-serif; font-weight:600; text-transform:uppercase; font-size:14px; letter-spacing:.5px; }
        .navlink:hover { color:#ffcc00; }
        .card:hover { transform: translateY(-3px); border-color:#3a3f47 !important; }
        .card { transition: transform .15s ease, border-color .15s ease; }
        .speedlines { background: repeating-linear-gradient(100deg, rgba(255,204,0,0.06) 0 2px, transparent 2px 40px); }
      `}</style>

      {/* preview ribbon */}
      <div
        style={{
          background: "#ffcc00",
          color: "#0d0f12",
          textAlign: "center",
          fontFamily: "'Titillium Web', sans-serif",
          fontWeight: 700,
          letterSpacing: 1.5,
          fontSize: 13,
          padding: "6px 10px",
          textTransform: "uppercase",
        }}
      >
        Förhandsvisning — det här är ett designförslag, inte den live-sidan
      </div>
      <CheckeredDivider />

      {/* NAVBAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(11,13,16,0.94)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid #1c1f24",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logoLockup} alt="Nymans Däck Team" style={{ height: 34, width: "auto", filter: "drop-shadow(0 0 6px rgba(0,0,0,.4))" }} />

          <nav style={{ display: "flex", gap: 26 }} className="desktop-nav">
            {NAV_LINKS.map((l) => (
              <span key={l} className="navlink">{l}</span>
            ))}
          </nav>

          <button
            style={{
              fontFamily: "'Titillium Web', sans-serif",
              fontSize: 15,
              letterSpacing: 1,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#0d0f12",
              background: "linear-gradient(180deg,#ffd93d,#ffbf00)",
              border: "none",
              borderRadius: 6,
              padding: "9px 18px",
              cursor: "pointer",
            }}
          >
            Boka däckskifte
          </button>
        </div>
      </header>

      {/* HERO */}
      <div className="speedlines">
        <Section style={{ paddingTop: 64, paddingBottom: 50 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 40, alignItems: "center" }}>
            <div>
              <Eyebrow>Umeå · Nordmaling · Vindeln</Eyebrow>
              <h1 style={{ ...H1, fontSize: 56, lineHeight: 1.0, margin: "0 0 14px", transform: "skewX(-2deg)" }}>
                Ditt depåstopp för <span style={{ color: "#ffcc00" }}>däckservice</span> &amp; däckbyte
              </h1>
              <p style={{ color: "#b7bcc4", fontSize: 17, lineHeight: 1.6, maxWidth: 480, fontStyle: "normal" }}>
                Vi kan däck och däckbyte. Hos oss får du professionell service och
                kvalitetsdäck, utförda av utbildade och erfarna däckspecialister —
                på tre verkstäder i Umeå, Vindeln och Nordmaling.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap", alignItems: "center" }}>
                <button
                  style={{
                    fontFamily: "'Titillium Web', sans-serif",
                    fontSize: 17,
                    letterSpacing: 1,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#0d0f12",
                    background: "linear-gradient(180deg,#ffd93d,#ffbf00)",
                    border: "none",
                    borderRadius: 8,
                    padding: "13px 26px",
                    cursor: "pointer",
                  }}
                >
                  Boka tid
                </button>
                <button
                  style={{
                    fontFamily: "'Titillium Web', sans-serif",
                    fontSize: 17,
                    letterSpacing: 1,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#e8e9eb",
                    background: "transparent",
                    border: "2px solid #2a2f36",
                    borderRadius: 8,
                    padding: "11px 26px",
                    cursor: "pointer",
                  }}
                >
                  Spela Pitstoppet 🏁
                </button>
              </div>
              <StartLights />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={logoMark}
                alt="N1 Nymans"
                style={{ width: "72%", maxWidth: 280, filter: "drop-shadow(0 20px 34px rgba(0,0,0,.6))" }}
              />
            </div>
          </div>
        </Section>
      </div>
      <CheckeredDivider />

      {/* SERVICES */}
      <Section style={{ background: "#101215", borderBottom: "1px solid #1c1f24" }} id="tjanster">
        <Eyebrow>Mer än bara däckskifte</Eyebrow>
        <h2 style={{ ...H2, fontSize: 32, margin: "0 0 26px" }}>Våra tjänster</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
          {SERVICES.map((s) => (
            <div key={s.title} className="card" style={{ position: "relative", background: "#15171a", border: "1px solid #22262c", borderRadius: 12, padding: "20px 20px 20px 20px" }}>
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  fontFamily: "'Titillium Web', monospace",
                  fontWeight: 900,
                  fontSize: 22,
                  color: "#22262c",
                }}
              >
                {s.n}
              </div>
              <div style={{ color: "#ffcc00", marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 19, marginBottom: 4, textTransform: "uppercase" }}>{s.title}</div>
              <div style={{ color: "#8a919c", fontSize: 14, lineHeight: 1.5 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* COMPETITION / GAME */}
      <Section id="tavling" style={{ background: "radial-gradient(800px 400px at 50% 0%, #14181f 0%, #0b0d10 60%)" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Eyebrow>Sommartävling</Eyebrow>
          <h2 style={{ ...H1, fontSize: 38, margin: "0 0 10px", transform: "skewX(-2deg)" }}>
            Klarar du fyra hjul snabbare än våra egna mekaniker?
          </h2>
          <p style={{ color: "#b7bcc4", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            Spela <strong style={{ color: "#ffcc00" }}>Pitstoppet</strong> nedan, klättra på topplistan och
            var med och tävla om <em>[fyller i pris här, t.ex. ett gratis säsongsskifte eller
            presentkort]</em> — vi återkommer med exakta tävlingsvillkor innan lansering.
          </p>
        </div>
        <PitstoppetGame />
      </Section>

      <CheckeredDivider />

      {/* WHY */}
      <Section style={{ background: "#101215", borderBottom: "1px solid #1c1f24" }}>
        <Eyebrow>Varför Nymans?</Eyebrow>
        <h2 style={{ ...H2, fontSize: 32, margin: "0 0 26px" }}>Lång erfarenhet, nöjda kunder</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {WHY.map((w) => (
            <div key={w.title} style={{ padding: 4 }}>
              <div style={{ color: "#ffcc00", marginBottom: 8 }}>{w.icon}</div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 4, textTransform: "uppercase" }}>{w.title}</div>
              <div style={{ color: "#8a919c", fontSize: 14, lineHeight: 1.5 }}>{w.text}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* STATIONS */}
      <Section id="stationer">
        <Eyebrow>Våra stationer</Eyebrow>
        <h2 style={{ ...H2, fontSize: 32, margin: "0 0 26px" }}>Tre verkstäder, samma kvalitet</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
          {STATIONS.map((s) => (
            <div key={s.city} className="card" style={{ background: "#15171a", border: "1px solid #22262c", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 900, fontSize: 22, color: "#ffcc00", marginBottom: 10 }}>{s.city}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, color: "#c7ccd3", fontSize: 14 }}>
                <MapPin size={16} style={{ marginTop: 2, flexShrink: 0 }} /> {s.address}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, color: "#c7ccd3", fontSize: 14 }}>
                <Phone size={16} style={{ marginTop: 2, flexShrink: 0 }} /> {s.phone}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "#c7ccd3", fontSize: 14 }}>
                <Clock size={16} style={{ marginTop: 2, flexShrink: 0 }} /> Mån–Fre {s.hours}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CheckeredDivider />

      {/* FOOTER */}
      <footer style={{ padding: "36px 20px", background: "#0e1013" }} id="kontakt">
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <img src={logoLockup} alt="Nymans Däck Team" style={{ height: 30, marginBottom: 20 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24 }}>
            <div>
              <div style={{ color: "#8a919c", fontSize: 13, lineHeight: 1.6 }}>Ditt depåstopp för däckservice &amp; däckskifte.</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#ffcc00", textTransform: "uppercase" }}>Kontakt</div>
              {STATIONS.map((s) => (
                <div key={s.city} style={{ color: "#8a919c", fontSize: 13, marginBottom: 4 }}>{s.city}: {s.phone}</div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#ffcc00", textTransform: "uppercase" }}>Tjänster</div>
              {["Däckservice", "Däckhotell", "Hjulinställning", "Företag", "Delbetala"].map((t) => (
                <div key={t} style={{ color: "#8a919c", fontSize: 13, marginBottom: 4 }}>{t}</div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#ffcc00", textTransform: "uppercase" }}>Öppettider</div>
              <div style={{ color: "#8a919c", fontSize: 13 }}>Måndag–Fredag, telefontid 07:00–16:00</div>
            </div>
          </div>
          <div style={{ textAlign: "center", color: "#5a606a", fontSize: 12, marginTop: 26 }}>
            Copyright © 2026 Nymans Däck — designförslag/mockup, ej publicerad sida
          </div>
        </div>
      </footer>
    </div>
  );
}
