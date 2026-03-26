import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { C } from "../constants/tokens";

gsap.registerPlugin(ScrollTrigger);

const techItems = [
  "C", "C++", "JAVA", "PYTHON", "REACT", "NODE", "PHP",
];

const ROWS = [
  { items: techItems, dir:  1, speed: 0.55 },
  { items: techItems, dir: -1, speed: 0.45 },
  { items: techItems, dir:  1, speed: 0.65 },
];

// Color pattern per item index
const COLOR_MAP = (i) => {
  const cycle = ["neon", "dim", "mid", "dim", "neon", "mid", "dim", "mid"];
  return cycle[i % cycle.length];
};
const COLOR_VAL = {
  neon: C.neon,
  dim:  "#1a1a1a",
  mid:  "#2a2a2a",
};

// ── Single infinite row ───────────────────────────────────────────────────────
function TickerRow({ row, parallaxX }) {
  const trackRef = useRef(null);
  const xPos     = useRef(0);
  const paused   = useRef(false);
  const rafRef   = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = () => track.scrollWidth / 2;

    function tick() {
      if (!paused.current) {
        xPos.current -= row.speed * row.dir;
        if (Math.abs(xPos.current) >= half()) xPos.current = 0;
        track.style.transform = `translateX(${xPos.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const all = [...row.items, ...row.items, ...row.items, ...row.items];

  return (
    <motion.div
      style={{
        x: parallaxX,
        padding: "10px 0",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* Edge fade masks */}
      {["left", "right"].map(side => (
        <div key={side} style={{
          position: "absolute", top: 0, bottom: 0, [side]: 0,
          width: 80, zIndex: 2, pointerEvents: "none",
          background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${C.black}, transparent)`,
        }} />
      ))}

      <div ref={trackRef} style={{ display: "flex", alignItems: "center", willChange: "transform" }}>
        {all.map((name, i) => {
          const col = COLOR_MAP(i);
          return (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
              <ItemText name={name} defaultColor={COLOR_VAL[col]} />
              {/* Diamond separator */}
              <span style={{
                display: "inline-block",
                width: 12, height: 12,
                border: `1.5px solid ${col === "neon" ? C.neon : "#333"}`,
                transform: "rotate(45deg)",
                opacity: 0.6,
                flexShrink: 0,
                margin: "0 2vw",
              }}>
                <motion.div 
                  style={{ width: "100%", height: "100%", background: col === "neon" ? C.neon : "transparent" }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
              </span>
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Item with GSAP hover underline ────────────────────────────────────────────
function ItemText({ name, defaultColor }) {
  const ref     = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const el   = ref.current;
    const line = lineRef.current;
    if (!el || !line) return;

    gsap.set(line, { scaleX: 0, transformOrigin: "left" });

    const onEnter = () => {
      gsap.to(el,   { color: C.neon, duration: 0.18, ease: "power1.out" });
      gsap.to(line, { scaleX: 1,     duration: 0.3,  ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el,   { color: defaultColor, duration: 0.25 });
      gsap.to(line, { scaleX: 0,           duration: 0.2, ease: "power2.in" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [defaultColor]);

  return (
    <span
      ref={ref}
      className="bebas"
      style={{
        fontSize: "clamp(36px,6vw,76px)",
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        lineHeight: 1,
        padding: "0 2.5vw",
        color: defaultColor,
        position: "relative",
        cursor: "default",
        display: "inline-block",
      }}
    >
      {name}
      {/* GSAP underline */}
      <span
        ref={lineRef}
        style={{
          position: "absolute",
          bottom: -2, left: "2.5vw", right: "2.5vw",
          height: 1,
          background: C.neon,
          display: "block",
        }}
      />
    </span>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function TechTicker() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Three rows with different parallax directions + speeds
  const x0 = useTransform(scrollYProgress, [0, 1], ["0%",   "-25%"]);
  const x1 = useTransform(scrollYProgress, [0, 1], ["-20%", "15%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["5%",   "-20%"]);
  const parallaxValues = [x0, x1, x2];

  return (
    <section
      ref={ref}
      style={{
        padding: "10vh 0",
        borderBottom: `1px solid ${C.border}`,
        overflow: "hidden",
      }}
    >
      {ROWS.map((row, i) => (
        <div key={i}>
          <TickerRow row={row} parallaxX={parallaxValues[i]} />
          {i < ROWS.length - 1 && (
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.04)" }} />
          )}
        </div>
      ))}
    </section>
  );
}