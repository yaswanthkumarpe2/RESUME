import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C } from "../constants/tokens";
import { LetterReveal } from "./ui";

const skills = [
  { name: "React / Next.js", level: 95 },
  { name: "Node / Express", level: 88 },
  { name: "GSAP / Framer", level: 92 },
  { name: "PostgreSQL", level: 82 },
  { name: "Redis / RabbitMQ", level: 75 },
  { name: "Docker / CI-CD", level: 70 },
];

function SkillBar({ name, level, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: C.white }}>{name}</span>
        <span className="mono" style={{ fontSize: 11, color: C.neon }}>{level}%</span>
      </div>
      <div style={{ height: 2, background: C.border }}>
        <motion.div
          style={{ height: "100%", background: C.neon, originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : {}}
          transition={{ delay: index * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section style={{
      padding: "14vh 6vw", display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: "8vw", borderBottom: `1px solid ${C.border}`, alignItems: "start",
    }}>
      <div>
        <p className="mono" style={{ color: C.neon, fontSize: 11, letterSpacing: 4, marginBottom: 24 }}>
          02 — SKILLS
        </p>
        <LetterReveal text="CRAFT" className="bebas"
          style={{ fontSize: "clamp(64px,12vw,160px)", lineHeight: 0.85, color: C.white }} />
        <LetterReveal text="STACK" className="bebas"
          style={{ fontSize: "clamp(64px,12vw,160px)", lineHeight: 0.85, WebkitTextStroke: `2px ${C.white}`, color: "transparent" }} />
      </div>
      <div style={{ paddingTop: 60 }}>
        {skills.map((s, i) => <SkillBar key={s.name} {...s} index={i} />)}
      </div>
    </section>
  );
}
