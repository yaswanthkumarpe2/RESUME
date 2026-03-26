import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { C } from "../constants/tokens";
import { DrawPath } from "./ui";

gsap.registerPlugin(ScrollTrigger);

/* ─── Magnetic social link ───────────────────────────────────────────────── */
function MagLink({ href, icon, label, isEmail }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 24, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 250, damping: 24, mass: 0.4 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isEmail ? undefined : "_blank"}
      rel="noopener noreferrer"
      data-cursor
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        x: sx,
        y: sy,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        color: C.neon,
        textDecoration: "underline",
        textUnderlineOffset: 4,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
        letterSpacing: 1,
        cursor: "none",
        willChange: "transform",
      }}
    >
      {/* Icon spins slightly on hover */}
      <motion.span
        whileHover={{ rotate: 15, scale: 1.25 }}
        transition={{ type: "spring", stiffness: 380, damping: 16 }}
        style={{ display: "flex" }}
      >
        {icon}
      </motion.span>
      {label}
    </motion.a>
  );
}

/* ─── Main section ───────────────────────────────────────────────────────── */
export default function Contact() {
  const sectionRef = useRef(null);
  const h1Ref      = useRef(null);
  const h2Ref      = useRef(null);
  const row1Ref    = useRef(null);
  const row2Ref    = useRef(null);
  const linksRef   = useRef(null);
  const emailRef   = useRef(null);
  const footerRef  = useRef(null);

  /* Framer: section scales up as it scrolls into view */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  /* ── GSAP entrance (single timeline, no per-frame work) ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars1 = h1Ref.current.querySelectorAll("span");
      const chars2 = h2Ref.current.querySelectorAll("span");

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      tl
        /* chars explode in with skew */
        .from(chars1, {
          y: "115%", skewX: -10, opacity: 0,
          stagger: 0.024, duration: 0.72,
        })
        .from(chars2, {
          y: "115%", skewX: 8, opacity: 0,
          stagger: 0.024, duration: 0.72,
        }, "-=0.52")
        /* border boxes draw from left */
        .from(row1Ref.current, {
          scaleX: 0, transformOrigin: "left center",
          duration: 0.85,
        }, "-=0.3")
        .from(row2Ref.current, {
          scaleX: 0, transformOrigin: "left center",
          duration: 0.85,
        }, "-=0.72")
        /* links + email slide up */
        .from(linksRef.current.children, {
          y: 24, opacity: 0, stagger: 0.08, duration: 0.5,
        }, "-=0.5")
        .from(emailRef.current, {
          y: 20, opacity: 0, duration: 0.45,
        }, "-=0.38")
        /* footer fades */
        .from(footerRef.current, {
          opacity: 0, y: 8, duration: 0.4,
        }, "-=0.25");

      /* Glitch on headline hover — zero reflow, just text swap */
      const GLITCH = "!<>_\\/[]{}=+*#@%&";
      const glitch = (el) => {
        const raw = Array.from(el.querySelectorAll("span")).map((s) => s.textContent).join("");
        let i = 0;
        clearInterval(el._gi);
        el._gi = setInterval(() => {
          el.querySelectorAll("span").forEach((s, j) => {
            s.textContent =
              j < i
                ? raw[j]
                : raw[j] === " " || raw[j] === "\u00A0"
                ? raw[j]
                : GLITCH[Math.floor(Math.random() * GLITCH.length)];
          });
          i += 0.45;
          if (i > raw.length) {
            clearInterval(el._gi);
            el.querySelectorAll("span").forEach((s, j) => (s.textContent = raw[j]));
          }
        }, 28);
      };

      [h1Ref.current, h2Ref.current].forEach((el) =>
        el.addEventListener("mouseenter", () => glitch(el))
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Blinking cursor */
  useEffect(() => {
    const el = footerRef.current?.querySelector(".blink");
    if (!el) return;
    const t = gsap.to(el, {
      opacity: 0, repeat: -1, yoyo: true,
      duration: 0.46, ease: "steps(1)",
    });
    return () => t.kill();
  }, []);

  const socials = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      ),
      label: "github.connect()",
      href: "https://github.com/yaswanthkumarpe2",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      label: "linkedin.network()",
      href: "https://www.linkedin.com/in/yaswanthkumarpenukuduru/",
    },
  ];

  return (
    <motion.section
      ref={sectionRef}
      style={{
        padding: "16vh 6vw 8vh",
        textAlign: "center",
        scale,
        background: C.mid,
        borderTop: `1px solid ${C.border}`,
        willChange: "transform",
      }}
    >
      {/* Section tag */}
      <p
        className="mono"
        style={{ color: C.neon, fontSize: 11, letterSpacing: 4, marginBottom: 24 }}
      >
        06 — CONTACT
      </p>

      {/* ── Headline 1 ── */}
      <div
        ref={h1Ref}
        style={{ overflow: "hidden", cursor: "default", userSelect: "none" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 12vw, 160px)",
            lineHeight: 0.85,
            color: C.white,
            marginBottom: 8,
          }}
        >
          {"LET'S BUILD".split("").map((c, i) => (
            <span key={i} style={{ display: "inline-block" }}>
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Headline 2 ── */}
      <div
        ref={h2Ref}
        style={{
          overflow: "hidden",
          cursor: "default",
          userSelect: "none",
          marginBottom: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 12vw, 160px)",
            lineHeight: 0.85,
            WebkitTextStroke: `2px ${C.white}`,
            color: "transparent",
          }}
        >
          {"SOMETHING".split("").map((c, i) => (
            <span key={i} style={{ display: "inline-block" }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ── Links container ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0,
          maxWidth: 520,
          margin: "0 auto 48px",
        }}
      >
        {/* Row 1 — github + linkedin */}
        <div
          ref={row1Ref}
          style={{
            padding: "18px 24px",
            borderTop: `1px solid ${C.border}`,
            borderLeft: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            ref={linksRef}
            style={{ display: "flex", gap: 40, flexWrap: "wrap" }}
          >
            {socials.map((s) => (
              <MagLink key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Row 2 — email */}
        <div
          ref={row2Ref}
          style={{
            padding: "18px 24px",
            border: `1px solid ${C.border}`,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div ref={emailRef}>
            <MagLink
              href="mailto:yaswanthkumarp@icloud.com"
              isEmail
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              }
              label={'sendEmail("yaswanthkumarp@icloud.com")'}
            />
          </div>
        </div>
      </div>

      <DrawPath d="M0,10 L200,10" color={C.border} />

      <p
        ref={footerRef}
        className="mono"
        style={{ fontSize: 11, color: "#333", letterSpacing: 3, marginTop: 24 }}
      >
        @yaswanth.dev
        <span className="blink" style={{ marginLeft: 2, color: C.neon }}>_</span>
      </p>
    </motion.section>
  );
}