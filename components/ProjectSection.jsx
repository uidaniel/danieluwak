import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 6;

/* ===== MEDIA TYPE DETECTION ===== */
const detectMediaType = (src) => {
  const videoExt = [".mp4", ".webm", ".ogg", ".mov"];
  const imgExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  const lower = src.toLowerCase();

  if (videoExt.some((e) => lower.endsWith(e))) return "video";
  if (imgExt.some((e) => lower.endsWith(e))) return "image";

  return "image";
};

/* ===== FULLSCREEN VIEWER ===== */
const MediaViewer = ({ media, onClose }) => {
  if (!media) return null;

  const type = media.type || detectMediaType(media.src);

  return (
    <div className="media-overlay" onClick={onClose}>
      <div className="media-content" onClick={(e) => e.stopPropagation()}>
        {type === "video" ? (
          <video
            src={media.src}
            controls
            autoPlay
            className="fullscreen-media"
          />
        ) : (
          <img src={media.src} className="fullscreen-media" alt="" />
        )}

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default function ProjectSection({ projects, openProject }) {
  const [activeMedia, setActiveMedia] = useState(null);

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

    return (
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPosition({ x: 0, y: 0 })}
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

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const tabs = [
    { id: "all", label: "Alle" },
    {
      id: "frontend",
      label: "Frontend",
      match: [
        "react",
        "vue",
        "javascript",
        "typescript",
        "next",
        "css",
        "ui",
        "ux",
      ],
    },
    {
      id: "backend",
      label: "Backend",
      match: ["node", "express", "php", "laravel", "api", "database"],
    },
    {
      id: "fullstack",
      label: "Full Stack",
      match: ["react", "node", "laravel", "next", "api"],
    },
    {
      id: "design",
      label: "Design",
      match: ["ui", "ux", "figma", "design"],
    },
    {
      id: "embedded",
      label: "Embedded",
      match: ["arduino", "firmware", "embedded", "microcontroller"],
    },
  ];

  const normalize = (s) => s.toLowerCase().replace(".", "").trim();

  const filtered = useMemo(() => {
    if (activeTab === "all") return projects;

    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab || !tab.match) return [];

    return projects.filter((project) =>
      project.tags.some((tag) => {
        const t = normalize(tag);
        return tab.match.some((key) => {
          const k = normalize(key);
          return t === k || t.includes(k);
        });
      }),
    );
  }, [activeTab, projects, tabs]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <>
      {/* ===== STYLES ===== */}
      <style>{`

      .project-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 360px;       /* 👈 keeps equal height */
      }

      .project-media {
        width: 100%;
        height: 170px;           /* 👈 space reserved always */
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        background: rgba(255,255,255,0.03);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .media-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .3s ease;
      }

      .project-media:hover .media-thumb {
        transform: scale(1.06);
      }

      .play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        background: rgba(0,0,0,.35);
        backdrop-filter: blur(2px);
      }

      /* ===== FULLSCREEN ===== */
      .media-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.92);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
      }

      .media-content {
        position: relative;
      }

      .fullscreen-media {
        max-width: 92vw;
        max-height: 88vh;
        border-radius: 14px;
      }

      .close-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: none;
        background: white;
        cursor: pointer;
      }

      .project-preview {
        flex: 1;               /* pushes button down */
      }

      `}</style>

      {/* ===== SECTION ===== */}
      <section id="projects" className="section">
        <div className="container">
          <div className="projects-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {paginatedProjects.map((project, index) => (
              <GlassCard key={index} delay={index * 0.15}>
                <div className="project-card">
                  {/* ===== MEDIA (SPACE ALWAYS EXISTS) ===== */}
                  <div
                    className="project-media"
                    onClick={() =>
                      project.media && setActiveMedia(project.media)
                    }
                  >
                    {project.media ? (
                      (project.media.type ||
                        detectMediaType(project.media.src)) === "video" ? (
                        <>
                          <img
                            src={
                              project.media.thumbnail ||
                              "/video-placeholder.jpg"
                            }
                            className="media-thumb"
                          />
                          <div className="play-overlay">▶</div>
                        </>
                      ) : (
                        <img src={project.media.src} className="media-thumb" />
                      )
                    ) : (
                      <span style={{ opacity: 0.3 }}>No media</span>
                    )}
                  </div>

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

      <MediaViewer media={activeMedia} onClose={() => setActiveMedia(null)} />
    </>
  );
}
