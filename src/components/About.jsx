import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { C } from "../constants/tokens";
import { WordReveal, DrawPath } from "./ui";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export default function About() {
  const ref = useRef(null);
  const headlineRef = useRef(null);
  const rowsRef = useRef(null);
  const pathRef = useRef(null);
  const labelRef = useRef(null);

  // ── Framer scroll parallax (unchanged logic, spring-smoothed) ──
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xLeft  = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const xRight = useTransform(scrollYProgress, [0, 1], [80, -80]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Section label: chars fly in from below with blur ──
      if (labelRef.current) {
        const split = new SplitText(labelRef.current, { type: "chars" });
        gsap.from(split.chars, {
          opacity: 0,
          y: 20,
          filter: "blur(8px)",
          stagger: 0.04,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: labelRef.current,
            start: "top 90%",
            once: true,
          },
        });
      }

      // ── 2. Headline: one-by-one colored drop, snaps to white after ──
      if (headlineRef.current) {
        const COLORS = ["#FF3C3C","#FF6B35","#FFB400","#B8FF57","#57FFD8","#57B8FF","#B857FF","#FF57C4"];
        const split = new SplitText(headlineRef.current, { type: "words,chars" });

        gsap.set(split.chars, { opacity: 0, y: -50, color: C.white });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            once: true,
          },
        });

        split.chars.forEach((ch, i) => {
          const col = COLORS[i % COLORS.length];
          tl
            .to(ch, { opacity: 1, y: 0, color: col, duration: 0.12, ease: "back.out(2)" }, i * 0.055)
            .to(ch, { color: C.white, duration: 0.16, ease: "none" }, i * 0.055 + 0.12);
        });
      }

      // ── 3. SVG path: DrawSVG expands from center outward ──
      if (pathRef.current) {
        gsap.fromTo(
          pathRef.current,
          { drawSVG: "50% 50%" },
          {
            drawSVG: "0% 100%",
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: pathRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // ── 4. Data rows: skewed slide-in stagger + neon hover underline ──
      if (rowsRef.current) {
        const rows = rowsRef.current.querySelectorAll(".about-row");

        gsap.from(rows, {
          opacity: 0,
          x: 60,
          skewX: -6,
          stagger: 0.08,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowsRef.current,
            start: "top 85%",
            once: true,
          },
        });

        rows.forEach((row) => {
          const line = row.querySelector(".row-line");
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          row.addEventListener("mouseenter", () =>
            gsap.to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" })
          );
          row.addEventListener("mouseleave", () =>
            gsap.to(line, { scaleX: 0, duration: 0.25, ease: "power2.in" })
          );
        });
      }

    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{
      padding: "14vh 6vw",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6vw",
      borderBottom: `1px solid ${C.border}`, position: "relative", alignItems: "center",
    }}>

      {/* ── LEFT ── */}
      <motion.div style={{ x: xLeft }}>
        <p ref={labelRef} className="mono" style={{
          color: C.neon, fontSize: 11, letterSpacing: 4, marginBottom: 24,
        }}>
          01 — ABOUT
        </p>

        <div
          ref={headlineRef}
          className="bebas"
          style={{ fontSize: "clamp(28px,4vw,54px)", lineHeight: 1.05, color: C.white }}
        >
          Full-stack developer obsessed with motion, systems, and the edge between design and engineering.
        </div>
      </motion.div>

      {/* ── RIGHT ── */}
      <motion.div style={{ x: xRight }}>

        {/* Raw SVG so the <path> ref works with DrawSVGPlugin */}
        <svg width="100%" height="24" viewBox="0 0 200 24" fill="none" overflow="visible">
          <path
            ref={pathRef}
            d="M0,10 Q50,0 100,10 T200,10"
            stroke={C.neon}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div ref={rowsRef} style={{ marginTop: 32 }}>
          {[
            ["UNIVERSITY", "Lovely Professional University"],
            ["GRAD YEAR",  "2027"],
            ["FULL STACK", "DEVELOPER"],
            ["FOCUS",      "Architecture · DX · Performance"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="about-row"
              style={{
                position: "relative",
                display: "flex", justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: `1px solid ${C.border}`,
                fontSize: 13,
                cursor: "default",
                overflow: "hidden",
              }}
            >
              <span className="mono" style={{ color: "#555", fontSize: 11, letterSpacing: 2 }}>{k}</span>
              <span style={{ color: C.white }}>{v}</span>

              {/* GSAP-controlled neon underline */}
              <div className="row-line" style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 1, background: C.neon,
              }} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}