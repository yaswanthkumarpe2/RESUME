import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { C } from "../constants/tokens";

gsap.registerPlugin(ScrollTrigger, SplitText);

const openSource = [
  {
    name: "Rentals",
    stars: "140+",
    desc: "A Next.js project bootstrapped with create-next-app for property rentals.",
    link: "https://github.com/yaswanthkumarpe2/Rentals",
  },
  {
    name: "Portfolio",
    downloads: "1300+",
    desc: "A modern, responsive personal portfolio website with a dark, cyberpunk-inspired aesthetic.",
    link: "https://github.com/yaswanthkumarpe2/PORTFOLIO",
  },
];

// ── Card ──────────────────────────────────────────────────────────────────────
function OSCard({ item, index }) {
  const cardRef  = useRef(null);
  const nameRef  = useRef(null);
  const lineRef  = useRef(null);
  const glowRef  = useRef(null);

  // Mouse-tracking radial glow
  const onMouseMove = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + "%";
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + "%";
    glowRef.current.style.background =
      `radial-gradient(circle at ${x} ${y}, rgba(184,255,87,0.07) 0%, transparent 60%)`;
  };

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const card  = cardRef.current;
      const name  = nameRef.current;
      const line  = lineRef.current;
      const stats = card.querySelectorAll(".os-stat");
      const desc  = card.querySelector(".os-desc");
      const num   = card.querySelector(".os-num");
      const arrow = card.querySelector(".os-arrow");

      gsap.set([card, name, desc, stats, arrow], { opacity: 0 });
      gsap.set(line, { scaleX: 0, transformOrigin: "left" });
      gsap.set(name, { y: 30, skewX: 4 });
      gsap.set(desc, { y: 16 });
      gsap.set(stats, { y: 12, x: 8 });
      gsap.set(arrow, { y: 8, x: -8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
        delay: index * 0.12,
      });

      tl.to(card,  { opacity: 1, duration: 0.01 })
        .to(line,  { scaleX: 1, duration: 0.4, ease: "power3.inOut" })
        .to(name,  { opacity: 1, y: 0, skewX: 0, duration: 0.55, ease: "power3.out" }, "-=0.1")
        .to(desc,  { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, "-=0.3")
        .to(stats, { opacity: 1, y: 0, x: 0, duration: 0.4, stagger: 0.07, ease: "power2.out" }, "-=0.3")
        .to(arrow, { opacity: 1, y: 0, x: 0, duration: 0.35, ease: "power2.out" }, "-=0.3");

      // Hover — name color + top line pulse
      card.addEventListener("mouseenter", () => {
        gsap.to(nameRef.current, { color: C.neon, duration: 0.2 });
        gsap.to(arrow,           { color: C.neon, x: 4, y: -4, duration: 0.25, ease: "power2.out" });
        gsap.to(stats,           { borderColor: "rgba(184,255,87,0.25)", color: C.neon, duration: 0.2, stagger: 0.04 });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(nameRef.current, { color: C.white, duration: 0.3 });
        gsap.to(arrow,           { color: "#111",  x: 0, y: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(stats,           { borderColor: "#111", color: "#222", duration: 0.25, stagger: 0.03 });
      });

    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onClick={() => window.open(item.link, "_blank")}
      style={{
        background: C.black,
        padding: 40,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        opacity: 0,
      }}
    >
      {/* Mouse-tracking glow */}
      <div
        ref={glowRef}
        style={{
          position: "absolute", inset: 0,
          pointerEvents: "none",
          transition: "background 0.1s",
        }}
      />

      {/* Top wipe line (GSAP) */}
      <div
        ref={lineRef}
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 1, background: C.neon,
          transform: "scaleX(0)",
        }}
      />

      {/* Card number */}
      <div
        className="os-num mono"
        style={{
          fontSize: 9, letterSpacing: 3, color: "#1a1a1a",
          marginBottom: 32,
          display: "flex", alignItems: "center", gap: 12,
        }}
      >
        0{index + 1}
        <span style={{ flex: 1, height: 1, background: "#111", display: "block" }} />
      </div>

      {/* Name */}
      <h3
        ref={nameRef}
        className="bebas"
        style={{
          fontSize: "clamp(36px,4vw,58px)",
          letterSpacing: "-0.02em",
          lineHeight: 0.95,
          color: C.white,
          marginBottom: 20,
        }}
      >
        {item.name}
      </h3>

      {/* Description */}
      <p
        className="os-desc"
        style={{
          fontSize: 12, color: "#333",
          lineHeight: 1.7, marginBottom: 32,
          maxWidth: 340,
        }}
      >
        {item.desc}
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 0 }}>
        {item.stars && (
          <div
            className="os-stat mono"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 10, letterSpacing: 2, color: "#222",
              padding: "8px 14px", border: "1px solid #111",
            }}
          >
            ★ {item.stars} STARS
          </div>
        )}
        {item.downloads && (
          <div
            className="os-stat mono"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 10, letterSpacing: 2, color: "#222",
              padding: "8px 14px", border: "1px solid #111",
            }}
          >
            ↓ {item.downloads} DOWNLOADS
          </div>
        )}
        <div
          className="os-stat mono"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 10, letterSpacing: 2, color: "#222",
            padding: "8px 14px", border: "1px solid #111",
            cursor: "pointer",
          }}
        >
          VIEW →
        </div>
      </div>

      {/* Arrow */}
      <div
        className="os-arrow"
        style={{
          position: "absolute", bottom: 32, right: 32,
          fontSize: 20, color: "#111",
        }}
      >
        ↗
      </div>

      {/* Big ghost number */}
      <div
        className="bebas"
        style={{
          position: "absolute", right: -10, bottom: -20,
          fontSize: 180, lineHeight: 1,
          color: "rgba(255,255,255,0.02)",
          pointerEvents: "none", userSelect: "none",
        }}
      >
        0{index + 1}
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function OpenSource() {
  const sectionRef  = useRef(null);
  const headlineRef = useRef(null);
  const labelRef    = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headlineX = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  // GSAP label + headline
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label blur-in
      if (labelRef.current) {
        const split = new SplitText(labelRef.current, { type: "chars" });
        gsap.from(split.chars, {
          opacity: 0, y: 14, filter: "blur(6px)",
          stagger: 0.04, duration: 0.5, ease: "power3.out",
          scrollTrigger: { trigger: labelRef.current, start: "top 90%", once: true },
        });
      }

      // Headline char flip
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: "chars" });
        gsap.set(headlineRef.current, { perspective: 600 });
        gsap.from(split.chars, {
          opacity: 0, rotationX: -80, y: 30,
          transformOrigin: "0% 50% -20px",
          stagger: { amount: 0.5, from: "start" },
          duration: 0.6, ease: "back.out(1.6)",
          scrollTrigger: { trigger: headlineRef.current, start: "top 80%", once: true },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ padding: "14vh 6vw", borderBottom: `1px solid ${C.border}` }}
    >
      <p
        ref={labelRef}
        className="mono"
        style={{ color: C.neon, fontSize: 11, letterSpacing: 4, marginBottom: 24 }}
      >
        04 — OPEN SOURCE
      </p>

      <motion.div style={{ x: headlineX }}>
        <div
          ref={headlineRef}
          className="bebas"
          style={{
            fontSize: "clamp(32px,5vw,72px)",
            color: C.white,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginBottom: 64,
          }}
        >
          GIVING BACK TO THE WEB
        </div>
      </motion.div>

      {/* Cards — 1px gap via background on wrapper */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "rgba(255,255,255,0.07)",
        }}
      >
        {openSource.map((item, i) => (
          <OSCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}