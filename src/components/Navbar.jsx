import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "../constants/tokens";

const NAV_LINKS = ["home", "projects", "certificates", "open source", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setResumeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (id) => {
    const sectionMap = {
      home: 0,
      projects: document.querySelector("section:nth-of-type(5)")?.offsetTop,
      certificates: document.querySelector("section:nth-of-type(7)")?.offsetTop,
      "open source": document.querySelector("section:nth-of-type(6)")?.offsetTop,
      contact: document.querySelector("section:nth-of-type(8)")?.offsetTop,
    };
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: sectionMap[id] || 0, behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 8000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 6vw",
        height: 56,
        background: scrolled ? "rgba(10,10,10,0.92)" : C.black,
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Logo */}
      <motion.span
        className="mono"
        data-cursor
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        whileHover={{ color: C.neon }}
        style={{
          fontSize: 13, color: C.neon, letterSpacing: 2,
          cursor: "none", userSelect: "none", fontWeight: 700,
        }}
      >
        &gt;_ Yaswanth.dev
      </motion.span>

      {/* Nav links + Resume */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {NAV_LINKS.map((link) => (
          <motion.button
            key={link}
            data-cursor
            onClick={() => scrollTo(link)}
            whileHover={{ color: C.neon }}
            style={{
              background: "none", border: "none", color: "#888",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, letterSpacing: 2, textTransform: "lowercase",
              cursor: "none", padding: "4px 0", transition: "color 0.2s",
            }}
          >
            {link}
          </motion.button>
        ))}

        {/* Resume dropdown */}
        <div ref={dropRef} style={{ position: "relative" }}>
          <motion.button
            data-cursor
            onClick={() => setResumeOpen((v) => !v)}
            whileHover={{ borderColor: C.neon, color: C.neon }}
            style={{
              background: resumeOpen ? C.neon : "transparent",
              border: `1px solid ${resumeOpen ? C.neon : "#444"}`,
              color: resumeOpen ? C.black : "#aaa",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
              cursor: "none", padding: "7px 18px",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
          >
            RESUME
            <motion.span
              animate={{ rotate: resumeOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: "inline-block", lineHeight: 1 }}
            >
              ▾
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {resumeOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: C.mid, border: `1px solid ${C.border}`,
                  minWidth: 180, transformOrigin: "top right", overflow: "hidden",
                }}
              >
                {[
                  { label: "👁  SEE CV", action: "view" },
                  { label: "↓  DOWNLOAD", action: "download" },
                ].map(({ label, action }) => (
                  <motion.button
                    key={action}
                    data-cursor
                    onClick={() => {
                      setResumeOpen(false);
                      if (action === "view") {
                        window.open("/CVPORTFOLIO.pdf", "_blank");
                      } else {
                        const a = document.createElement("a");
                        a.href = "/CVPORTFOLIO.pdf";
                        a.download = "Yaswanth_Resume.pdf";
                        a.click();
                      }
                    }}
                    whileHover={{ background: C.neon, color: C.black }}
                    style={{
                      display: "block", width: "100%", background: "none",
                      border: "none", borderBottom: `1px solid ${C.border}`,
                      color: "#aaa", fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
                      cursor: "none", padding: "14px 20px", textAlign: "left",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
