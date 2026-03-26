import { C } from "../constants/tokens";

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&display=swap');

      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

      :root {
        --black: ${C.black};
        --white: ${C.white};
        --neon:  ${C.neon};
        --red:   ${C.red};
        --blue:  ${C.blue};
      }

      html {
        scroll-behavior: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      body {
        background: var(--black);
        color: var(--white);
        font-family: 'Syne', sans-serif;
        font-weight: 400;
        line-height: 1.6;
        overflow-x: hidden;
        cursor: none;
      }

      a { color: inherit; text-decoration: none; }
      button { font-family: inherit; }
      img, video { display: block; max-width: 100%; }

      ::selection { background: var(--neon); color: var(--black); }

      ::-webkit-scrollbar       { width: 3px; }
      ::-webkit-scrollbar-track { background: var(--black); }
      ::-webkit-scrollbar-thumb { background: var(--neon); border-radius: 0; }

      .bebas { font-family: 'Bebas Neue', sans-serif; }
      .mono  { font-family: 'IBM Plex Mono', monospace; }
      .syne  { font-family: 'Syne', sans-serif; }
      .clip  { overflow: hidden; }
      .sr-only {
        position: absolute; width: 1px; height: 1px;
        overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;
      }
    `}</style>
  );
}