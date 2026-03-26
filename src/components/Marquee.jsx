import { motion } from "framer-motion";
import { C } from "../constants/tokens";

export default function Marquee({ items, speed = 30, reverse = false }) {
  return (
    <div style={{
      overflow: "hidden", borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`, padding: "12px 0",
    }}>
      <motion.div
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        style={{ display: "flex", width: "max-content" }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="bebas"
            style={{
              fontSize: 48, color: i % 3 === 0 ? C.neon : C.border,
              paddingRight: 48, letterSpacing: 4, whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
