import React, { useState, useRef, useEffect, useCallback } from "react";
import { Wrench, Trophy, CheckCircle2, Flag, RotateCcw, Gauge } from "lucide-react";

/* ---------- constants ---------- */
const WHEELS = [
  { id: "fl", label: "FRAM VÄNSTER", left: "25%", top: "23%" },
  { id: "fr", label: "FRAM HÖGER", left: "75%", top: "23%" },
  { id: "rl", label: "BAK VÄNSTER", left: "25%", top: "77%" },
  { id: "rr", label: "BAK HÖGER", left: "75%", top: "77%" },
];
const NUTS_PER_PHASE = 5;
const TOTAL_NUT_EVENTS = WHEELS.length * 2 * NUTS_PER_PHASE; // 40
const SWAP_MS = 650;

function fmt(ms) {
  const cs = Math.max(0, Math.floor(ms / 10));
  const m = Math.floor(cs / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
}

/* ---------- Torque meter minigame ---------- */
function TorqueMeter({ progressCount, onResult, active, label }) {
  const [pos, setPos] = useState(0);
  const [zone, setZone] = useState({ start: 40, width: 20 });
  const [flash, setFlash] = useState(null); // 'hit' | 'miss'
  const rafRef = useRef(null);
  const startRef = useRef(performance.now());

  const frac = Math.min(1, progressCount / TOTAL_NUT_EVENTS);
  const period = 1500 - frac * 620; // ms, faster over time
  const zoneWidth = 24 - frac * 13; // narrower over time

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
          fontFamily: "'Teko', sans-serif",
          fontSize: 22,
          letterSpacing: 1,
          color: "#ffcc00",
          textAlign: "center",
          marginBottom: 6,
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
          fontFamily: "'Teko', sans-serif",
          fontSize: 24,
          letterSpacing: 2,
          fontWeight: 600,
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
        DRA ÅT (mellanslag)
      </button>
    </div>
  );
}

/* ---------- Car diagram ---------- */
function CarDiagram({ activeIdx, wheelStatus, onWheelClick, phase }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, aspectRatio: "400/220", margin: "0 auto" }}>
      <svg viewBox="0 0 400 220" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22262c" />
            <stop offset="100%" stopColor="#101215" />
          </linearGradient>
        </defs>
        <rect x="60" y="30" width="280" height="160" rx="34" fill="url(#body)" stroke="#3a3f47" strokeWidth="2" />
        <rect x="150" y="46" width="100" height="46" rx="10" fill="#0a0c0e" stroke="#3a3f47" strokeWidth="1.5" />
        <rect x="76" y="104" width="248" height="12" fill="#ffcc00" opacity="0.9" />
        <rect x="76" y="104" width="248" height="4" fill="#1c3f7c" />
        <text x="200" y="205" textAnchor="middle" fontFamily="Teko, sans-serif" fontSize="15" fill="#5a606a" letterSpacing="3">
          NYMANS · DÄCK TEAM
        </text>
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
              width: 54,
              height: 54,
              borderRadius: "50%",
              border: `3px solid ${
                status === "done" ? "#3ddc84" : isActive ? "#ffcc00" : "#3a3f47"
              }`,
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
            {status === "done" ? <CheckCircle2 size={26} /> : <Wrench size={22} />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Main App ---------- */
export default function TireChangeGame() {
  const [screen, setScreen] = useState("start"); // start | playing | nameEntry | leaderboard
  const [wheelIdx, setWheelIdx] = useState(0);
  const [wheelStatus, setWheelStatus] = useState(["active", "pending", "pending", "pending"]);
  const [phase, setPhase] = useState("idle"); // idle | remove | swap | install | doneAll
  const [nutCount, setNutCount] = useState(0); // within current phase, 0..5
  const [eventsCompleted, setEventsCompleted] = useState(0); // global difficulty driver
  const [penaltyMs, setPenaltyMs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const [name, setName] = useState("");
  const [board, setBoard] = useState([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const startRef = useRef(null);
  const tickRef = useRef(null);

  useEffect(() => {
    if (screen !== "playing") return;
    tickRef.current = setInterval(() => {
      setElapsed(performance.now() - startRef.current);
    }, 40);
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

  async function submitScore() {
    const finalName = name.trim() || "Anonym";
    const key = `score:${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      await window.storage.set(key, JSON.stringify({ name: finalName, timeMs: Math.round(finalTime) }), true);
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
    loadBoard();
  }

  async function loadBoard() {
    setBoardLoading(true);
    setScreen("leaderboard");
    try {
      const listRes = await window.storage.list("score:", true);
      const keys = listRes?.keys || [];
      const entries = await Promise.all(
        keys.map(async (k) => {
          try {
            const r = await window.storage.get(k, true);
            return r ? JSON.parse(r.value) : null;
          } catch {
            return null;
          }
        })
      );
      const clean = entries.filter(Boolean).sort((a, b) => a.timeMs - b.timeMs).slice(0, 10);
      setBoard(clean);
    } catch (e) {
      setBoard([]);
    }
    setBoardLoading(false);
  }

  const displayMs = screen === "playing" ? elapsed + penaltyMs : finalTime || 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(1200px 600px at 50% -10%, #1b2230 0%, #0b0d10 55%, #08090b 100%)",
        color: "#e8e9eb",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 14px 40px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{ box-shadow:0 0 10px rgba(255,204,0,.6);} 50%{ box-shadow:0 0 22px rgba(255,204,0,1);} }
        .hazard { background-image: repeating-linear-gradient(45deg,#ffcc00 0 14px,#101215 14px 28px); }
        button:disabled { cursor: default; }
      `}</style>

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 26, height: 8 }} className="hazard" />
        <div
          style={{
            fontFamily: "'Teko', sans-serif",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          <span style={{ color: "#e8e9eb" }}>NYMANS </span>
          <span style={{ color: "#1c3f7c", background: "#ffcc00", padding: "0 6px" }}>DÄCK TEAM</span>
        </div>
        <div style={{ width: 26, height: 8 }} className="hazard" />
      </div>
      <div style={{ fontFamily: "'Teko', sans-serif", fontSize: 44, fontWeight: 700, letterSpacing: 1, color: "#ffcc00", textShadow: "0 2px 12px rgba(0,0,0,.5)" }}>
        PITSTOPPET
      </div>

      {screen === "start" && (
        <div style={{ textAlign: "center", maxWidth: 440, marginTop: 10 }}>
          <p style={{ color: "#b7bcc4", lineHeight: 1.5 }}>
            Byt fyra däck så snabbt du kan. Klicka på hjulet som lyser, lossa
            fem muttrar, vänta på nytt däck, dra åt fem muttrar igen — träffa
            gröna zonen i mätaren för varje mutter. Missar kostar tid.
          </p>
          <CarDiagram activeIdx={-1} wheelStatus={["pending","pending","pending","pending"]} onWheelClick={() => {}} phase="preview" />
          <button
            onClick={startGame}
            style={{
              marginTop: 18,
              padding: "14px 34px",
              fontFamily: "'Teko', sans-serif",
              fontSize: 28,
              letterSpacing: 2,
              fontWeight: 600,
              color: "#0d0f12",
              background: "linear-gradient(180deg,#ffd93d,#ffbf00)",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 6px 0 #a17800",
            }}
          >
            <Flag size={20} style={{ verticalAlign: "-4px", marginRight: 8 }} />
            STARTA TÄVLINGEN
          </button>
          <div>
            <button
              onClick={loadBoard}
              style={{
                marginTop: 16,
                background: "none",
                border: "none",
                color: "#7ab0ff",
                cursor: "pointer",
                fontSize: 14,
                textDecoration: "underline",
              }}
            >
              Visa topplistan
            </button>
          </div>
        </div>
      )}

      {screen === "playing" && (
        <div style={{ width: "100%", maxWidth: 440, marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 10,
              fontFamily: "'Teko', sans-serif",
            }}
          >
            <Gauge size={22} color="#ffcc00" />
            <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: 1 }}>{fmt(displayMs)}</div>
          </div>
          <div style={{ textAlign: "center", color: "#8a919c", fontSize: 13, marginBottom: 6 }}>
            Hjul {wheelIdx + 1} av 4 — {WHEELS[wheelIdx].label}
            {penaltyMs > 0 && <span style={{ color: "#ff5a1f" }}> · +{(penaltyMs / 1000).toFixed(2)}s straff</span>}
          </div>

          <CarDiagram
            activeIdx={wheelIdx}
            wheelStatus={wheelStatus}
            onWheelClick={handleWheelClick}
            phase={phase}
          />

          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            {phase === "idle" && (
              <div style={{ color: "#ffcc00", fontFamily: "'Teko', sans-serif", fontSize: 22, textAlign: "center" }}>
                Klicka på det gula hjulet →
              </div>
            )}
            {phase === "remove" && (
              <TorqueMeter
                active
                progressCount={eventsCompleted}
                onResult={handleNutResult}
                label={`LOSSA MUTTER ${nutCount + 1}/${NUTS_PER_PHASE}`}
              />
            )}
            {phase === "swap" && (
              <div style={{ color: "#3ddc84", fontFamily: "'Teko', sans-serif", fontSize: 24 }}>
                <RotateCcw size={22} style={{ verticalAlign: "-4px", marginRight: 8 }} />
                MONTERAR NYTT DÄCK…
              </div>
            )}
            {phase === "install" && (
              <TorqueMeter
                active
                progressCount={eventsCompleted}
                onResult={handleNutResult}
                label={`DRA ÅT MUTTER ${nutCount + 1}/${NUTS_PER_PHASE}`}
              />
            )}
          </div>
        </div>
      )}

      {screen === "nameEntry" && (
        <div style={{ textAlign: "center", marginTop: 20, maxWidth: 380 }}>
          <Trophy size={40} color="#ffcc00" />
          <div style={{ fontFamily: "'Teko', sans-serif", fontSize: 30, margin: "6px 0" }}>ALLA FYRA KLARA!</div>
          <div style={{ fontFamily: "'Teko', sans-serif", fontSize: 52, color: "#ffcc00" }}>{fmt(finalTime)}</div>
          <p style={{ color: "#8a919c", fontSize: 13, marginTop: 4 }}>
            Ditt namn och din tid visas på den delade topplistan för alla spelare.
          </p>
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
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={submitScore}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "12px 0",
              fontFamily: "'Teko', sans-serif",
              fontSize: 22,
              letterSpacing: 1,
              fontWeight: 600,
              color: "#0d0f12",
              background: "linear-gradient(180deg,#ffd93d,#ffbf00)",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            SKICKA TILL TOPPLISTAN
          </button>
        </div>
      )}

      {screen === "leaderboard" && (
        <div style={{ width: "100%", maxWidth: 400, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Trophy size={22} color="#ffcc00" />
            <div style={{ fontFamily: "'Teko', sans-serif", fontSize: 28 }}>TOPPLISTA</div>
          </div>
          {saveError && (
            <div style={{ color: "#ff5a1f", fontSize: 12, textAlign: "center", marginBottom: 8 }}>
              Kunde inte spara din tid just nu, men här är listan.
            </div>
          )}
          {boardLoading ? (
            <div style={{ textAlign: "center", color: "#8a919c", marginTop: 20 }}>Laddar…</div>
          ) : board.length === 0 ? (
            <div style={{ textAlign: "center", color: "#8a919c", marginTop: 20 }}>Ingen har tävlat än — bli först!</div>
          ) : (
            <div style={{ marginTop: 12 }}>
              {board.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    marginBottom: 6,
                    borderRadius: 6,
                    background: i === 0 ? "#2a2410" : "#15171a",
                    border: i === 0 ? "1px solid #ffcc00" : "1px solid #24272c",
                  }}
                >
                  <span style={{ fontFamily: "'Teko', sans-serif", fontSize: 20 }}>
                    #{i + 1} {b.name}
                  </span>
                  <span style={{ fontFamily: "'Teko', sans-serif", fontSize: 20, color: "#ffcc00" }}>
                    {fmt(b.timeMs)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={startGame}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px 0",
              fontFamily: "'Teko', sans-serif",
              fontSize: 22,
              letterSpacing: 1,
              fontWeight: 600,
              color: "#0d0f12",
              background: "linear-gradient(180deg,#ffd93d,#ffbf00)",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            KÖR IGEN
          </button>
          <button
            onClick={() => setScreen("start")}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "10px 0",
              background: "none",
              border: "1px solid #2a2f36",
              color: "#b7bcc4",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Till startsidan
          </button>
        </div>
      )}
    </div>
  );
}
