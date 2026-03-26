import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue, useSpring, useInView,
  useTransform, animate,
} from "framer-motion";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { C } from "../constants/tokens";

gsap.registerPlugin(SplitText, DrawSVGPlugin);

// ─────────────────────────────────────────────────────────────────────────────
// MagneticBtn — spring-physics pull + shockwave click + fill wipe
// ─────────────────────────────────────────────────────────────────────────────
export function MagneticBtn({ children, accent = C.neon, style = {}, onClick }) {
  const ref      = useRef(null);
  const wipeRef  = useRef(null);
  const x        = useMotionValue(0);
  const y        = useMotionValue(0);
  const sx       = useSpring(x, { stiffness: 220, damping: 16, mass: 0.6 });
  const sy       = useSpring(y, { stiffness: 220, damping: 16, mass: 0.6 });
  const [active, setActive] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.38);
    y.set((e.clientY - r.top  - r.height / 2) * 0.38);
  };

  const onEnter = () => {
    setActive(true);
    gsap.to(wipeRef.current, { scaleX: 1, duration: 0.38, ease: "power3.inOut", transformOrigin: "left" });
  };

  const onLeave = () => {
    x.set(0); y.set(0); setActive(false);
    gsap.to(wipeRef.current, { scaleX: 0, duration: 0.28, ease: "power3.inOut", transformOrigin: "right" });
  };

  const onTap = (e) => {
    // Radial shockwave from click point
    const r   = ref.current.getBoundingClientRect();
    const px  = e.clientX - r.left;
    const py  = e.clientY - r.top;
    const div = document.createElement("span");
    Object.assign(div.style, {
      position: "absolute", borderRadius: "50%",
      width: "6px", height: "6px",
      left: px - 3 + "px", top: py - 3 + "px",
      background: accent, pointerEvents: "none",
      zIndex: 10, transform: "scale(0)", opacity: "0.9",
    });
    ref.current.appendChild(div);
    gsap.to(div, {
      scale: 18, opacity: 0, duration: 0.55,
      ease: "power2.out",
      onComplete: () => div.remove(),
    });
    onClick?.();
  };

  return (
    <motion.button
      ref={ref}
      data-cursor="btn"
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onTap}
      style={{
        x: sx, y: sy,
        position: "relative", overflow: "hidden",
        border: `1px solid ${accent}`,
        background: "transparent",
        color: active ? C.black : accent,
        padding: "14px 36px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12, fontWeight: 700, letterSpacing: 3,
        textTransform: "uppercase", cursor: "none",
        display: "inline-block", zIndex: 0,
        transition: "color 0.25s",
        ...style,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Fill wipe */}
      <span
        ref={wipeRef}
        style={{
          position: "absolute", inset: 0,
          background: accent,
          transform: "scaleX(0)", transformOrigin: "left",
          zIndex: -1,
          display: "block",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WordReveal — GSAP SplitText word-clip with 3D perspective flip
// ─────────────────────────────────────────────────────────────────────────────
export function WordReveal({ text, className = "", style = {}, stagger = 0.07, delay = 0 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const done   = useRef(false);

  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    const ctx = gsap.context(() => {
      const split = new SplitText(ref.current, { type: "words" });
      gsap.set(ref.current, { perspective: 600 });
      gsap.from(split.words, {
        opacity: 0,
        y: 60,
        rotationX: -70,
        transformOrigin: "0% 50% -30px",
        duration: 0.65,
        stagger,
        delay,
        ease: "back.out(1.5)",
      });
    }, ref);
    return () => ctx.revert();
  }, [inView]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "block", ...style }}
    >
      {text}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LetterReveal — sequential color flash → settles white (GSAP SplitText)
// ─────────────────────────────────────────────────────────────────────────────
const FLASH_COLORS = ["#FF3C3C","#FF6B35","#FFB400","#B8FF57","#57FFD8","#57B8FF","#B857FF","#FF57C4"];

export function LetterReveal({ text, className = "", style = {} }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const done   = useRef(false);

  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    const ctx = gsap.context(() => {
      const split = new SplitText(ref.current, { type: "chars" });

      split.chars.forEach((ch, i) => {
        gsap.set(ch, { color: FLASH_COLORS[i % FLASH_COLORS.length] });
      });

      const tl = gsap.timeline();
      tl.from(split.chars, {
        opacity: 0,
        y: -40,
        duration: 0.12,
        stagger: 0.055,
        ease: "back.out(2)",
      })
      .to(split.chars, {
        color: C.white,
        duration: 0.16,
        stagger: { amount: 0.4, from: "random" },
        ease: "none",
      }, "-=0.1");
    }, ref);
    return () => ctx.revert();
  }, [inView]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "block", ...style }}
    >
      {text}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DrawPath — GSAP DrawSVGPlugin, expands from center outward
// ─────────────────────────────────────────────────────────────────────────────
export function DrawPath({ d, color = C.neon, delay = 0, strokeWidth = 1.5 }) {
  const svgRef  = useRef(null);
  const pathRef = useRef(null);
  const inView  = useInView(svgRef, { once: true, margin: "-80px" });
  const done    = useRef(false);

  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    gsap.fromTo(
      pathRef.current,
      { drawSVG: "50% 50%" },
      { drawSVG: "0% 100%", duration: 1.4, delay, ease: "power2.inOut" }
    );
  }, [inView]);

  return (
    <svg ref={svgRef} viewBox="0 0 200 20" style={{ width: "100%", height: 20, overflow: "visible" }}>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TiltCard — 3D tilt + inner parallax layer + neon edge glow on hover
// ─────────────────────────────────────────────────────────────────────────────
export function TiltCard({ children, style = {} }) {
  const ref    = useRef(null);
  const glowRef= useRef(null);
  const rx     = useMotionValue(0);
  const ry     = useMotionValue(0);
  const srx    = useSpring(rx, { stiffness: 260, damping: 22, mass: 0.7 });
  const sry    = useSpring(ry, { stiffness: 260, damping: 22, mass: 0.7 });
  const glowX  = useTransform(sry, [-14, 14], ["-30%", "130%"]);
  const glowY  = useTransform(srx, [-14, 14], ["-30%", "130%"]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top)  / r.height;
    rx.set((ny - 0.5) * -16);
    ry.set((nx - 0.5) *  16);
    // Glow tracks mouse
    if (glowRef.current) {
      glowRef.current.style.left = (nx * 100) + "%";
      glowRef.current.style.top  = (ny * 100) + "%";
    }
  };

  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx, rotateY: sry,
        transformStyle: "preserve-3d",
        perspective: 900,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Mouse-tracking neon radial glow */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          width: "180px", height: "180px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(184,255,87,0.07) 0%, transparent 70%)`,
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 0,
          transition: "left 0.08s, top 0.08s",
        }}
      />
      {/* Edge shimmer */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          border: "1px solid transparent",
          background: `linear-gradient(${C.black},${C.black}) padding-box,
                       linear-gradient(135deg, rgba(184,255,87,0) 0%, rgba(184,255,87,0.15) 50%, rgba(184,255,87,0) 100%) border-box`,
          pointerEvents: "none", zIndex: 1,
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div style={{ position: "relative", zIndex: 2, transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedCounter — counts up with eased spring on inView
// ─────────────────────────────────────────────────────────────────────────────
export function AnimatedCounter({ to, suffix = "", prefix = "", duration = 1.8, className = "", style = {} }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count  = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return controls.stop;
  }, [inView, to]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ScrambleText — hover scrambles chars before resolving to original
// ─────────────────────────────────────────────────────────────────────────────
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

export function ScrambleText({ text, className = "", style = {}, triggerOnMount = false }) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef(null);

  const scramble = useCallback(() => {
    let frame = 0;
    const total = 20;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (frame / total > i / text.length) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );
      frame++;
      if (frame > total + text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 35);
  }, [text]);

  useEffect(() => {
    if (triggerOnMount) scramble();
    return () => clearInterval(intervalRef.current);
  }, [triggerOnMount]);

  return (
    <span
      className={className}
      style={{ cursor: "default", ...style }}
      onMouseEnter={scramble}
    >
      {display}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RevealBlock — GSAP neon wipe reveals content underneath on scroll
// ─────────────────────────────────────────────────────────────────────────────
export function RevealBlock({ children, delay = 0, style = {} }) {
  const ref     = useRef(null);
  const wipeRef = useRef(null);
  const inView  = useInView(ref, { once: true, margin: "-60px" });
  const done    = useRef(false);

  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    const wipe = wipeRef.current;
    const tl   = gsap.timeline({ delay });
    gsap.set(ref.current, { opacity: 1 });
    tl.to(wipe, { scaleX: 1, duration: 0.35, ease: "power3.inOut", transformOrigin: "left" })
      .to(wipe, { scaleX: 0, duration: 0.3,  ease: "power3.inOut", transformOrigin: "right" });
  }, [inView]);

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden", opacity: 0, ...style }}>
      {/* Neon wipe bar */}
      <div
        ref={wipeRef}
        style={{
          position: "absolute", inset: 0,
          background: C.neon,
          transform: "scaleX(0)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MagneticLink — text link with underline that draws/retracts + magnetic pull
// ─────────────────────────────────────────────────────────────────────────────
export function MagneticLink({ children, href = "#", className = "", style = {} }) {
  const ref     = useRef(null);
  const lineRef = useRef(null);
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const sx      = useSpring(x, { stiffness: 300, damping: 22 });
  const sy      = useSpring(y, { stiffness: 300, damping: 22 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.3);
    y.set((e.clientY - r.top  - r.height / 2) * 0.3);
  };

  const onEnter = () => {
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.35, ease: "power2.out", transformOrigin: "left" });
  };

  const onLeave = () => {
    x.set(0); y.set(0);
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.25, ease: "power2.in", transformOrigin: "right" });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor="link"
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-block", position: "relative", ...style }}
      className={className}
    >
      {children}
      <span
        ref={lineRef}
        style={{
          position: "absolute", bottom: -2, left: 0, right: 0,
          height: 1, background: C.neon,
          transform: "scaleX(0)", display: "block",
        }}
      />
    </motion.a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Noise — animated canvas grain overlay
// ─────────────────────────────────────────────────────────────────────────────
export function Noise({ opacity = 0.035 }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    canvas.width = 200; canvas.height = 200;

    function draw() {
      const d = ctx.createImageData(200, 200);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d.data[i] = d.data[i+1] = d.data[i+2] = v;
        d.data[i+3] = 255;
      }
      ctx.putImageData(d, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        width: "100%", height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 9998,
        imageRendering: "pixelated",
      }}
    />
  );
}