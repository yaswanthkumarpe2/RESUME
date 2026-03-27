import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { C } from "../constants/tokens";
import { MagneticBtn } from "./ui";

/* ─── Robot SVG Component ─────────────────────────────────────────────────── */
function RobotMech() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* body float */
      gsap.to(".rb-body", {
        y: -14, duration: 3.2, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });

      /* arms type alternating */
      gsap.to(".rb-larm", {
        rotation: 8, transformOrigin: "368px 266px",
        duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
      gsap.to(".rb-rarm", {
        rotation: -8, transformOrigin: "432px 266px",
        duration: 0.9, delay: 0.45, ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      /* legs subtle bob */
      gsap.to(".rb-lleg", {
        y: 3, duration: 3.2, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });
      gsap.to(".rb-rleg", {
        y: 3, duration: 3.2, delay: 0.15, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });

      /* eyes blink */
      gsap.to(".rb-leye", {
        scaleY: 0.05, transformOrigin: "390px 220px",
        duration: 0.08, ease: "steps(1)",
        yoyo: true, repeat: 1,
        repeatDelay: 3.8,
        delay: 1.5,
        onRepeat() { this.delay(3.8); },
      });
      gsap.to(".rb-reye", {
        scaleY: 0.05, transformOrigin: "410px 220px",
        duration: 0.08, ease: "steps(1)",
        yoyo: true, repeat: 1,
        repeatDelay: 3.9,
        delay: 1.6,
      });

      /* scan line sweep */
      gsap.to(".rb-scan", {
        rotation: 35, transformOrigin: "400px 220px",
        duration: 2.5, ease: "sine.inOut",
        yoyo: true, repeat: -1,
        from: { rotation: -35 },
      });

      /* chest core pulse */
      gsap.to(".rb-core", {
        attr: { r: 6 }, opacity: 1,
        duration: 1.8, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });

      /* antenna ping */
      gsap.to(".rb-ping", {
        attr: { r: 10 }, opacity: 0,
        duration: 0.5, ease: "expo.out",
        repeat: -1, repeatDelay: 2.5, delay: 0.5,
      });

      /* screen text flicker */
      gsap.to(".rb-screen", {
        opacity: 0.4, duration: 0.05,
        ease: "steps(1)", yoyo: true, repeat: 1,
        repeatDelay: 5.5, delay: 3,
      });

      /* orbit dot */
      gsap.to(".rb-orbit-group", {
        rotation: 360, transformOrigin: "400px 265px",
        duration: 6, ease: "none", repeat: -1,
      });

      /* floating code particles */
      gsap.to(".rb-p1", { y: -12, duration: 4.1, delay: 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".rb-p2", { y: -10, duration: 3.7, delay: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".rb-p3", { y: -14, duration: 4.5, delay: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".rb-p4", { y: -9,  duration: 3.9, delay: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

      /* GSAP entrance — robot drops in */
      gsap.from(".rb-body", {
        y: -60, opacity: 0, duration: 1, delay: 0.5,
        ease: "bounce.out",
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="270 130 260 290"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* orbit ring */}
      <circle cx="400" cy="265" r="52" fill="none" stroke={C.neon} strokeWidth="0.5"
        strokeDasharray="4 6" opacity="0.15"/>
      <g className="rb-orbit-group">
        <circle cx="400" cy="213" r="3.5" fill={C.neon} opacity="0.7"/>
      </g>

      {/* ground shadow */}
      <ellipse cx="400" cy="392" rx="44" ry="6" fill={C.neon} opacity="0.05"/>

      {/* ── ROBOT BODY (all animated together for float) ── */}
      <g className="rb-body">

        {/* neck */}
        <rect x="393" y="244" width="14" height="12" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>

        {/* ── HEAD ── */}
        <rect x="368" y="192" width="64" height="52" rx="8" fill="#1c1c1c" stroke={C.neon} strokeWidth="1.5"/>
        <rect x="372" y="192" width="56" height="7" rx="4" fill="#141414" stroke="#2a2a2a" strokeWidth="0.5"/>

        {/* antenna */}
        <line x1="400" y1="192" x2="400" y2="175" stroke="#444" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="400" cy="173" r="3" fill={C.neon}/>
        <circle cx="400" cy="173" r="3" fill="none" stroke={C.neon} strokeWidth="1.5"
          className="rb-ping" opacity="0.9"/>

        {/* scan line */}
        <line x1="376" y1="220" x2="424" y2="220" stroke="#ff2200" strokeWidth="1"
          className="rb-scan" strokeLinecap="round" opacity="0.8"/>

        {/* left eye */}
        <g className="rb-leye">
          <rect x="378" y="212" width="16" height="14" rx="3" fill="#0a0a0a" stroke={C.neon} strokeWidth="1"/>
          <rect x="382" y="216" width="8" height="6" rx="1" fill={C.neon} className="rb-screen"/>
          <circle cx="386" cy="219" r="2.5" fill="#0a0a0a"/>
        </g>

        {/* right eye */}
        <g className="rb-reye">
          <rect x="406" y="212" width="16" height="14" rx="3" fill="#0a0a0a" stroke={C.neon} strokeWidth="1"/>
          <rect x="410" y="216" width="8" height="6" rx="1" fill={C.neon} className="rb-screen"/>
          <circle cx="414" cy="219" r="2.5" fill="#0a0a0a"/>
        </g>

        {/* mouth / speaker bars */}
        <rect x="382" y="232" width="36" height="7" rx="2" fill="#0d0d0d" stroke="#222" strokeWidth="0.5"/>
        {[0,7,14,21,28].map((x, i) => (
          <rect key={i} x={384+x} y={234} width={5} height={3}
            fill={C.neon} opacity={[0.7,0.4,0.8,0.3,0.6][i]}/>
        ))}

        {/* ── TORSO ── */}
        <rect x="364" y="256" width="72" height="70" rx="6" fill="#161616" stroke="#2a2a2a" strokeWidth="1.5"/>
        <rect x="370" y="262" width="60" height="58" rx="4" fill="#0f0f0f" stroke="#1e1e1e" strokeWidth="1"/>

        {/* chest screen */}
        <rect x="376" y="268" width="48" height="30" rx="3" fill="#0a0a0a" stroke={C.neon} strokeWidth="1"/>
        <text x="400" y="281" textAnchor="middle"
          fontFamily="'IBM Plex Mono',monospace" fontSize="7" fill={C.neon}
          className="rb-screen">&gt;_ BUILD</text>
        <text x="400" y="292" textAnchor="middle"
          fontFamily="'IBM Plex Mono',monospace" fontSize="6" fill={C.neon}
          opacity="0.45">SHIP.</text>

        {/* chest core */}
        <circle cx="400" cy="308" r="4" fill="none" stroke={C.neon} strokeWidth="1.5"
          className="rb-core" opacity="0.7"/>
        <circle cx="400" cy="308" r="2" fill={C.neon} opacity="0.9"/>

        {/* torso corner bolts */}
        {[[372,264],[428,264],[372,316],[428,316]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="0.5"/>
        ))}

        {/* ── LEFT ARM ── */}
        <g className="rb-larm">
          <circle cx="360" cy="266" r="7" fill="#1c1c1c" stroke={C.neon} strokeWidth="1"/>
          <circle cx="360" cy="266" r="3" fill={C.neon} opacity="0.6"/>
          <rect x="336" y="262" width="24" height="12" rx="4" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
          <circle cx="332" cy="268" r="5" fill="#1c1c1c" stroke="#333" strokeWidth="0.8"/>
          <rect x="306" y="264" width="26" height="10" rx="3" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <rect x="292" y="262" width="14" height="14" rx="2" fill="#1c1c1c" stroke={C.neon} strokeWidth="1"/>
          <line x1="296" y1="266" x2="302" y2="266" stroke={C.neon} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="296" y1="269" x2="302" y2="269" stroke={C.neon} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="296" y1="272" x2="302" y2="272" stroke={C.neon} strokeWidth="1.5" strokeLinecap="round"/>
        </g>

        {/* ── RIGHT ARM ── */}
        <g className="rb-rarm">
          <circle cx="440" cy="266" r="7" fill="#1c1c1c" stroke={C.neon} strokeWidth="1"/>
          <circle cx="440" cy="266" r="3" fill={C.neon} opacity="0.6"/>
          <rect x="440" y="262" width="24" height="12" rx="4" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
          <circle cx="468" cy="268" r="5" fill="#1c1c1c" stroke="#333" strokeWidth="0.8"/>
          <rect x="468" y="264" width="26" height="10" rx="3" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <rect x="494" y="262" width="14" height="14" rx="2" fill="#1c1c1c" stroke={C.neon} strokeWidth="1"/>
          <line x1="498" y1="266" x2="504" y2="266" stroke={C.neon} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="498" y1="269" x2="504" y2="269" stroke={C.neon} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="498" y1="272" x2="504" y2="272" stroke={C.neon} strokeWidth="1.5" strokeLinecap="round"/>
        </g>

        {/* ── WAIST ── */}
        <rect x="370" y="326" width="60" height="10" rx="3" fill="#111" stroke="#1e1e1e" strokeWidth="1"/>
        <rect x="382" y="328" width="36" height="6" rx="2" fill="#0d0d0d"/>

        {/* ── LEFT LEG ── */}
        <g className="rb-lleg">
          <circle cx="383" cy="338" r="5" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="0.8"/>
          <rect x="376" y="338" width="14" height="24" rx="4" fill="#161616" stroke="#222" strokeWidth="1"/>
          <circle cx="383" cy="362" r="5" fill="#1c1c1c" stroke={C.neon} strokeWidth="0.8" opacity="0.6"/>
          <rect x="377" y="362" width="12" height="20" rx="3" fill="#141414" stroke="#1e1e1e" strokeWidth="1"/>
          <rect x="370" y="380" width="24" height="8" rx="3" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="1"/>
        </g>

        {/* ── RIGHT LEG ── */}
        <g className="rb-rleg">
          <circle cx="417" cy="338" r="5" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="0.8"/>
          <rect x="410" y="338" width="14" height="24" rx="4" fill="#161616" stroke="#222" strokeWidth="1"/>
          <circle cx="417" cy="362" r="5" fill="#1c1c1c" stroke={C.neon} strokeWidth="0.8" opacity="0.6"/>
          <rect x="411" y="362" width="12" height="20" rx="3" fill="#141414" stroke="#1e1e1e" strokeWidth="1"/>
          <rect x="406" y="380" width="24" height="8" rx="3" fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="1"/>
        </g>

      </g>{/* end rb-body */}

      {/* ground line */}
      <line x1="316" y1="392" x2="484" y2="392" stroke="#1a1a1a" strokeWidth="1"/>

      {/* floating code particles */}
      <text className="rb-p1" x="294" y="200" fontFamily="'IBM Plex Mono',monospace"
        fontSize="10" fill={C.neon} opacity="0.18">&lt;/&gt;</text>
      <text className="rb-p2" x="482" y="185" fontFamily="'IBM Plex Mono',monospace"
        fontSize="9" fill={C.neon} opacity="0.14">{"{}"}</text>
      <text className="rb-p3" x="283" y="340" fontFamily="'IBM Plex Mono',monospace"
        fontSize="9" fill={C.neon} opacity="0.12">01</text>
      <text className="rb-p4" x="490" y="310" fontFamily="'IBM Plex Mono',monospace"
        fontSize="9" fill={C.neon} opacity="0.14">( )</text>
    </svg>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y       = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.3],  [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.25], [1, 0.94]);

  return (
    <motion.section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 6vw 8vh",
        paddingTop: 56,
        position: "relative",
        borderBottom: `1px solid ${C.border}`,
        y, opacity, scale,
      }}
    >
      {/* ── top bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "28px 6vw", borderBottom: `1px solid ${C.border}`,
          zIndex: 10,
        }}
      >
        <span className="mono" style={{ fontSize: 11, color: C.neon, letterSpacing: 3 }}>
          @yaswanth.dev
        </span>
        
        <span className="mono" style={{ fontSize: 11, color: "#555", letterSpacing: 2 }}>
          Full Stack ~ Dev
        </span>
      </motion.div>

      {/* ── two-column body ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0 2vw",
        alignItems: "flex-end",
        width: "100%",
      }}>

        {/* LEFT — text stack (unchanged) */}
        <div>
          {[
            { text: "FULL STACK", color: C.white,      stroke: false, delay: 0.35 },
            { text: "DEVELOPER",  color: "transparent", stroke: true,  delay: 0.5  },
            { text: "CREATIVE",   color: C.neon,        stroke: false, delay: 0.65 },
            { text: "ENGINEER",   color: "transparent", stroke: true,  delay: 0.8  },
          ].map(({ text, color, stroke, delay }) => (
            <div key={text} style={{ overflow: "hidden", marginBottom: text === "ENGINEER" ? 40 : 16 }}>
              <motion.h1
                className="bebas"
                initial={{ y: "100%", skewY: 4 }}
                animate={{ y: 0, skewY: 0 }}
                transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(60px, 7vw, 130px)",
                  lineHeight: 0.88,
                  letterSpacing: stroke ? "-2px" : undefined,
                  color,
                  WebkitTextStroke: stroke ? `2px ${C.white}` : undefined,
                  margin: 0,
                }}
              >
                {text}
              </motion.h1>
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}
          >
            <MagneticBtn
              onClick={() => {
                const projectsSection = document.querySelector("section:nth-of-type(5)");
                if (projectsSection) {
                  window.scrollTo({
                    top: projectsSection.offsetTop,
                    behavior: "smooth",
                  });
                }
              }}
            >
              VIEW WORK
            </MagneticBtn>
            <span style={{ color: "#444", fontSize: 13 }}>↓ SCROLL TO EXPLORE</span>
          </motion.div>
        </div>

        {/* RIGHT — robot */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            height: "clamp(300px, 48vh, 560px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* faint grid bg */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `
              linear-gradient(${C.border} 1px, transparent 1px),
              linear-gradient(90deg, ${C.border} 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            opacity: 0.12,
          }}/>
          <RobotMech />
        </motion.div>
      </div>

      {/* ── footer row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.5 }}
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 0 }}
      >
        <span className="mono" style={{ fontSize: 11, color: "#333", letterSpacing: 2 }}>
          Developer
        </span>
      </motion.div>

      {/* ── neon bottom accent ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", bottom: -1, left: 0,
          width: "40%", height: 2,
          background: C.neon, originX: 0,
        }}
      />
    </motion.section>
  );
}