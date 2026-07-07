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
const logoLockup = "data:image/png;base64,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";
const logoMark = "data:image/png;base64,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";

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
