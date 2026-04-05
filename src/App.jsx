import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import "./App.css";

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
// Split name: line1 = "Uwak", line2 = "Daniel Iniobong."
// Both lines are fixed-height reserved. Only line2 animates.
const useLoopTyping = (line2Full, speed = 65) => {
  const [chars, setChars] = useState("");
  const [phase, setPhase] = useState("typing");
  useEffect(() => {
    let t;
    if (phase === "typing") {
      if (chars.length < line2Full.length) {
        t = setTimeout(
          () => setChars(line2Full.slice(0, chars.length + 1)),
          speed,
        );
      } else {
        t = setTimeout(() => setPhase("pause"), 2400);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("erasing"), 500);
    } else {
      if (chars.length > 0) {
        t = setTimeout(() => setChars(chars.slice(0, -1)), speed * 0.55);
      } else {
        t = setTimeout(() => setPhase("typing"), 500);
      }
    }
    return () => clearTimeout(t);
  }, [chars, phase, line2Full, speed]);
  return chars;
};

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
const CustomCursor = () => {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const curr = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    let raf;
    const loop = () => {
      curr.current.x += (pos.current.x - curr.current.x) * 0.12;
      curr.current.y += (pos.current.y - curr.current.y) * 0.12;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${curr.current.x - 20}px,${curr.current.y - 20}px)`;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
};

/* ═══════════════════════════════════════════
   TECH STACK DATA (colored SVGs via fill)
═══════════════════════════════════════════ */
const stackItems = [
  {
    name: "React",
    pct: 90,
    color: "#61DAFB",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="#61DAFB">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.10.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.10-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9z" />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    pct: 88,
    color: "#F7DF1E",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="#F7DF1E">
        <path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    pct: 82,
    color: "#68A063",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="#68A063">
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.10-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 0 1-.11-.21V7.71c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.22 0L10 19.65c-.03-.02-.07-.02-.1-.01-.42.23-.5.28-.89.4-.1.03-.24.08.06.23l1.67.96c.27.15.58.24.89.24.31 0 .62-.09.89-.24l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47a.226.226 0 0 0-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.11.05-.17C17.56 9.05 16.38 8 14 8z" />
      </svg>
    ),
  },
  {
    name: "PHP",
    pct: 78,
    color: "#777BB4",
    Icon: () => (
      <img src="/php.svg" alt="PHP" style={{ width: "100%", height: "100%" }} />
    ),
  },
  {
    name: "Laravel",
    pct: 75,
    color: "#FF2D20",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="#FF2D20">
        <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 0 1 .375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 0 1 .024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 0 1 .375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.039-.01-.012-.021-.023-.028-.037h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 0 1-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z" />
      </svg>
    ),
  },
  {
    name: "Arduino",
    pct: 65,
    color: "#00979D",
    Icon: () => (
      <img
        src="/arduino.svg"
        alt="Arduino"
        style={{ width: "100%", height: "100%" }}
      />
    ),
  },
  {
    name: "Git",
    pct: 85,
    color: "#F05032",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="#F05032">
        <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 1.847 2.284 1.838 1.838 0 0 1 2.285 1.847l2.658 2.658a1.838 1.838 0 0 1 1.847 2.285 1.838 1.838 0 1 1-3.142-1.284l-2.48-2.48v6.518a1.838 1.838 0 0 1 .486 3.015 1.838 1.838 0 1 1-2.774-2.368V9.285a1.838 1.838 0 0 1-.997-2.408L8.435 4.114.452 12.097a1.55 1.55 0 0 0 0 2.188l10.48 10.479a1.55 1.55 0 0 0 2.188 0l10.426-10.426a1.55 1.55 0 0 0 0-2.188" />
      </svg>
    ),
  },
  {
    name: "Figma",
    pct: 80,
    color: "#F24E1E",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="#F24E1E">
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.02s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.026-4.49 4.515-4.49c2.489 0 4.515 2.014 4.515 4.49S10.661 24 8.172 24zm0-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02-1.354-3.019-3.019-3.019zm7.703 0h-4.588v-1.471h4.588c1.665 0 3.019-1.355 3.019-3.02s-1.354-3.019-3.019-3.019h-4.588V8.981h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49z" />
      </svg>
    ),
  },
];

/* ═══════════════════════════════════════════
   WORKS DATA
═══════════════════════════════════════════ */
const works = [
  {
    name: "Envyra",
    tag: "Landing Pages",
    cat: "web",
    desc: "Green energy company — renewable solutions for residential & commercial clients.",
    url: "envyra.netlify.app",
    color: "#0a1f0e",
    year: "2025",
    role: "UI/UX & Development",
    img: "https://i.ibb.co/0yjxCCdt/Screenshot-2026-04-05-194318.png",
  },
  {
    name: "Zoneod",
    tag: "Landing Pages",
    cat: "web",
    desc: "Fintech & digital payments — card-issuing and financial technology platform.",
    url: "zoneod.netlify.app",
    color: "#0f0f1a",
    year: "2025",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/kV0yDfJ7/Screenshot-2026-04-05-194821.png",
  },
  {
    name: "Nachotopia",
    tag: "Landing Pages",
    cat: "uiux",
    desc: "Pet care services — grooming, boarding, vet, and adoption all in one place.",
    url: "nachotopia.netlify.app",
    color: "#1a0a00",
    year: "2024",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/PGxhX48d/Screenshot-2026-04-05-195038.png",
  },
  {
    name: "host8",
    tag: "Landing Pages",
    cat: "web",
    desc: "Web hosting — cloud infrastructure, VPS, and server solutions for developers.",
    url: "host8.netlify.app",
    color: "#050510",
    year: "2024",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/sxw4CbL/Screenshot-2026-04-05-195319.png",
  },
  {
    name: "Hermoon",
    tag: "Landing Pages",
    cat: "uiux",
    desc: "Luxury hotel & travel booking — handpicked premium accommodations worldwide.",
    url: "hermoon.netlify.app",
    color: "#1a1208",
    year: "2025",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/d4DYkNMG/Screenshot-2026-04-05-195621.png",
  },
  {
    name: "SEATH®",
    tag: "Landing Pages",
    cat: "uiux",
    desc: "Premium real estate agency — residential and investment properties.",
    url: "seath.netlify.app",
    color: "#0d0d0d",
    year: "2025",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/TBFYVn68/Screenshot-2026-04-05-195841.png",
  },
  {
    name: "SyDEWALK",
    tag: "Landing Pages",
    cat: "uiux",
    desc: "Streetwear fashion brand — minimal, editorial, culturally driven aesthetic.",
    url: "sydewalk.netlify.app",
    color: "#0a0a0a",
    year: "2024",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/KxV63Mcs/Screenshot-2026-04-05-200108.png",
  },
  {
    name: "Meerova",
    tag: "Landing Pages",
    cat: "web",
    desc: "Luxury furniture brand — handcrafted timeless pieces, premium materials.",
    url: "meerova.netlify.app",
    color: "#18120e",
    year: "2025",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/9Hv3LX8F/Screenshot-2026-04-05-200320.png",
  },
  {
    name: "Swipeely",
    tag: "Landing Pages",
    cat: "web",
    desc: "Fintech card platform — card issuance and payment infrastructure at speed.",
    url: "swipeely.netlify.app",
    color: "#060616",
    year: "2025",
    role: "UI/UX Design & Development",
    img: "https://i.ibb.co/0pXR5k7m/Screenshot-2026-04-05-200452.png",
  },
  {
    name: "Urban Styles",
    tag: "UI/UX",
    cat: "app",
    desc: "Arduino-based environmental sensor hub with real-time dashboard and MQTT data streaming.",
    url: "—",
    color: "#0d1a0a",
    year: "2026",
    role: "User Interface Designer",
    img: "https://i.ibb.co/whX9XDs6/file-cover-1.png",
  },
  {
    name: "B. Skilled Services",
    tag: "UI/UX",
    cat: "app",
    desc: "Raspberry Pi powered smart access control system with mobile app integration.",
    url: "—",
    color: "#0a0d1a",
    year: "2026",
    role: "User Interface Designer",
    img: "https://i.ibb.co/Ng9RXdgK/file-cover-1.png",
  },
  {
    name: "Ciix",
    tag: "UI/UX",
    cat: "app",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "—",
    color: "#0a0a0a",
    year: "2025",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Drivon",
    tag: "UI/UX",
    cat: "web",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "drivon.org",
    color: "#0a0a0a",
    year: "2026",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Prior Gold Studios",
    tag: "UI/UX",
    cat: "app",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "priorgoldstudios.com",
    color: "#0a0a0a",
    year: "2026",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Techsavy Hub",
    tag: "UI/UX",
    cat: "web",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "techsavyhub.ng",
    color: "#0a0a0a",
    year: "2025",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Paylab",
    tag: "UI/UX",
    cat: "app",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "—",
    color: "#0a0a0a",
    year: "2024",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Coopride",
    tag: "UI/UX",
    cat: "app",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "—",
    color: "#0a0a0a",
    year: "2024",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Naicash",
    tag: "UI/UX",
    cat: "app",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "—",
    color: "#0a0a0a",
    year: "2023",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Stones HQ website",
    tag: "UI/UX",
    cat: "web",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "—",
    color: "#0a0a0a",
    year: "2025",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    name: "Alsa Logistics",
    tag: "UI/UX",
    cat: "app",
    desc: "You're looking at it — designed and built with React, Framer Motion, and precision.",
    url: "—",
    color: "#0a0a0a",
    year: "2023",
    role: "User Interface Designer",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
];

const PROJECT_TABS = ["All", "Landing Pages", "Web Apps", "UI/UX", "IoT"];
const PAGE_SIZE = 6;

/* ═══════════════════════════════════════════
   SERVICES DATA
═══════════════════════════════════════════ */
const services = [
  {
    icon: "🌐",
    title: "Web App Development",
    desc: "Full-stack web applications built with React, Node.js, and Laravel — scalable, fast, and production-ready.",
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    desc: "Clean, user-centered interfaces that convert — from wireframes to polished Figma prototypes and pixel-perfect implementation.",
  },
  {
    icon: "🔗",
    title: "API Integration",
    desc: "Seamless third-party API connections — REST, GraphQL, webhooks. I make systems talk to each other reliably.",
  },
  {
    icon: "💳",
    title: "Payment Systems",
    desc: "Stripe, Paystack, Flutterwave, and custom card issuance. Payment infrastructure is a core strength — built and shipped on 3+ fintech products.",
  },
  {
    icon: "📡",
    title: "IoT Development",
    desc: "Arduino and Raspberry Pi solutions — sensor networks, real-time dashboards, MQTT messaging, and hardware-software bridges.",
  },
  {
    icon: "🖥️",
    title: "Hosting & Deployment",
    desc: "CI/CD pipelines, cloud deployment on Vercel, Railway, and DigitalOcean. I make sure your product stays up and runs smooth.",
  },
];

/* ═══════════════════════════════════════════
   PROCESS STEPS
═══════════════════════════════════════════ */
const processSteps = [
  {
    num: "01",
    title: "Discovery",
    desc: "Deep-dive into your goals, target audience, and technical requirements. I ask the right questions so nothing is built on assumptions.",
  },
  {
    num: "02",
    title: "Wireframe",
    desc: "Low-fidelity layouts that map user flows and information architecture before a single line of code is written.",
  },
  {
    num: "03",
    title: "Design",
    desc: "High-fidelity UI in Figma — every pixel intentional, every interaction considered. You approve before development starts.",
  },
  {
    num: "04",
    title: "Development",
    desc: "Clean, maintainable code. Components built to last. Regular check-ins so you see progress — not just a final reveal.",
  },
  {
    num: "05",
    title: "Testing",
    desc: "Cross-device, cross-browser quality assurance. Performance audits, accessibility checks, and edge-case handling.",
  },
  {
    num: "06",
    title: "Deployment",
    desc: "Smooth launch with CI/CD pipelines, monitoring, and post-launch support. I don't disappear after shipping.",
  },
];

/* ═══════════════════════════════════════════
   MAC MOCKUP
═══════════════════════════════════════════ */
const MacMockup = ({ url, color, img }) => (
  <div className="mac-mockup">
    <div className="mac-bar">
      <div className="mac-dots">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
      </div>
      <div className="mac-address">
        <span>{url}</span>
      </div>
    </div>
    <div
      className="mac-screen"
      style={{ background: color, position: "relative", overflow: "hidden" }}
    >
      {img ? (
        <img
          src={img}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.85,
            display: "block",
          }}
        />
      ) : (
        <div className="mock-inner">
          <div className="mock-topbar">
            <div className="mock-logo" />
            <div className="mock-links">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="mock-body">
            <div className="mock-h1" />
            <div className="mock-h2" />
            <div className="mock-h2 short" />
            <div className="mock-btn" />
          </div>
        </div>
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   PROJECT DRAWER (fixed bug: key on AnimatePresence child)
═══════════════════════════════════════════ */
const ProjectDrawer = ({ work, onClose, onNavigate }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };
  const idx = works.indexOf(work);

  return (
    <>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      />
      <motion.aside
        className="drawer-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 34, mass: 0.85 }}
      >
        <div className="drawer-topbar">
          <div className="drawer-eyebrow">
            <span className="drawer-index">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="drawer-tag-top">{work.tag}</span>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 1l14 14M15 1L1 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="drawer-body">
          <motion.div
            className="drawer-content"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={item} className="drawer-mockup">
              <MacMockup url={work.url} color={work.color} img={work.img} />
            </motion.div>
            <motion.h2 variants={item} className="drawer-title">
              {work.name}
            </motion.h2>
            <motion.div variants={item} className="drawer-meta">
              <div className="drawer-meta-item">
                <span className="drawer-meta-label">Year</span>
                <span className="drawer-meta-value">{work.year}</span>
              </div>
              <div className="drawer-meta-item">
                <span className="drawer-meta-label">Role</span>
                <span className="drawer-meta-value">{work.role}</span>
              </div>
              <div className="drawer-meta-item">
                <span className="drawer-meta-label">URL</span>
                <span className="drawer-meta-value">{work.url}</span>
              </div>
            </motion.div>
            <motion.div variants={item} className="drawer-divider" />
            <motion.div variants={item} className="drawer-section">
              <span className="drawer-section-label">About the project</span>
              <p className="drawer-section-text">{work.desc}</p>
            </motion.div>
            <motion.div variants={item} className="drawer-cta">
              {work.url !== "—" && (
                <a
                  href={`https://${work.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drawer-visit"
                >
                  Visit Live Site{" "}
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 12L12 2M12 2H5M12 2V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
              <button className="drawer-dismiss" onClick={onClose}>
                Close
              </button>
            </motion.div>
            <motion.div variants={item} className="drawer-nav">
              <button
                className={`drawer-nav-btn ${idx === 0 ? "disabled" : ""}`}
                disabled={idx === 0}
                onClick={() => idx > 0 && onNavigate(works[idx - 1])}
              >
                ← {idx > 0 ? works[idx - 1].name : "—"}
              </button>
              <button
                className={`drawer-nav-btn right ${idx === works.length - 1 ? "disabled" : ""}`}
                disabled={idx === works.length - 1}
                onClick={() =>
                  idx < works.length - 1 && onNavigate(works[idx + 1])
                }
              >
                {idx < works.length - 1 ? works[idx + 1].name : "—"} →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

/* ═══════════════════════════════════════════
   SKILL BAR (animated on enter)
═══════════════════════════════════════════ */
const SkillBar = ({ pct, color, delay }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setWidth(pct), delay * 1000);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div className="skill-bar-track" ref={ref}>
      <div
        className="skill-bar-fill"
        style={{
          width: `${width}%`,
          background: color,
          transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null); // for mobile nav yellow highlight
  const [activeWork, setActiveWork] = useState(null);
  const [drawerKey, setDrawerKey] = useState(0);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
    sent: false,
  });
  const [showFab, setShowFab] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // for process glow sequence

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  // line2 animates; "Uwak" is always visible on line1
  const line2 = useLoopTyping("Daniel Iniobong.", 68);

  // highlight "Daniel" in accent if it appears in the typed string
  const renderLine2 = (str) => {
    if (!str) return <span className="cursor">|</span>;
    const danielEnd =
      str.indexOf("Daniel") >= 0 ? str.indexOf("Daniel") + 6 : -1;
    const showCursor = <span className="cursor">|</span>;
    if (danielEnd < 0)
      return (
        <>
          {str}
          {showCursor}
        </>
      );
    const before = str.slice(0, str.indexOf("Daniel"));
    const daniel = str.slice(str.indexOf("Daniel"), danielEnd);
    const after = str.slice(danielEnd);
    return (
      <>
        {before}
        <span className="name-accent">{daniel}</span>
        {after}
        {showCursor}
      </>
    );
  };

  // Filtered + paginated works
  const filtered =
    activeTab === "All" ? works : works.filter((w) => w.tag === activeTab);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openDrawer = (w) => {
    setActiveWork(w);
    setDrawerKey((k) => k + 1);
  };
  const closeDrawer = () => setActiveWork(null);
  const navDrawer = (w) => {
    setActiveWork(null);
    setTimeout(() => {
      setActiveWork(w);
      setDrawerKey((k) => k + 1);
    }, 60);
  };

  const handleTabChange = (t) => {
    setActiveTab(t);
    setPage(1);
  };

  // Mobile nav: flash yellow → animate menu out → scroll to section
  const handleMobileNav = (item) => {
    setActiveLink(item);
    // Small delay so yellow flash is visible before exit starts
    setTimeout(() => {
      setMenuOpen(false);
      // Scroll after exit animation completes (~520ms)
      setTimeout(() => {
        const target = document.getElementById(item.toLowerCase());
        if (target) target.scrollIntoView({ behavior: "smooth" });
        setActiveLink(null);
      }, 520);
    }, 180);
  };

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // FAB: show when scrolled past hero
  useEffect(() => {
    const onScroll = () =>
      setShowFab(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Process glow: cycle through steps every 3s
  useEffect(() => {
    const iv = setInterval(() => {
      setActiveStep((s) => (s + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    const { name, email, service, budget, message } = formState;
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\n\n${message}`,
    );
    window.location.href = `mailto:dannycodesltd@gmail.com?subject=Project Enquiry from ${name}&body=${body}`;
    setFormState((s) => ({ ...s, sent: true }));
  };

  const navItems = [
    "Home",
    "About",
    "Stack",
    "Projects",
    "Services",
    "Process",
    "Connect",
    "Contact",
  ];

  return (
    <div className="app">
      <CustomCursor />
      <motion.div className="scroll-bar" style={{ scaleX }} />

      {/* DRAWER */}
      <AnimatePresence>
        {activeWork && (
          <ProjectDrawer
            key={drawerKey}
            work={activeWork}
            onClose={closeDrawer}
            onNavigate={navDrawer}
          />
        )}
      </AnimatePresence>

      {/* ══ NAV ══ */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#home" className="nav-brand">
            <img src="/signature.svg" alt="Uwak Daniel" className="signature" />
          </a>

          {/* Pill nav — desktop */}
          <div className="nav-pill-wrap">
            <div className="nav-pill">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="nav-pill-link"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <a href="#contact" className="nav-cta-btn">
            Hire Me ↗
          </a>

          <button
            className={`burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="menu"
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu — outside <nav> so pointer-events:none doesn't block it */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.3, delay: navItems.length * 0.045 },
            }}
          >
            <button
              className="mobile-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M1 1l18 18M19 1L1 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="mobile-menu-links">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`mobile-link ${activeLink === item ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMobileNav(item);
                  }}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.08 + i * 0.055,
                      ease: [0.16, 1, 0.3, 1],
                      duration: 0.5,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: 60,
                    transition: {
                      delay: (navItems.length - 1 - i) * 0.045,
                      ease: [0.4, 0, 1, 1],
                      duration: 0.32,
                    },
                  }}
                >
                  <span className="mobile-link-num">0{i + 1}</span>
                  {item}
                </motion.a>
              ))}
            </div>
            <motion.div
              className="mobile-menu-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.55 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <span>dannycodesltd@gmail.com</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section id="home" className="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hero-badge"
          >
            <span className="badge-dot" />
            Available for projects
          </motion.div>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-line1">Uwak</span>
            <span className="hero-line2">{renderLine2(line2)}</span>
          </motion.h1>
          <motion.div
            className="hero-roles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              "Software Engineer",
              "UI/UX Designer",
              "Applied Physics Student @ UNILAG",
              "Aspiring Firmware Engineer",
            ].map((r, i) => (
              <span key={i} className="role-chip">
                {r}
              </span>
            ))}
          </motion.div>
          <motion.div
            className="hero-avatar-wrap"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="avatar-ring">
              <div className="avatar-inner">
                <img
                  src="/avatar.jpeg"
                  alt="Uwak Daniel"
                  className="avatar-img"
                />
              </div>
            </div>
            <div className="avatar-glow" />
          </motion.div>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            I build scalable digital systems with clean architecture
            <br />
            and ship them with precision.
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="btn-primary"
              onClick={() =>
                document
                  .getElementById("projects")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              View Works <span className="btn-arrow">↗</span>
            </button>
            <button
              className="btn-ghost"
              onClick={() =>
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Get in Touch
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="section">
        <div className="container">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line" />
            01 — About
          </motion.div>
          <div className="about-layout">
            <motion.div
              className="about-heading"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2>
                Building at the
                <br />
                <em>intersection</em>
                <br />
                of code & physics.
              </h2>
            </motion.div>
            <motion.div
              className="about-body"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <p>
                I approach technology as an engineering discipline — focused on{" "}
                <strong>
                  architecture, scalability, and long-term maintainability
                </strong>
                . As an Applied Physics student at the University of Lagos, I
                blend scientific problem-solving with software development.
              </p>
              <p>
                My experience spans{" "}
                <strong>
                  full-stack development, UI/UX design, and backend systems
                </strong>
                , while I actively grow into embedded systems and firmware
                engineering. Every Arduino project sharpens my understanding of
                timing, interrupts, and real hardware constraints.
              </p>
              <p>
                Whether designing interfaces, structuring APIs, or debugging
                microcontroller code — I turn complex problems into elegant,
                reliable solutions.
              </p>
              <div className="about-stats">
                {[
                  ["25+", "Client Projects"],
                  ["4+", "Years Building"],
                  ["2", "Domains Mastered"],
                ].map(([n, l]) => (
                  <div key={l} className="stat">
                    <span className="stat-num">{n}</span>
                    <span className="stat-label">{l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TECH STACK ══ */}
      <section id="stack" className="section section-alt">
        <div className="container">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line" />
            02 — Tech Stack
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Tools I work with
          </motion.h2>

          <div className="stack-grid">
            {stackItems.map((s, i) => (
              <motion.div
                key={s.name}
                className="stack-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
              >
                <div
                  className="stack-icon-wrap"
                  style={{ "--tech-color": s.color }}
                >
                  <div className="stack-icon">
                    <s.Icon />
                  </div>
                </div>
                <div className="stack-info">
                  <div className="stack-name-row">
                    <span className="stack-name">{s.name}</span>
                    <span className="stack-pct" style={{ color: s.color }}>
                      {s.pct}%
                    </span>
                  </div>
                  <SkillBar pct={s.pct} color={s.color} delay={i * 0.08} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line" />
            03 — Projects
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Selected client work
          </motion.h2>

          {/* Tabs */}
          <div className="proj-tabs">
            {PROJECT_TABS.map((t) => (
              <button
                key={t}
                className={`proj-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => handleTabChange(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + page}
              className="works-grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {paged.map((work, i) => (
                <motion.div
                  key={work.name}
                  className="work-card"
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  onClick={() => openDrawer(work)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openDrawer(work)}
                >
                  <div className="work-preview">
                    <MacMockup
                      url={work.url}
                      color={work.color}
                      img={work.img}
                    />
                    <div className="work-overlay">
                      <span className="visit-btn">View Details ↗</span>
                    </div>
                  </div>
                  <div className="work-meta">
                    <div className="work-top">
                      <h3 className="work-title">{work.name}</h3>
                      <span className="work-tag">{work.tag}</span>
                    </div>
                    <p className="work-desc">{work.desc}</p>
                    <span className="work-url">{work.url}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <div className="page-dots">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-dot ${page === i + 1 ? "active" : ""}`}
                    onClick={() => setPage(i + 1)}
                  />
                ))}
              </div>
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="section section-alt">
        <div className="container">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line" />
            04 — Services
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            What I build for you
          </motion.h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className="service-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
              >
                <span className="service-icon">{s.icon}</span>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section id="process" className="section">
        <div className="container">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line" />
            05 — Process
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            How I work
          </motion.h2>
          <div className="process-track">
            {processSteps.map((s, i) => (
              <motion.div
                key={s.num}
                className={`process-step ${activeStep === i ? "glow" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="process-num">{s.num}</div>
                <div className="process-body">
                  <h3 className="process-title">{s.title}</h3>
                  <p className="process-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONNECT (CV + Socials + Calendly) ══ */}
      <section id="connect" className="section section-alt">
        <div className="container">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line" />
            06 — Connect
          </motion.div>
          <div className="connect-layout">
            <motion.div
              className="connect-left"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="connect-heading">
                Let's stay
                <br />
                <em>connected.</em>
              </h2>
              <p className="connect-sub">
                Download my CV, follow my work, or book a 30-minute discovery
                call — no strings attached.
              </p>
              <a
                href="/UwakDanielCV.pdf"
                download
                className="btn-primary cv-btn"
              >
                Download CV <span className="btn-arrow">↓</span>
              </a>
              <div className="schedule-box">
                <span className="schedule-label">
                  📅 Book a free 30-min call
                </span>
                <a
                  href="https://calendly.com/dannycodesltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost schedule-btn"
                >
                  Schedule via Calendly →
                </a>
              </div>
            </motion.div>
            <motion.div
              className="connect-right"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="socials-label">Find me on</span>
              <div className="socials-grid">
                {[
                  {
                    name: "GitHub",
                    href: "https://github.com",
                    color: "#ffffff",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="18"
                        height="18"
                      >
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    ),
                  },
                  {
                    name: "Dribbble",
                    href: "https://dribbble.com",
                    color: "#EA4C89",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="18"
                        height="18"
                      >
                        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.827-1.74C7.27 11.535 2.51 11.47 2.07 11.467l-.002.03c0 2.216.787 4.252 2.083 5.855zm-2.01-7.138c.457.005 4.52.053 9.535-1.247C10.92 4.1 9.94 2.43 9.81 2.22 6.667 3.29 4.09 5.55 2.372 8.51zm9.44-6.17c.135.234 1.14 1.914 2.056 4.06 3.09-1.16 4.4-2.92 4.553-3.155C16.88 1.784 14.56.902 12.015.91l-.003.34zm4.73 4.452c-.18.245-1.655 2.132-4.84 3.448.205.42.402.845.572 1.273.063.148.124.3.183.45 3.394-.426 6.77.257 7.1.325-.024-2.24-.82-4.3-2.016-5.496z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Instagram",
                    href: "https://instagram.com",
                    color: "#E1306C",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="18"
                        height="18"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                  },
                  {
                    name: "WhatsApp",
                    href: "https://wa.me/2348000000000",
                    color: "#25D366",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="18"
                        height="18"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Twitter",
                    href: "https://twitter.com",
                    color: "#1DA1F2",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="18"
                        height="18"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card"
                    style={{ "--sc": s.color }}
                  >
                    <span
                      className="social-icon-svg"
                      style={{ color: s.color }}
                    >
                      {s.icon}
                    </span>
                    <span className="social-name">{s.name}</span>
                    <span className="social-arrow">↗</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <motion.div
            className="contact-inner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-label">
              <span className="label-line" />
              07 — Contact
            </div>
            <h2 className="contact-heading">
              Let's build something
              <br />
              <em>remarkable</em> together.
            </h2>
            <p className="contact-sub">
              Tell me about your project and I'll get back within 24 hours.
            </p>
            <form className="contact-form" onSubmit={handleSend}>
              <div className="form-row">
                <div className="field">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, email: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Service Needed</label>
                  <select
                    value={formState.service}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, service: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select a service…</option>
                    <option>Web App Development</option>
                    <option>UI/UX Design</option>
                    <option>API Integration</option>
                    <option>Payment Systems</option>
                    <option>IoT Development</option>
                    <option>Hosting & Deployment</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label>Budget Range</label>
                  <select
                    value={formState.budget}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, budget: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select budget…</option>
                    <option>Under $500</option>
                    <option>$500 – $1,500</option>
                    <option>$1,500 – $5,000</option>
                    <option>$5,000 – $15,000</option>
                    <option>$15,000+</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea
                  placeholder="Describe your project — the more detail, the better."
                  rows="5"
                  value={formState.message}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, message: e.target.value }))
                  }
                  required
                />
              </div>
              {formState.sent ? (
                <div className="sent-msg">
                  ✅ Opening your email client — message ready to send!
                </div>
              ) : (
                <button type="submit" className="btn-primary">
                  Send Message <span className="btn-arrow">→</span>
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* ══ SCROLL TO TOP FAB ══ */}
      <AnimatePresence>
        {showFab && (
          <motion.button
            className="fab-top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 15V3M3 9l6-6 6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-copy">© 2026 Uwak Daniel Iniobong</span>
          <span className="footer-built">Built with React & Framer Motion</span>
          <span className="footer-tag">Engineered with precision.</span>
        </div>
      </footer>
    </div>
  );
}
