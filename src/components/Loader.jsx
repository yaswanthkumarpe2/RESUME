import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { C } from "../constants/tokens";

export default function Loader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 12) + 4;
      if (n >= 100) { n = 100; clearInterval(id); setTimeout(onDone, 400); }
      setCount(n);
    }, 60);
    return () => clearInterval(id);
  }, []);

  const letters = "Yaswanth".split("");

  return (
    <motion.div
      exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
      style={{
        position: "fixed", inset: 0, background: C.black, zIndex: 9000,
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", gap: 32,
      }}
    >
      <div style={{ display: "flex", gap: 4, overflow: "hidden" }}>
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="bebas"
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(48px,10vw,96px)", color: C.white, display: "block" }}
          >
            {l}
          </motion.span>
        ))}
      </div>

      <div style={{ width: "min(400px,80vw)", height: 2, background: C.border, position: "relative" }}>
        <motion.div
          style={{ height: "100%", background: C.neon, originX: 0 }}
          animate={{ scaleX: count / 100 }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>

      <motion.p
        className="mono"
        style={{ fontSize: 13, color: C.neon, letterSpacing: 4 }}
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      >
        {String(count).padStart(3, "0")} / 100
      </motion.p>
    </motion.div>
  );
}
