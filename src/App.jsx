import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import "./App.css";

// ── Typing Hook ──
const useTypingEffect = (text, speed = 65, startDelay = 900) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    setIsDone(false);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayedText(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setIsDone(true);
        }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { displayedText, isDone };
};

// ── Custom Cursor ──
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

// ── Tech SVGs ──
const TechLogos = {
  React: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.10.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.10-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9z" />
    </svg>
  ),
  JavaScript: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z" />
    </svg>
  ),
  Node: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.10-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 0 1-.11-.21V7.71c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.22 0L10 19.65c-.03-.02-.07-.02-.1-.01-.42.23-.5.28-.89.4-.1.03-.24.08.06.23l1.67.96c.27.15.58.24.89.24.31 0 .62-.09.89-.24l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47a.226.226 0 0 0-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.11.05-.17C17.56 9.05 16.38 8 14 8z" />
    </svg>
  ),
  PHP: () => <img src="/php.svg" alt="" className="tech-img" />,
  Laravel: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 0 1 .375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 0 1 .024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 0 1 .375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.039-.01-.012-.021-.023-.028-.037h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 0 1-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z" />
    </svg>
  ),
  Arduino: () => <img src="/arduino.svg" alt="" className="tech-img" />,
  Git: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 1.847 2.284 1.838 1.838 0 0 1 2.285 1.847l2.658 2.658a1.838 1.838 0 0 1 1.847 2.285 1.838 1.838 0 1 1-3.142-1.284l-2.48-2.48v6.518a1.838 1.838 0 0 1 .486 3.015 1.838 1.838 0 1 1-2.774-2.368V9.285a1.838 1.838 0 0 1-.997-2.408L8.435 4.114.452 12.097a1.55 1.55 0 0 0 0 2.188l10.48 10.479a1.55 1.55 0 0 0 2.188 0l10.426-10.426a1.55 1.55 0 0 0 0-2.188" />
    </svg>
  ),
};

// ── Data ──
const works = [
  {
    name: "Envyra",
    tag: "Green Energy",
    description:
      "A bold and modern green energy company website designed to showcase renewable energy solutions, communicate sustainability values, and attract both residential and commercial clients looking to transition to cleaner, smarter power sources.",
    url: "envyra.netlify.app",
    color: "#0a1f0e",
    year: "2025",
    role: "UI/UX Design & Development",
  },
  {
    name: "Zoneod",
    tag: "Fintech",
    description:
      "A sleek and professional fintech and digital payments platform website built to present a card-issuing and financial technology product, helping businesses and developers understand capabilities and get started with integrations.",
    url: "zoneod.netlify.app",
    color: "#0f0f1a",
    year: "2025",
    role: "Full-stack Development",
  },
  {
    name: "Nachotopia",
    tag: "Pet Care",
    description:
      "A warm, colorful, and playful pet care services website crafted to connect pet owners with grooming, boarding, veterinary, and adoption services, making it easy and enjoyable for people to find trusted care for their animals.",
    url: "nachotopia.netlify.app",
    color: "#1a0a00",
    year: "2024",
    role: "UI/UX Design & Development",
  },
  {
    name: "host8",
    tag: "Web Hosting",
    description:
      "A dark, high-tech web hosting company website designed to appeal to developers, startups, and enterprises looking for reliable cloud infrastructure, VPS hosting, and server solutions with a strong emphasis on performance.",
    url: "host8.netlify.app",
    color: "#050510",
    year: "2024",
    role: "Frontend Development",
  },
  {
    name: "Hermoon",
    tag: "Luxury Travel",
    description:
      "An elegant and refined luxury hotel and travel booking website crafted to help travelers discover handpicked premium accommodations around the world, with a clean editorial aesthetic that inspires trust and effortless booking.",
    url: "hermoon.netlify.app",
    color: "#1a1208",
    year: "2025",
    role: "UI/UX Design & Development",
  },
  {
    name: "SEATH®",
    tag: "Real Estate",
    description:
      "A sophisticated and architectural real estate agency website built to position the brand as a premium property firm, attracting high-net-worth buyers, sellers, and investors seeking residential and investment properties.",
    url: "seath.netlify.app",
    color: "#0d0d0d",
    year: "2025",
    role: "Brand & Web Design",
  },
  {
    name: "SyDEWALK",
    tag: "Fashion",
    description:
      "A dark, editorial, and culturally driven streetwear fashion brand website designed to speak directly to style-conscious consumers who value quiet confidence, minimalist aesthetics, and clothing built for people who move with intent.",
    url: "sydewalk.netlify.app",
    color: "#0a0a0a",
    year: "2024",
    role: "Brand Identity & Web Design",
  },
  {
    name: "Meerova",
    tag: "Luxury Furniture",
    description:
      "A refined and visually stunning luxury furniture brand website created to showcase handcrafted, timeless furniture pieces, communicating the brand's commitment to precision craftsmanship, premium materials, and minimalist design.",
    url: "meerova.netlify.app",
    color: "#18120e",
    year: "2025",
    role: "UI/UX Design & Development",
  },
  {
    name: "Swipeely",
    tag: "Fintech",
    description:
      "A modern and feature-rich fintech digital card platform website built to attract developers, startups, and businesses who want to integrate card issuance, payment processing, and financial infrastructure with speed and simplicity.",
    url: "swipeely.netlify.app",
    color: "#060616",
    year: "2025",
    role: "Frontend Development",
  },
];

const techs = [
  { name: "React", Icon: TechLogos.React },
  { name: "JavaScript", Icon: TechLogos.JavaScript },
  { name: "Node.js", Icon: TechLogos.Node },
  { name: "PHP", Icon: TechLogos.PHP },
  { name: "Laravel", Icon: TechLogos.Laravel },
  { name: "Arduino", Icon: TechLogos.Arduino },
  { name: "Git", Icon: TechLogos.Git },
];

const arduinoExperiments = [
  {
    date: "Nov 2024",
    title: "LED Matrix Display",
    description:
      "Built 8×8 LED matrix controller. Explored multiplexing and timing control at a hardware level.",
    components: ["Arduino Uno", "MAX7219", "LEDs"],
  },
  {
    date: "Dec 2024",
    title: "Temperature Monitor",
    description:
      "DHT22 sensor with LCD display integration. Hands-on with I2C communication protocols.",
    components: ["Arduino Nano", "DHT22", "16×2 LCD"],
  },
  {
    date: "Jan 2025",
    title: "Motor Controller",
    description:
      "PWM-based DC motor speed control. Understanding H-bridge circuits and feedback loops.",
    components: ["Arduino Mega", "L298N", "Encoders"],
  },
];

// ── Mac Mockup ──
const MacMockup = ({ url, color }) => (
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
    <div className="mac-screen" style={{ background: color }}>
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
    </div>
  </div>
);

// ── Project Drawer ──
const ProjectDrawer = ({ work, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  };
  const item = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <AnimatePresence>
      {work && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 32,
              mass: 0.9,
            }}
          >
            {/* Top bar */}
            <div className="drawer-topbar">
              <div className="drawer-eyebrow">
                <span className="drawer-index">
                  {String(works.indexOf(work) + 1).padStart(2, "0")}
                </span>
                <span className="drawer-tag-top">{work.tag}</span>
              </div>
              <button
                className="drawer-close"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M1 1L17 17M17 1L1 17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="drawer-body">
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="drawer-content"
              >
                {/* Mockup */}
                <motion.div variants={item} className="drawer-mockup">
                  <MacMockup url={work.url} color={work.color} />
                </motion.div>

                {/* Title */}
                <motion.h2 variants={item} className="drawer-title">
                  {work.name}
                </motion.h2>

                {/* Meta row */}
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

                {/* Divider */}
                <motion.div variants={item} className="drawer-divider" />

                {/* Description */}
                <motion.div variants={item} className="drawer-section">
                  <span className="drawer-section-label">
                    About the project
                  </span>
                  <p className="drawer-section-text">{work.description}</p>
                </motion.div>

                {/* CTA */}
                <motion.div variants={item} className="drawer-cta">
                  <a
                    href={`https://${work.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="drawer-visit"
                  >
                    <span>Visit Live Site</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 12L12 2M12 2H5M12 2V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <button className="drawer-dismiss" onClick={onClose}>
                    Close
                  </button>
                </motion.div>

                {/* Nav between projects */}
                <motion.div variants={item} className="drawer-nav">
                  {(() => {
                    const idx = works.indexOf(work);
                    const prev = works[idx - 1];
                    const next = works[idx + 1];
                    return (
                      <>
                        <button
                          className={`drawer-nav-btn ${!prev ? "disabled" : ""}`}
                          onClick={() => prev && onClose(prev)}
                          disabled={!prev}
                        >
                          ← {prev ? prev.name : "—"}
                        </button>
                        <button
                          className={`drawer-nav-btn ${!next ? "disabled" : ""}`}
                          onClick={() => next && onClose(next)}
                          disabled={!next}
                        >
                          {next ? next.name : "—"} →
                        </button>
                      </>
                    );
                  })()}
                </motion.div>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Main App ──
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeWork, setActiveWork] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { displayedText, isDone } = useTypingEffect(
    "Uwak Daniel Iniobong.",
    65,
    900,
  );

  const navItems = ["Home", "About", "Stack", "Projects", "BTS", "Contact"];

  // Handle drawer navigation (prev/next)
  const handleDrawerClose = (nextWork) => {
    if (nextWork && typeof nextWork === "object") {
      setActiveWork(null);
      setTimeout(() => setActiveWork(nextWork), 80);
    } else {
      setActiveWork(null);
    }
  };

  return (
    <div className="app">
      <CustomCursor />
      <motion.div className="scroll-bar" style={{ scaleX }} />

      {/* Drawer */}
      <AnimatePresence mode="wait">
        {activeWork && (
          <ProjectDrawer
            key={activeWork.name}
            work={activeWork}
            onClose={handleDrawerClose}
          />
        )}
      </AnimatePresence>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#home" className="nav-brand">
            <img src="/signature.svg" alt="signature" className="signature" />
          </a>
          <button
            className={`burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="menu"
          >
            <span />
            <span />
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="nav-link"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-badge"
          >
            <span className="badge-dot" />
            Available for projects
          </motion.div>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {displayedText}
            {!isDone && <span className="cursor">|</span>}
          </motion.h1>
          <motion.div
            className="hero-roles"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              "Software Engineer",
              "UI/UX Designer",
              "Physics Student @ UNILAG",
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
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            I build scalable digital systems with clean architecture
            <br />
            and ship them with precision.
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="scroll-line" />
          <span>scroll</span>
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
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
                  ["9+", "Client Projects"],
                  ["3+", "Years Building"],
                  ["2", "Domains Mastered"],
                ].map(([num, label]) => (
                  <div key={label} className="stat">
                    <span className="stat-num">{num}</span>
                    <span className="stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
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
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Tools I work with
          </motion.h2>
          <div className="marquee-track">
            <div className="marquee-fade left" />
            <div className="marquee-fade right" />
            <motion.div
              className="marquee-inner"
              animate={{ x: [0, -1200] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {[...techs, ...techs, ...techs].map((t, i) => (
                <div key={i} className="marquee-chip">
                  <t.Icon />
                  <span>{t.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="tech-grid">
            {techs.map((t, i) => (
              <motion.div
                key={t.name}
                className="tech-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className="tech-icon">
                  <t.Icon />
                </div>
                <span className="tech-name">{t.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
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
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Selected client work
          </motion.h2>
          <div className="works-grid">
            {works.map((work, i) => (
              <motion.div
                key={work.name}
                className="work-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setActiveWork(work)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveWork(work)}
              >
                <div className="work-preview">
                  <MacMockup url={work.url} color={work.color} />
                  <div className="work-overlay">
                    <span className="visit-btn">View Details ↗</span>
                  </div>
                </div>
                <div className="work-meta">
                  <div className="work-top">
                    <h3 className="work-title">{work.name}</h3>
                    <span className="work-tag">{work.tag}</span>
                  </div>
                  <p className="work-desc">{work.description}</p>
                  <span className="work-url">{work.url}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BTS ── */}
      <section id="bts" className="section section-alt">
        <div className="container">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="label-line" />
            04 — Behind the Scenes
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            My embedded systems journey
          </motion.h2>
          <div className="bts-grid">
            {arduinoExperiments.map((exp, i) => (
              <motion.div
                key={i}
                className="bts-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                <div className="bts-date">{exp.date}</div>
                <h3 className="bts-title">{exp.title}</h3>
                <p className="bts-desc">{exp.description}</p>
                <div className="bts-chips">
                  {exp.components.map((c, j) => (
                    <span key={j} className="bts-chip">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            <motion.div
              className="bts-card bts-focus"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.36 }}
            >
              <div className="focus-tag">Current Focus</div>
              <h3 className="bts-title">Interrupt & Timer Programming</h3>
              <p className="bts-desc">
                Deep diving into hardware constraints — limited RAM, precise
                timing, and power efficiency. Next: I²C / SPI sensor integration
                and UART device communication.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
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
              05 — Contact
            </div>
            <h2 className="contact-heading">
              Let's build something
              <br />
              <em>remarkable</em> together.
            </h2>
            <p className="contact-sub">
              Open to freelance projects, collaborations, and full-time
              opportunities.
            </p>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="field">
                  <label>Name</label>
                  <input type="text" placeholder="Your name" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea
                  placeholder="Tell me about your project..."
                  rows="5"
                />
              </div>
              <button type="submit" className="btn-primary">
                Send Message <span className="btn-arrow">→</span>
              </button>
            </form>
            <div className="social-row">
              {["GitHub", "LinkedIn", "Twitter"].map((s) => (
                <a key={s} href="#" className="social-link">
                  {s}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
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
