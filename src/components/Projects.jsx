import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { C } from "../constants/tokens";
import { WordReveal } from "./ui";

const projects = [
  {
    id: "student-dropout", title: "STUDENT DROPOUT\nANALYSIS", tag: "ANALYSIS",
    desc: "Comprehensive analysis of student dropout patterns using machine learning and data visualization techniques.",
    stack: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"], year: "2024", color: C.neon, link: "https://github.com/yaswanthkumarpe2/Student-Dropout-Analysis"
  },
  {
    id: "ai-healthcare", title: "AI\nHEALTH CARE", tag: "HEALTH-TECH",
    desc: "AI-driven healthcare platform for medical diagnosis assistance and patient data management.",
    stack: ["React", "Node.js", "AI/ML", "MongoDB"], year: "2024", color: C.red, link: "https://github.com/yaswanthkumarpe2/AI-Healthcare"
  },
  {
    id: "ai-hive", title: "AI HIVE\nFEEDBACK", tag: "FEEDBACK-HUB",
    desc: "Centralized feedback hub powered by AI for gathering and analyzing user insights efficiently.",
    stack: ["React", "Express", "OpenAI API", "PostgreSQL"], year: "2025", color: C.blue, link: "https://github.com/yaswanthkumarpe2/ai-hive-feedback-hub"
  },
  {
    id: "os-simulation", title: "OS\nSIMULATION", tag: "SYSTEMS",
    desc: "Interactive simulation of operating system concepts including process scheduling and memory management.",
    stack: ["C++", "OS Concepts", "CLI"], year: "2024", color: "#ff9900", link: "https://github.com/yaswanthkumarpe2/OS-PROJECTT"
  },
];

function ProjectCard({ project, layout: isGrid }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout layoutId={project.id} data-cursor
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      onClick={() => project.link && window.open(project.link, "_blank")}
      style={{
        border: `1px solid ${C.border}`, padding: isGrid ? 32 : "24px 32px",
        display: "flex", flexDirection: isGrid ? "column" : "row",
        alignItems: isGrid ? "flex-start" : "center", gap: isGrid ? 20 : 32,
        cursor: "none", position: "relative", overflow: "hidden",
        background: hovered ? C.mid : "transparent",
      }}
      whileHover={{ borderColor: project.color }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: project.color, originY: 0 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <div style={{ flex: isGrid ? "unset" : "0 0 200px" }}>
        <p className="mono" style={{ fontSize: 10, color: project.color, letterSpacing: 3, marginBottom: 8 }}>{project.tag}</p>
        <h3 className="bebas"
          style={{ fontSize: isGrid ? "clamp(36px,4vw,52px)" : 36, lineHeight: 0.9, whiteSpace: "pre-line", color: C.white }}>
          {project.title}
        </h3>
      </div>
      <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, flex: isGrid ? "unset" : 1 }}>{project.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: isGrid ? "auto" : 0, flexShrink: 0 }}>
        {project.stack.map(s => (
          <span key={s} className="mono"
            style={{ fontSize: 10, border: `1px solid ${C.border}`, padding: "4px 10px", color: "#666", letterSpacing: 2 }}>
            {s}
          </span>
        ))}
      </div>
      <span className="mono" style={{
        position: isGrid ? "absolute" : "relative",
        top: isGrid ? 28 : "unset", right: isGrid ? 28 : "unset",
        fontSize: 11, color: "#333", flexShrink: 0,
      }}>{project.year}</span>
    </motion.div>
  );
}

export default function Projects() {
  const [isGrid, setIsGrid] = useState(true);
  return (
    <section style={{ padding: "14vh 6vw", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <p className="mono" style={{ color: C.neon, fontSize: 11, letterSpacing: 4, marginBottom: 16 }}>03 — WORK</p>
          <WordReveal text="SELECTED PROJECTS" className="bebas"
            style={{ fontSize: "clamp(36px,6vw,80px)", color: C.white }} stagger={0.05} />
        </div>
        <div style={{ display: "flex" }}>
          {[true, false].map((g) => (
            <motion.button key={String(g)} onClick={() => setIsGrid(g)}
              style={{
                background: isGrid === g ? C.neon : "transparent", border: `1px solid ${C.border}`,
                color: isGrid === g ? C.black : "#555", padding: "10px 20px",
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "none",
              }}
              whileTap={{ scale: 0.93 }}
            >
              {g ? "GRID" : "LIST"}
            </motion.button>
          ))}
        </div>
      </div>
      <LayoutGroup>
        <motion.div layout style={{
          display: isGrid ? "grid" : "flex",
          gridTemplateColumns: isGrid ? "repeat(auto-fill, minmax(320px, 1fr))" : undefined,
          flexDirection: isGrid ? undefined : "column", gap: 1,
        }}>
          {projects.map((p) => <ProjectCard key={p.id} project={p} layout={isGrid} />)}
        </motion.div>
      </LayoutGroup>
    </section>
  );
}
