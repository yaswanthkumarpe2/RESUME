import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { C } from "../constants/tokens";

gsap.registerPlugin(ScrollTrigger, SplitText);

const certs = [
  { 
    title: "Bits and Bytes by Google", 
    org: "Google — Coursera", 
    date: "OCT 2024",
    link: "https://coursera.org/share/667a58190acd725f3e3cf5268a8bff92" 
  },
  { 
    title: "Peer to peer By Colorado", 
    org: "University of Colorado — Coursera", 
    date: "OCT 2024",
    link: "https://coursera.org/share/30b49e0c02c7db6c2e9de2e2f2af8309" 
  },
];

function CertRow({ cert, index, sectionRef }) {
  const rowRef   = useRef(null);
  const barRef   = useRef(null);
  const titleRef = useRef(null);

  // Framer — subtle parallax on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rowX = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -30 : 30, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const row   = rowRef.current;
      const bar   = barRef.current;
      const num   = row.querySelector(".cert-num");
      const title = row.querySelector(".cert-title");
      const org   = row.querySelector(".cert-org");
      const date  = row.querySelector(".cert-date");
      const btn   = row.querySelector(".cert-btn");

      // Start hidden
      gsap.set(row, { opacity: 0 });
      gsap.set([num, title, org, date, btn], { opacity: 0, y: 14 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 88%",
          once: true,
        },
      });

      // 1. Row appears
      tl.to(row, { opacity: 1, duration: 0.01 })
      // 2. Neon bar wipes left → right
        .to(bar, { scaleX: 1, duration: 0.32, ease: "power3.inOut" })
      // 3. Bar retracts right → left, revealing content underneath
        .to(bar, { scaleX: 0, transformOrigin: "right center", duration: 0.28, ease: "power3.inOut" })
      // 4. Content rises up staggered
        .to([num, title, org, date, btn], {
          opacity: 1,
          y: 0,
          stagger: 0.055,
          duration: 0.4,
          ease: "power2.out",
        }, "-=0.1");

      // SplitText hover scramble on title
      let splitTitle = null;
      let hoverTl = null;

      row.addEventListener("mouseenter", () => {
        gsap.to(titleRef.current, { color: C.neon, duration: 0.18 });
        gsap.to(num, { color: C.neon, duration: 0.18 });
        gsap.to(bar, { scaleX: 0.06, transformOrigin: "left center", duration: 0.25, ease: "power2.out" });
      });

      row.addEventListener("mouseleave", () => {
        gsap.to(titleRef.current, { color: C.white, duration: 0.28 });
        gsap.to(num, { color: "#333", duration: 0.28 });
        gsap.to(bar, { scaleX: 0, duration: 0.2, ease: "power2.in" });
      });

    }, rowRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={rowRef}
      style={{
        x: rowX,
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "28px 0",
        borderBottom: `1px solid ${C.border}`,
        gap: 24,
        flexWrap: "wrap",
        cursor: "default",
        overflow: "hidden",
      }}
    >
      {/* GSAP wipe bar */}
      <div
        ref={barRef}
        style={{
          position: "absolute",
          inset: 0,
          background: C.neon,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <span
        className="cert-num mono"
        style={{ fontSize: 10, color: "#333", letterSpacing: 2, minWidth: 28, zIndex: 2 }}
      >
        0{index + 1}
      </span>

      <h4
        ref={titleRef}
        className="cert-title bebas"
        style={{
          fontSize: "clamp(22px,3vw,36px)",
          color: C.white,
          flex: 1,
          zIndex: 2,
        }}
      >
        {cert.title}
      </h4>

      <span
        className="cert-org"
        style={{ fontSize: 13, color: "#555", zIndex: 2 }}
      >
        {cert.org}
      </span>

      <span
        className="cert-date mono"
        style={{ fontSize: 11, color: C.neon, letterSpacing: 3, zIndex: 2 }}
      >
        {cert.date}
      </span>

      {/* Verify button — Framer hover */}
      <motion.button
        className="cert-btn mono"
        onClick={() => cert.link && window.open(cert.link, "_blank")}
        whileHover={{ borderColor: C.neon, color: C.neon, scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18 }}
        style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "#333",
          border: `1px solid #1a1a1a`,
          padding: "7px 16px",
          background: "transparent",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        VERIFY →
      </motion.button>
    </motion.div>
  );
}

export default function Certs() {
  const sectionRef = useRef(null);
  const labelRef   = useRef(null);

  // GSAP label blur-in
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (labelRef.current) {
        const split = new SplitText(labelRef.current, { type: "chars" });
        gsap.from(split.chars, {
          opacity: 0,
          y: 16,
          filter: "blur(6px)",
          stagger: 0.04,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: labelRef.current,
            start: "top 90%",
            once: true,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ padding: "10vh 6vw", borderBottom: `1px solid ${C.border}` }}
    >
      <p
        ref={labelRef}
        className="mono"
        style={{ color: C.neon, fontSize: 11, letterSpacing: 4, marginBottom: 40 }}
      >
        05 — CERTIFICATIONS
      </p>

      <div>
        {certs.map((cert, i) => (
          <CertRow key={i} cert={cert} index={i} sectionRef={sectionRef} />
        ))}
      </div>
    </section>
  );
}