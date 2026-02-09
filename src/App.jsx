import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// Tech stack logos as SVG paths/icons (simplified representations)
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
  PHP: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6C5.92 6 1 9.03 1 12.75s4.92 6.75 11 6.75 11-3.03 11-6.75S18.08 6 12 6m-2.5 9.77c-.38.07-.75.1-1.09.1-.36 0-.67-.04-.94-.13-.26-.09-.48-.22-.64-.39s-.28-.38-.36-.62c-.08-.24-.12-.52-.12-.83 0-.34.04-.65.11-.92.08-.28.19-.53.35-.74.15-.21.34-.37.57-.48.22-.12.49-.17.79-.17.15 0 .31.01.47.04.16.02.3.06.43.1l-.17.73c-.12-.04-.24-.07-.36-.09-.13-.02-.25-.03-.36-.03-.21 0-.4.05-.56.14-.16.1-.29.23-.39.41-.11.17-.19.37-.24.61-.06.23-.08.48-.08.75 0 .49.09.85.28 1.06.19.22.48.32.88.32.12 0 .24 0 .36-.02.12-.01.24-.04.36-.07l.1.73M18 8.5c-.26-.09-.57-.13-.94-.13-.22 0-.45.02-.67.07-.22.04-.45.11-.67.2l-.28 1.61h1.17l-.15.72H15.3l-.45 2.68c-.03.17-.05.34-.06.51s-.02.33-.02.49c0 .22.04.38.13.49.08.11.23.16.44.16.11 0 .23-.01.36-.04.12-.02.24-.06.36-.1l-.1.73c-.18.06-.36.11-.55.14-.19.03-.38.05-.58.05-.34 0-.62-.04-.84-.13-.22-.09-.4-.22-.53-.38-.13-.17-.22-.37-.26-.6-.05-.24-.07-.5-.07-.78 0-.18.01-.38.03-.58.02-.21.04-.42.08-.63l.5-2.99c-.22.06-.43.13-.64.21-.21.07-.4.15-.59.22l.12-.76c.18-.07.38-.14.59-.21.21-.07.43-.13.65-.2.11-.64.24-1.25.37-1.83.14-.58.29-1.12.45-1.63.34-.11.69-.2 1.06-.28.36-.07.73-.11 1.1-.11.38 0 .68.05.91.14.23.1.34.27.34.52 0 .11-.02.22-.05.33-.04.11-.09.21-.16.29-.07.09-.15.16-.24.21-.1.05-.21.08-.33.08-.11 0-.21-.03-.29-.08-.09-.05-.16-.12-.22-.21.06-.09.11-.17.15-.26.05-.09.07-.18.07-.28 0-.1-.03-.18-.09-.23M8.67 8.37c-.22-.04-.45-.07-.67-.07-.37 0-.68.04-.94.13-.06.05-.09.13-.09.23 0 .1.02.19.07.28.04.09.09.17.15.26-.06.09-.13.16-.22.21-.08.05-.18.08-.29.08-.12 0-.23-.03-.33-.08-.09-.05-.17-.12-.24-.21-.07-.08-.12-.18-.16-.29-.03-.11-.05-.22-.05-.33 0-.25.11-.42.34-.52.23-.09.53-.14.91-.14.37 0 .74.04 1.1.11.37.08.72.17 1.06.28.16.51.31 1.05.45 1.63.13.58.26 1.19.37 1.83l.65.2c.21.07.41.14.59.21l.12.76c-.19-.07-.38-.15-.59-.22-.21-.08-.42-.15-.64-.21l.5 2.99c.04.21.06.42.08.63.02.2.03.4.03.58 0 .28-.02.54-.07.78-.04.23-.13.43-.26.6-.13.16-.31.29-.53.38-.22.09-.5.13-.84.13-.2 0-.39-.02-.58-.05-.19-.03-.37-.08-.55-.14l-.1-.73c.12.04.24.08.36.1.13.03.25.04.36.04.21 0 .36-.05.44-.16.09-.11.13-.27.13-.49 0-.16-.01-.32-.02-.49-.01-.17-.03-.34-.06-.51l-.45-2.68H6.17l-.15-.72h1.17L6.91 9.7c-.22-.09-.45-.16-.67-.2-.22-.05-.45-.07-.67-.07-.37 0-.68.04-.94.13-.06.05-.09.13-.09.23 0 .1.02.19.07.28.04.09.09.17.15.26-.06.09-.13.16-.22.21-.08.05-.18.08-.29.08-.12 0-.23-.03-.33-.08-.09-.05-.17-.12-.24-.21-.07-.08-.12-.18-.16-.29-.03-.11-.05-.22-.05-.33 0-.25.11-.42.34-.52.23-.09.53-.14.91-.14.37 0 .74.04 1.1.11.37.08.72.17 1.06.28.16.51.31 1.05.45 1.63.13.58.26 1.19.37 1.83l.65.2c.21.07.41.14.59.21l.12.76c-.19-.07-.38-.15-.59-.22-.21-.08-.42-.15-.64-.21l.5 2.99c.04.21.06.42.08.63.02.2.03.4.03.58 0 .28-.02.54-.07.78-.04.23-.13.43-.26.6-.13.16-.31.29-.53.38-.22.09-.5.13-.84.13-.2 0-.39-.02-.58-.05-.19-.03-.37-.08-.55-.14l-.1-.73c.12.04.24.08.36.1.13.03.25.04.36.04.21 0 .36-.05.44-.16.09-.11.13-.27.13-.49 0-.16-.01-.32-.02-.49-.01-.17-.03-.34-.06-.51l-.45-2.68H3.67l-.15-.72h1.17l-.28-1.67c-.22-.09-.45-.16-.67-.2-.22-.05-.45-.07-.67-.07-.37 0-.68.04-.94.13-.06.05-.09.13-.09.23 0 .1.02.19.07.28.04.09.09.17.15.26-.06.09-.13.16-.22.21-.08.05-.18.08-.29.08-.12 0-.23-.03-.33-.08-.09-.05-.17-.12-.24-.21-.07-.08-.12-.18-.16-.29-.03-.11-.05-.22-.05-.33 0-.25.11-.42.34-.52.23-.09.53-.14.91-.14.37 0 .74.04 1.1.11.37.08.72.17 1.06.28.16.51.31 1.05.45 1.63.13.58.26 1.19.37 1.83l.65.2c.21.07.41.14.59.21l.12.76c-.19-.07-.38-.15-.59-.22-.21-.08-.42-.15-.64-.21l.5 2.99c.04.21.06.42.08.63.02.2.03.4.03.58 0 .28-.02.54-.07.78-.04.23-.13.43-.26.6-.13.16-.31.29-.53.38-.22.09-.5.13-.84.13-.2 0-.39-.02-.58-.05-.19-.03-.37-.08-.55-.14l-.1-.73c.12.04.24.08.36.1.13.03.25.04.36.04.21 0 .36-.05.44-.16.09-.11.13-.27.13-.49 0-.16-.01-.32-.02-.49-.01-.17-.03-.34-.06-.51L2.57 12H1.42l-.15-.72h1.17L2.16 9.7c-.22-.09-.45-.16-.67-.2-.22-.05-.45-.07-.67-.07-.37 0-.68.04-.94.13-.06.05-.09.13-.09.23 0 .1.02.19.07.28.04.09.09.17.15.26-.06.09-.13.16-.22.21-.08.05-.18.08-.29.08-.12 0-.23-.03-.33-.08-.09-.05-.17-.12-.24-.21-.07-.08-.12-.18-.16-.29-.03-.11-.05-.22-.05-.33 0-.25.11-.42.34-.52.23-.09.53-.14.91-.14.37 0 .74.04 1.1.11.37.08.72.17 1.06.28.16.51.31 1.05.45 1.63.13.58.26 1.19.37 1.83l.65.2c.21.07.41.14.59.21l.12.76c-.19-.07-.38-.15-.59-.22-.21-.08-.42-.15-.64-.21l.5 2.99c.04.21.06.42.08.63.02.2.03.4.03.58 0 .28-.02.54-.07.78-.04.23-.13.43-.26.6-.13.16-.31.29-.53.38-.22.09-.5.13-.84.13-.2 0-.39-.02-.58-.05-.19-.03-.37-.08-.55-.14l-.1-.73c.12.04.24.08.36.1.13.03.25.04.36.04.21 0 .36-.05.44-.16.09-.11.13-.27.13-.49 0-.16-.01-.32-.02-.49-.01-.17-.03-.34-.06-.51L3.2 12H2.05l-.15-.72h1.17l-.28-1.61c-.22-.09-.45-.16-.67-.2" />
    </svg>
  ),
  Laravel: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 0 1 .375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 0 1 .024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 0 1 .375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.039-.01-.012-.021-.023-.028-.037h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 0 1-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z" />
    </svg>
  ),
  Arduino: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.82 12c0 6.52-5.27 11.79-11.79 11.79S.24 18.52.24 12 5.51.21 12.03.21 23.82 5.48 23.82 12M8.01 14.75V9.25H6.46v2.17H3.71V9.25H2.16v5.5h1.55v-2.23h2.75v2.23zm8.77-2.75c0 1.54-1.27 2.8-2.82 2.8A2.82 2.82 0 0 1 11.14 12c0-1.54 1.27-2.8 2.82-2.8A2.82 2.82 0 0 1 16.78 12m1.54 0c0-2.4-1.96-4.35-4.36-4.35A4.36 4.36 0 0 0 9.6 12a4.36 4.36 0 0 0 4.36 4.35 4.36 4.36 0 0 0 4.36-4.35m3.67-1.33h-1.62v1.66h1.62v1.67h1.62v-1.67H24v-1.66h-1.39V9h-1.62z" />
    </svg>
  ),
  Git: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 1.847 2.284 1.838 1.838 0 0 1 2.285 1.847l2.658 2.658a1.838 1.838 0 0 1 1.847 2.285 1.838 1.838 0 1 1-3.142-1.284l-2.48-2.48v6.518a1.838 1.838 0 0 1 .486 3.015 1.838 1.838 0 1 1-2.774-2.368V9.285a1.838 1.838 0 0 1-.997-2.408L8.435 4.114.452 12.097a1.55 1.55 0 0 0 0 2.188l10.48 10.479a1.55 1.55 0 0 0 2.188 0l10.426-10.426a1.55 1.55 0 0 0 0-2.188" />
    </svg>
  ),
};

// Glassmorphic Card Component
const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={`glass-card ${className}`}
  >
    {children}
  </motion.div>
);

// Magnetic Button Component
const MagneticButton = ({ children, onClick, variant = "primary" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      whileTap={{ scale: 0.95 }}
      className={`magnetic-btn ${variant}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

// Drawer Component
const Drawer = ({ isOpen, onClose, project }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drawer-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="drawer"
          >
            <button className="drawer-close" onClick={onClose}>
              ×
            </button>
            {project && (
              <div className="drawer-content">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {project.title}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="drawer-tags"
                >
                  {project.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="drawer-section"
                >
                  <h3>Das Problem</h3>
                  <p>{project.problem}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="drawer-section"
                >
                  <h3>Die Lösung</h3>
                  <p>{project.solution}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="drawer-section"
                >
                  <h3>Ergebnis</h3>
                  <p>{project.result}</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Animated Tech Logo
const AnimatedTechLogo = ({ Icon, name, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const logoRef = useRef(null);

  return (
    <motion.div
      ref={logoRef}
      initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.2,
        rotateY: 360,
        transition: { duration: 0.6 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="tech-logo-wrapper"
    >
      <div className={`tech-logo ${isHovered ? "hovered" : ""}`}>
        <Icon />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="tech-name"
        >
          {name}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Marquee Component
const TechMarquee = () => {
  const techs = [
    { name: "React", Icon: TechLogos.React },
    { name: "JavaScript", Icon: TechLogos.JavaScript },
    { name: "Node.js", Icon: TechLogos.Node },
    { name: "PHP", Icon: TechLogos.PHP },
    { name: "Laravel", Icon: TechLogos.Laravel },
    { name: "Arduino", Icon: TechLogos.Arduino },
    { name: "Git", Icon: TechLogos.Git },
  ];

  return (
    <div className="marquee-container">
      <motion.div
        className="marquee"
        animate={{ x: [0, -1400] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...techs, ...techs, ...techs].map((tech, i) => (
          <div key={i} className="marquee-item">
            <tech.Icon />
            <span>{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Main Portfolio Component
export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const projects = [
    {
      title: "Project Alpha",
      tags: ["React", "Node.js", "API"],
      problem:
        "Legacy system needed modernization. Multiple data silos prevented efficient workflow. Users complained about slow response times and poor mobile experience.",
      solution:
        "Built a full-stack application with React frontend and Node.js backend. Implemented REST API architecture with JWT authentication. Designed responsive UI with real-time updates using WebSocket connections.",
      result:
        "Reduced load times by 73%. Unified data access across departments. Mobile usage increased 340% within first quarter.",
    },
    {
      title: "Project Beta",
      tags: ["Laravel", "PHP", "Database"],
      problem:
        "E-commerce platform struggled with inventory management. Stock discrepancies led to overselling. Customer satisfaction scores were declining rapidly.",
      solution:
        "Developed Laravel-based inventory tracking system. Integrated real-time synchronization across multiple warehouses. Created automated alerts for low stock and reordering workflows.",
      result:
        "Eliminated overselling incidents completely. Inventory accuracy improved to 99.7%. Customer complaints reduced by 85%.",
    },
    {
      title: "Project Gamma",
      tags: ["JavaScript", "UI/UX", "Animation"],
      problem:
        "Corporate website had high bounce rates. Users found navigation confusing. Brand identity felt disconnected from digital presence.",
      solution:
        "Redesigned complete user experience with modern JavaScript frameworks. Implemented smooth animations and intuitive navigation patterns. Created cohesive visual language matching brand guidelines.",
      result:
        "Bounce rate decreased from 68% to 23%. Average session duration increased 4.2x. Won industry design award for user experience.",
    },
  ];

  const arduinoExperiments = [
    {
      date: "2024-11",
      title: "LED Matrix Display",
      description:
        "Built 8x8 LED matrix controller. Learning multiplexing and timing control.",
      components: ["Arduino Uno", "MAX7219", "LEDs"],
    },
    {
      date: "2024-12",
      title: "Temperature Monitor",
      description:
        "DHT22 sensor integration with LCD display. Experimenting with I2C communication.",
      components: ["Arduino Nano", "DHT22", "16x2 LCD"],
    },
    {
      date: "2025-01",
      title: "Motor Controller",
      description:
        "PWM-based DC motor speed control. Understanding H-bridge circuits and feedback loops.",
      components: ["Arduino Mega", "L298N", "Encoders"],
    },
  ];

  const openProject = (project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const techCategories = {
    Frontend: [
      { name: "React", Icon: TechLogos.React },
      { name: "JavaScript", Icon: TechLogos.JavaScript },
    ],
    Backend: [
      { name: "Node.js", Icon: TechLogos.Node },
      { name: "PHP", Icon: TechLogos.PHP },
      { name: "Laravel", Icon: TechLogos.Laravel },
    ],
    Embedded: [{ name: "Arduino", Icon: TechLogos.Arduino }],
    Tools: [{ name: "Git", Icon: TechLogos.Git }],
  };

  return (
    <div className="portfolio">
      {/* Progress Bar */}
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* Navigation */}
      <nav className="nav">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="nav-content"
        >
          <div className="nav-logo">DEV/PORT</div>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#hero" onClick={() => setMenuOpen(false)}>
              Start
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              Über
            </a>
            <a href="#stack" onClick={() => setMenuOpen(false)}>
              Stack
            </a>
            <a href="#projects" onClick={() => setMenuOpen(false)}>
              Projekte
            </a>
            <a href="#bts" onClick={() => setMenuOpen(false)}>
              BTS
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Kontakt
            </a>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-label"
            >
              WILLKOMMEN
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="gradient-text">Uwak Daniel Iniobong.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hero-roles"
            >
              <span>Software Engineer</span>
              <span className="separator">•</span>
              <span>UI/UX Designer</span>
              <span className="separator">•</span>
              <span>Applied Physics (Electronics) Student @UNILAG</span>
              <span className="separator">•</span>
              <span>Aspiring Firmware Engineer</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="profile-frame"
            >
              <div className="profile-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hero-intro"
            >
              I build scalable digital systems with clean architecture. Von Web
              APIs bis embedded systems – immer auf der Suche nach eleganten
              Lösungen für komplexe Probleme.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <MagneticButton
                onClick={() =>
                  document
                    .getElementById("projects")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Projekte ansehen / View Work →
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

        <div className="grid-overlay"></div>
        <div className="noise-overlay"></div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Über Mich / About Me</h2>
            <div className="section-line"></div>
          </motion.div>

          <GlassCard delay={0.2}>
            <div className="about-content">
              <p>
                I approach software development as an engineering discipline –
                focusing on{" "}
                <strong>architecture, scalability, and maintainability</strong>.
                My work spans from building REST APIs and database systems to
                designing intuitive user interfaces.
              </p>
              <p>
                Currently expanding into{" "}
                <strong>embedded systems and firmware development</strong>. Die
                Kombination von high-level software engineering und
                hardware-naher Programmierung fasziniert mich. Every Arduino
                experiment teaches me something new about timing, interrupts,
                and resource constraints.
              </p>
              <p>
                Whether it's optimizing a database query, designing a component
                library, or debugging microcontroller code – ich liebe die
                Herausforderung, komplexe Probleme in elegante Lösungen zu
                verwandeln.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="stack" className="section section-dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Werkzeuge / Tech Stack</h2>
            <div className="section-line"></div>
          </motion.div>

          <TechMarquee />

          <div className="tech-categories">
            {Object.entries(techCategories).map(
              ([category, techs], catIndex) => (
                <GlassCard
                  key={category}
                  delay={catIndex * 0.1}
                  className="tech-category"
                >
                  <h3>{category}</h3>
                  <div className="tech-grid">
                    {techs.map((tech, index) => (
                      <AnimatedTechLogo
                        key={tech.name}
                        Icon={tech.Icon}
                        name={tech.name}
                        delay={catIndex * 0.1 + index * 0.05}
                      />
                    ))}
                  </div>
                </GlassCard>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Meine Projekte / My Projects</h2>
            <div className="section-line"></div>
          </motion.div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <GlassCard key={index} delay={index * 0.15}>
                <div className="project-card">
                  <h3>{project.title}</h3>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="project-preview">
                    {project.problem.substring(0, 120)}...
                  </p>
                  <MagneticButton
                    variant="secondary"
                    onClick={() => openProject(project)}
                  >
                    Details ansehen →
                  </MagneticButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* BTS Arduino Section */}
      <section id="bts" className="section section-dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Behind the Scenes / Arduino Lernprozess</h2>
            <div className="section-line"></div>
            <p className="section-subtitle">
              Was ich gerade lerne – my journey into embedded systems
            </p>
          </motion.div>

          <div className="timeline">
            {arduinoExperiments.map((exp, index) => (
              <GlassCard
                key={index}
                delay={index * 0.1}
                className="timeline-item"
              >
                <div className="timeline-date">{exp.date}</div>
                <h3>{exp.title}</h3>
                <p>{exp.description}</p>
                <div className="components-list">
                  <strong>Komponenten:</strong>
                  <div className="component-tags">
                    {exp.components.map((comp, i) => (
                      <span key={i} className="component-tag">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard delay={0.4}>
            <div className="learning-notes">
              <h3>Current Focus</h3>
              <p>
                Deep diving into <strong>interrupt handling</strong> and{" "}
                <strong>timer programming</strong>. Understanding how to work
                with hardware constraints – limited RAM, precise timing
                requirements, and power efficiency.
              </p>
              <p>
                Next up: integrating sensors with I²C and SPI protocols, dann
                UART communication für device-to-device messaging.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Kontakt / Get in Touch</h2>
            <div className="section-line"></div>
          </motion.div>

          <GlassCard delay={0.2}>
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="E-Mail" required />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Nachricht / Message"
                  rows="5"
                  required
                ></textarea>
              </div>
              <MagneticButton type="submit">
                Senden / Send Message
              </MagneticButton>
            </form>
          </GlassCard>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="social-links"
          >
            <a href="#" className="social-link">
              GitHub
            </a>
            <a href="#" className="social-link">
              LinkedIn
            </a>
            <a href="#" className="social-link">
              Twitter
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 Alex Schmidt • Built with React & Framer Motion</p>
          <p className="footer-subtitle">
            Engineered with precision / Mit Liebe gebaut
          </p>
        </div>
      </footer>

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        project={selectedProject}
      />

      {/* Styles */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --black: #0a0a0a;
          --white: #ffffff;
          --gray-100: #f5f5f5;
          --gray-200: #e0e0e0;
          --gray-300: #bdbdbd;
          --gray-400: #9e9e9e;
          --gray-500: #757575;
          --gray-600: #616161;
          --gray-700: #424242;
          --gray-800: #2e2e2e;
          --gray-900: #1a1a1a;
        }

        body {
          font-family: "Space Mono", "Courier New", monospace;
          background: var(--black);
          color: var(--white);
          overflow-x: hidden;
        }

        .portfolio {
          position: relative;
          min-height: 100vh;
        }

        /* Progress Bar */
        .progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--white);
          transform-origin: 0%;
          z-index: 9999;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 2px;
          font-family: "Space Mono", monospace;
        }

        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .nav-toggle span {
          width: 24px;
          height: 2px;
          background: var(--white);
          transition: all 0.3s;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-links a {
          color: var(--white);
          text-decoration: none;
          font-size: 0.9rem;
          transition: opacity 0.3s;
          position: relative;
        }

        .nav-links a:hover {
          opacity: 0.7;
        }

        .nav-links a::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--white);
          transition: width 0.3s;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        /* Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Section */
        .section {
          padding: 8rem 0;
          position: relative;
        }

        .section-dark {
          background: linear-gradient(
            180deg,
            var(--black) 0%,
            var(--gray-900) 100%
          );
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: "Space Mono", monospace;
          letter-spacing: -1px;
        }

        .section-line {
          width: 60px;
          height: 2px;
          background: var(--white);
          margin: 0 auto;
        }

        .section-subtitle {
          margin-top: 1rem;
          color: var(--gray-400);
          font-size: 1.1rem;
        }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding-top: 80px;
        }

        .hero-content {
          text-align: center;
          z-index: 1;
          padding-top: 30px;
          padding-bottom: 30px;
        }

        .hero-label {
          font-size: 0.85rem;
          letter-spacing: 3px;
          color: var(--gray-400);
          margin-bottom: 1rem;
        }

        .hero h1 {
          font-size: 5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.1;
          font-family: "Space Mono", monospace;
        }

        .gradient-text {
          background: linear-gradient(
            135deg,
            var(--white) 0%,
            var(--gray-400) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-roles {
          font-size: 1.1rem;
          color: var(--gray-400);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .separator {
          color: var(--gray-600);
        }

        .profile-frame {
          width: 200px;
          height: 200px;
          margin: 2rem auto;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(10px);
          z-index: 99;
        }

        .profile-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-placeholder svg {
          width: 100px;
          height: 100px;
          color: var(--gray-600);
        }

        .hero-intro {
          max-width: 600px;
          margin: 0 auto 2rem;
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--gray-300);
        }

        /* Glass Card */
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.3s;
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
        }

        /* Buttons */
        .magnetic-btn {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-family: "Space Mono", monospace;
          background: var(--white);
          color: var(--black);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .magnetic-btn:hover {
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
        }

        .magnetic-btn.secondary {
          background: transparent;
          color: var(--white);
          border: 1px solid var(--white);
        }

        .magnetic-btn.secondary:hover {
          background: var(--white);
          color: var(--black);
        }

        /* About */
        .about-content p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          color: var(--gray-300);
          font-size: 1.05rem;
        }

        .about-content strong {
          color: var(--white);
        }

        /* Tech Stack */
        .marquee-container {
          margin: 3rem 0;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 0;
        }

        .marquee {
          display: flex;
          gap: 4rem;
          width: max-content;
        }

        .marquee-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          white-space: nowrap;
        }

        .marquee-item svg {
          width: 32px;
          height: 32px;
          color: var(--white);
        }

        .marquee-item span {
          font-size: 1.2rem;
          color: var(--gray-300);
        }

        .tech-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .tech-category h3 {
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 1.5rem;
        }

        .tech-logo-wrapper {
          cursor: pointer;
        }

        .tech-logo {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s;
        }

        .tech-logo svg {
          width: 40px;
          height: 40px;
          color: var(--white);
          transition: all 0.3s;
        }

        .tech-logo.hovered {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .tech-name {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 0.75rem;
          color: var(--gray-400);
        }

        /* Projects */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .project-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .project-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--gray-300);
        }

        .project-preview {
          color: var(--gray-400);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* Drawer */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(600px, 90vw);
          background: var(--gray-900);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 2001;
          overflow-y: auto;
        }

        .drawer-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: var(--white);
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .drawer-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .drawer-content {
          padding: 3rem;
        }

        .drawer-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .drawer-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .drawer-section {
          margin-bottom: 2.5rem;
        }

        .drawer-section h3 {
          font-size: 1.3rem;
          color: var(--gray-400);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }

        .drawer-section p {
          line-height: 1.8;
          color: var(--gray-300);
        }

        /* Timeline */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .timeline-item {
          position: relative;
          padding-left: 2rem;
        }

        .timeline-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(
            180deg,
            var(--white) 0%,
            transparent 100%
          );
        }

        .timeline-date {
          font-size: 0.85rem;
          color: var(--gray-500);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .timeline-item h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .timeline-item p {
          color: var(--gray-300);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .components-list {
          margin-top: 1rem;
        }

        .components-list strong {
          color: var(--gray-400);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .component-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .component-tag {
          padding: 0.25rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--gray-400);
        }

        .learning-notes h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .learning-notes p {
          color: var(--gray-300);
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        /* Contact Form */
        .contact-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: var(--white);
          font-family: "Space Mono", monospace;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group textarea {
          resize: vertical;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 3rem;
        }

        .social-link {
          color: var(--white);
          text-decoration: none;
          font-size: 1.1rem;
          transition: opacity 0.3s;
        }

        .social-link:hover {
          opacity: 0.7;
        }

        /* Footer */
        .footer {
          padding: 3rem 0;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: var(--gray-900);
        }

        .footer p {
          color: var(--gray-500);
          margin-bottom: 0.5rem;
        }

        .footer-subtitle {
          font-size: 0.85rem;
        }

        /* Overlays */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
          pointer-events: none;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-toggle {
            display: flex;
          }

          .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
          }

          .hero h1 {
            font-size: 3rem;
          }

          .hero-roles {
            flex-direction: column;
            gap: 3px;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .tech-categories {
            grid-template-columns: 1fr;
          }

          .drawer {
            width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}
