import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { C } from "../constants/tokens";

export default function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 500, damping: 28 });
  const sy = useSpring(my, { stiffness: 500, damping: 28 });
  const trailX = useSpring(mx, { stiffness: 120, damping: 22 });
  const trailY = useSpring(my, { stiffness: 120, damping: 22 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    const over = (e) => { if (e.target.closest("[data-cursor]")) setHovered(true); };
    const out = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <>
      <motion.div
        style={{
          x: trailX, y: trailY, translateX: "-50%", translateY: "-50%",
          position: "fixed", top: 0, left: 0, width: 40, height: 40,
          border: `1px solid ${C.neon}`, pointerEvents: "none", zIndex: 9999,
          opacity: 0.4,
        }}
        animate={{ scale: hovered ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
      <motion.div
        style={{
          x: sx, y: sy, translateX: "-50%", translateY: "-50%",
          position: "fixed", top: 0, left: 0, width: 8, height: 8,
          background: C.neon, pointerEvents: "none", zIndex: 10000,
        }}
        animate={{ scale: hovered ? 0 : 1 }}
      />
    </>
  );
}
