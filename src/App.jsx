import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import GlobalStyle from "./components/GlobalStyle";
import Cursor from "./components/Cursor";
import ProgressBar from "./components/ProgressBar";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Skills from "./components/Skills";
import TechTicker from "./components/TechTicker";
import Projects from "./components/Projects";
import OpenSource from "./components/OpenSource";
import Certs from "./components/Certs";
import Contact from "./components/Contact";
import { C } from "./constants/tokens";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ background: C.black, minHeight: "100vh" }}>
      <GlobalStyle />
      <Cursor />
      <ProgressBar />

      <AnimatePresence mode="wait">
        {!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar />
            <Hero />
            <Marquee items={["REACT", "NODE.JS", "FRAMER", "GSAP", "POSTGRES", "REDIS", "DOCKER", "WEBRTC"]} />
            <About />
            <Skills />
            <TechTicker />
            <Projects />
            <OpenSource />
            <Certs />
            <Contact />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
