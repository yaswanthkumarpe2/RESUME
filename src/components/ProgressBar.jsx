import { motion, useScroll, useSpring } from "framer-motion";
import { C } from "../constants/tokens";

export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3,
        background: C.neon, transformOrigin: "0%", scaleX,
        zIndex: 8999,
      }}
    />
  );
}
