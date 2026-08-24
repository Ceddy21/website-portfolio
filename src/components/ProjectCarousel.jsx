import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ProjectCarousel = ({ projects }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const containerRef = useRef(null);
  const hasMovedRef = useRef(false);

  const totalItems = projects.length;
  const cardWidth = 260;
  const gap = 12;
  const totalWidth = cardWidth + gap;

  const getVisibleCards = () => {
    const centerIndex = scrollLeft / totalWidth;
    const visible = [];
    const halfRange = 5;

    for (let i = -halfRange; i <= halfRange; i++) {
      let idx = Math.round(centerIndex + i);
      let projectIndex = ((idx % totalItems) + totalItems) % totalItems;
      const isCenter = i === 0;

      const position = i * totalWidth - (scrollLeft - Math.round(centerIndex) * totalWidth);
      const scale = isCenter ? 1.15 : 0.88;
      const opacity = isCenter ? 1 : 0.7;
      const zIndex = isCenter ? 10 : 10 - Math.abs(i);
      const blur = isCenter ? '0px' : `${Math.abs(i) * 0.3}px`;

      visible.push({
        ...projects[projectIndex],
        position,
        scale,
        opacity,
        zIndex,
        blur,
        isCenter,
        key: `${projectIndex}-${idx}`
      });
    }
    return visible;
  };

  const visibleCards = getVisibleCards();

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (modalOpen) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    setStartX(e.pageX - containerRef.current.offsetLeft);
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleTouchStart = (e) => {
    if (modalOpen) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    if (modalOpen) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;

    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }

    setScrollLeft(prev => prev - walk);
    setStartX(x);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (modalOpen) return;
    e.preventDefault();
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;

    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }

    setScrollLeft(prev => prev - walk);
    setStartX(x);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
    snapToNearest();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    snapToNearest();
  };

  const snapToNearest = () => {
    const nearestIndex = Math.round(scrollLeft / totalWidth);
    const targetScroll = nearestIndex * totalWidth;
    setScrollLeft(targetScroll);
  };

  const handleCardClick = (project, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent?.stopImmediatePropagation();
    }
    if (!project) return;
    if (!hasMovedRef.current && !project.isPlaceholder) {
      setSelectedProject(project);
      setImageIndex(0);
      setModalOpen(true);
    }
    return false;
  };

  const handleModalClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const handlePrevImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (selectedProject && selectedProject.screenshots) {
      setImageIndex(prev =>
        prev === 0 ? Math.max(0, selectedProject.screenshots.length - 2) : prev - 2
      );
    }
  };

  const handleNextImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (selectedProject && selectedProject.screenshots) {
      setImageIndex(prev =>
        prev + 2 >= selectedProject.screenshots.length ? 0 : prev + 2
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        e.preventDefault();
        e.stopPropagation();
        handleModalClose(e);
      }
      if (e.key === 'ArrowRight' && !modalOpen) {
        setScrollLeft(prev => prev + totalWidth);
      }
      if (e.key === 'ArrowLeft' && !modalOpen) {
        setScrollLeft(prev => prev - totalWidth);
      }
      if (e.key === 'ArrowRight' && modalOpen) {
        e.preventDefault();
        e.stopPropagation();
        handleNextImage(e);
      }
      if (e.key === 'ArrowLeft' && modalOpen) {
        e.preventDefault();
        e.stopPropagation();
        handlePrevImage(e);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const modalContent = modalOpen && selectedProject && !selectedProject.isPlaceholder ? (
    <div
      className="modal-overlay"
      onClick={handleModalClose}
      onMouseDown={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-window-controls">
              <div
                role="button"
                aria-label="Close project details"
                tabIndex={0}
                className="modal-window-btn modal-window-close"
                onClick={handleModalClose}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleModalClose(e);
                  }
                }}
              />
              <div aria-hidden="true" className="modal-window-btn modal-window-minimize" />
              <div aria-hidden="true" className="modal-window-btn modal-window-maximize" />
            </div>
            <span className="modal-header-path">
              <span className="modal-path-project">project</span>
              <span className="modal-path-name">/{selectedProject.id || 'details'}</span>
            </span>
          </div>
          <button
            onClick={handleModalClose}
            aria-label="Close project details"
            className="modal-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {selectedProject.role && (
            <div className="modal-role-tags">
              {(Array.isArray(selectedProject.role) ? selectedProject.role : [selectedProject.role]).map((role, index) => (
                <span key={index} className="modal-role-tag">
                  {role}
                </span>
              ))}
            </div>
          )}
          <h2 id="project-modal-title" className="modal-title">
            {selectedProject.title}
          </h2>
          <p className="modal-description">
            {selectedProject.description}
          </p>

          {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
            <div className="modal-screenshots-section">
              <h3 className="modal-screenshots-header">
                <span><span className="modal-accent">└─</span> Screenshots</span>
                <span className="modal-screenshots-counter">
                  {imageIndex + 1} - {Math.min(imageIndex + 2, selectedProject.screenshots.length)} of {selectedProject.screenshots.length}
                </span>
              </h3>

              <div className="modal-screenshots-wrapper">
                <button
                  onClick={handlePrevImage}
                  className="modal-nav-btn modal-nav-prev"
                  disabled={imageIndex === 0}
                >
                  ‹
                </button>

                <div className="modal-screenshot-grid">
                  {selectedProject.screenshots.slice(imageIndex, imageIndex + 2).map((screenshot, index) => (
                    <div key={index} className="modal-screenshot-item">
                      <img
                        src={screenshot}
                        alt={selectedProject.title + ' screenshot ' + (imageIndex + index + 1)}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextImage}
                  className="modal-nav-btn modal-nav-next"
                  disabled={imageIndex + 2 >= selectedProject.screenshots.length}
                >
                  ›
                </button>
              </div>

              {selectedProject.screenshots.length > 2 && (
                <div className="modal-dots">
                  {Array.from({ length: Math.ceil(selectedProject.screenshots.length / 2) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i * 2)}
                      className={`modal-dot ${Math.floor(imageIndex / 2) === i ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedProject.contributions && selectedProject.contributions.length > 0 && (
            <div className="modal-contributions">
              <h3 className="modal-contributions-header">
                <span className="modal-accent">└─</span> My Contributions
              </h3>
              <ul className="modal-contributions-list">
                {selectedProject.contributions.map((contribution, index) => (
                  <li key={index} className="modal-contribution-item">
                    <span className="modal-contribution-bullet">▸</span>
                    {contribution}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedProject.tech && selectedProject.tech.length > 0 && (
            <div className="modal-tech-section">
              <h3 className="modal-tech-header">
                <span className="modal-accent">└─</span> Tech Stack
              </h3>
              <div className="modal-tech-tags">
                {selectedProject.tech.map((tech, index) => (
                  <span key={index} className="modal-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ============================================
              BUTTONS: GitHub + Live Demo
              ============================================ */}
          <div className="modal-buttons-wrapper">
            {selectedProject.github && (
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-github-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            )}

            {selectedProject.live && (
              <a
                href={selectedProject.live}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-live-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            )}
          </div>

          <div className="modal-footer">
            <span>
              <span className="modal-footer-accent">✦</span> Press <span className="modal-footer-key">ESC</span> to close
            </span>
            <span className="modal-footer-time">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const handleContainerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleContainerClick}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'visible',
          position: 'relative',
          width: '100%',
          height: '100%',
          userSelect: 'none',
          padding: '10px 0',
          background: '#1a1a2e',
          borderRadius: '16px',
          boxShadow: 'inset 0 0 60px rgba(124, 109, 240, 0.05)',
          pointerEvents: modalOpen ? 'none' : 'auto',
          opacity: modalOpen ? 0.5 : 1,
          transition: 'opacity 0.3s ease',
        }}
        role="region"
        aria-label="Project carousel"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '10px 0',
          position: 'relative',
          overflow: 'visible'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '0 30px',
              position: 'relative',
              overflow: 'visible'
            }}>
              {visibleCards.map((project) => {
                const isActive = project.isCenter;
                const isPlaceholder = project.isPlaceholder || false;

                return (
                  <div
                    key={project.key}
                    onClick={(e) => handleCardClick(project, e)}
                    role="button"
                    tabIndex={0}
                    style={{
                      position: 'absolute',
                      width: cardWidth + 'px',
                      height: isActive ? '360px' : '290px',
                      transform: 'translateX(' + project.position + 'px) scale(' + project.scale + ')',
                      opacity: project.opacity,
                      filter: 'blur(' + project.blur + ')',
                      transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      zIndex: project.zIndex,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: isPlaceholder
                        ? 'linear-gradient(145deg, #2a2a40, #1a1a30)'
                        : 'linear-gradient(145deg, #2d2d48, #1e1e38)',
                      boxShadow: isActive
                        ? '0 20px 60px rgba(124, 109, 240, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
                        : '0 8px 25px rgba(0, 0, 0, 0.4)',
                      border: isActive
                        ? isPlaceholder
                          ? '2px solid rgba(255, 255, 255, 0.08)'
                          : '2px solid rgba(124, 109, 240, 0.25)'
                        : '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: isPlaceholder ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px',
                    }}
                  >
                    {isPlaceholder ? (
                      <>
                        <div style={{
                          width: isActive ? '80px' : '65px',
                          height: isActive ? '80px' : '65px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '16px',
                          marginBottom: '12px',
                          border: '2px dashed rgba(255, 255, 255, 0.08)',
                          flexShrink: 0,
                          transition: 'all 0.3s ease'
                        }}>
                          <span style={{
                            fontSize: isActive ? '36px' : '28px',
                            opacity: 0.5,
                            transition: 'all 0.3s ease'
                          }}>
                            🚧
                          </span>
                        </div>
                        <div style={{
                          padding: '0 5px',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '6px',
                          width: '100%',
                          overflow: 'hidden'
                        }}>
                          <div>
                            <h3 style={{
                              color: '#f3f4f6',
                              fontFamily: 'Space Grotesk, system-ui, sans-serif',
                              fontSize: isActive ? '18px' : '15px',
                              fontWeight: 700,
                              lineHeight: 1.3,
                              marginBottom: '3px',
                              textAlign: 'center',
                              opacity: 0.6,
                              transition: 'all 0.3s ease'
                            }}>
                              {project.title || 'Coming Soon'}
                            </h3>
                            <p style={{
                              color: '#9ca3af',
                              fontSize: isActive ? '12px' : '11px',
                              lineHeight: 1.4,
                              textAlign: 'center',
                              opacity: 0.4,
                              transition: 'all 0.3s ease'
                            }}>
                              {project.description || 'A new project is currently in development'}
                            </p>
                            <div style={{
                              display: 'flex',
                              gap: '4px',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              marginTop: '4px'
                            }}>
                              {(project.tech || []).slice(0, 3).map((tech, idx) => (
                                <span key={idx} style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: '#9ca3af',
                                  padding: '1px 8px',
                                  borderRadius: '12px',
                                  fontSize: '9px',
                                  fontWeight: 500,
                                  opacity: 0.4
                                }}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#9ca3af',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 500,
                            textAlign: 'center',
                            width: '100%',
                            marginTop: '2px',
                            opacity: 0.4,
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.3s ease'
                          }}>
                            Coming Soon
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          width: isActive ? '80px' : '65px',
                          height: isActive ? '80px' : '65px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '16px',
                          padding: '15px',
                          marginBottom: '12px',
                          border: '2px solid rgba(124, 109, 240, 0.12)',
                          transition: 'all 0.3s ease',
                          flexShrink: 0
                        }}>
                          <img
                            src={project.logo}
                            alt={project.title + ' logo'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              transition: 'all 0.3s ease'
                            }}
                            loading="lazy"
                          />
                        </div>
                        <div style={{
                          padding: '0 5px',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '6px',
                          width: '100%',
                          overflow: 'hidden'
                        }}>
                          <div>
                            <h3 style={{
                              color: '#f3f4f6',
                              fontFamily: 'Space Grotesk, system-ui, sans-serif',
                              fontSize: isActive ? '18px' : '15px',
                              fontWeight: 700,
                              lineHeight: 1.3,
                              marginBottom: '3px',
                              textAlign: 'center',
                              transition: 'all 0.3s ease'
                            }}>
                              {project.title}
                            </h3>
                            <p style={{
                              color: '#b0b0c8',
                              fontSize: isActive ? '12px' : '11px',
                              lineHeight: 1.4,
                              textAlign: 'center',
                              display: '-webkit-box',
                              WebkitLineClamp: isActive ? 2 : 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease'
                            }}>
                              {project.description}
                            </p>
                            <div style={{
                              display: 'flex',
                              gap: '4px',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              marginTop: '4px'
                            }}>
                              {(project.tech || []).slice(0, 3).map((tech, idx) => (
                                <span key={idx} style={{
                                  background: 'rgba(124, 109, 240, 0.12)',
                                  color: '#a78bfa',
                                  padding: '1px 8px',
                                  borderRadius: '12px',
                                  fontSize: '9px',
                                  fontWeight: 500,
                                  border: '1px solid rgba(124, 109, 240, 0.08)',
                                  transition: 'all 0.3s ease'
                                }}>
                                  {tech}
                                </span>
                              ))}
                              {(project.tech || []).length > 3 && (
                                <span style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: '#9ca3af',
                                  padding: '1px 8px',
                                  borderRadius: '12px',
                                  fontSize: '9px',
                                  fontWeight: 500
                                }}>
                                  +{(project.tech || []).length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <button style={{
                            background: isActive ? 'linear-gradient(135deg, #7c6df0, #a78bfa)' : 'rgba(124, 109, 240, 0.1)',
                            color: isActive ? '#16171d' : '#a78bfa',
                            border: isActive ? 'none' : '1px solid rgba(124, 109, 240, 0.1)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: isActive ? 'pointer' : 'default',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            marginTop: '2px'
                          }}>
                            {isActive ? 'View Details →' : 'Learn More'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {modalContent && ReactDOM.createPortal(modalContent, document.body)}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          padding: 20px;
          animation: modalFadeIn 0.4s ease;
          pointer-events: auto;
          cursor: default;
        }

        .modal-overlay::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at center, rgba(124, 109, 240, 0.05), transparent 60%);
          pointer-events: none;
        }

        .modal-card {
          background: linear-gradient(145deg, rgba(18, 18, 30, 0.98), rgba(26, 26, 46, 0.98));
          backdrop-filter: blur(20px);
          border-radius: 16px;
          max-width: 750px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 80px rgba(124, 109, 240, 0.08), 0 30px 80px rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(124, 109, 240, 0.12);
          animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: auto;
          cursor: default;
        }

        .modal-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #7c6df0, transparent);
          opacity: 0.5;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          position: sticky;
          top: 0;
          z-index: 1;
          backdrop-filter: blur(8px);
        }

        .modal-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-window-controls {
          display: flex;
          gap: 8px;
        }

        .modal-window-btn {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          transition: opacity 0.2s;
        }

        .modal-window-close {
          background: #ff5f56;
          cursor: pointer;
        }

        .modal-window-close:hover {
          opacity: 0.8;
        }

        .modal-window-minimize {
          background: #ffbd2e;
        }

        .modal-window-maximize {
          background: #27c93f;
        }

        .modal-header-path {
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.3px;
          font-family: 'JetBrains Mono', monospace;
        }

        .modal-path-project {
          color: #60a5fa;
        }

        .modal-path-name {
          color: #6b7280;
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #9ca3af;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f3f4f6;
        }

        .modal-body {
          padding: 28px 32px;
          max-height: calc(90vh - 70px);
          overflow-y: auto;
        }

        .modal-role-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }

        .modal-role-tag {
          display: inline-block;
          background: rgba(74, 222, 128, 0.1);
          color: #4ade80;
          padding: 3px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          border: 1px solid rgba(74, 222, 128, 0.15);
          font-family: 'JetBrains Mono', monospace;
        }

        .modal-title {
          color: #f3f4f6;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 4px;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.02em;
        }

        .modal-description {
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.6;
          margin-top: 4px;
        }

        .modal-screenshots-section {
          margin-bottom: 28px;
        }

        .modal-screenshots-header {
          color: #d1d5db;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          font-family: 'Space Grotesk', sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .modal-accent {
          color: #7c6df0;
        }

        .modal-screenshots-counter {
          font-size: 12px;
          color: #6b7280;
          font-weight: 400;
        }

        .modal-screenshots-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-nav-btn {
          position: absolute;
          z-index: 10;
          background: rgba(18, 18, 30, 0.9);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d1d5db;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .modal-nav-btn:hover:not(:disabled) {
          background: rgba(124, 109, 240, 0.2);
          border-color: rgba(124, 109, 240, 0.3);
          color: #f3f4f6;
        }

        .modal-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .modal-nav-prev {
          left: -14px;
        }

        .modal-nav-next {
          right: -14px;
        }

        .modal-screenshot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
          overflow: hidden;
          padding: 4px 0;
        }

        .modal-screenshot-item {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          animation: fadeIn 0.3s ease;
        }

        .modal-screenshot-item:hover {
          border-color: rgba(124, 109, 240, 0.3);
          transform: scale(1.02);
        }

        .modal-screenshot-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .modal-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }

        .modal-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-dot.active {
          background: #7c6df0;
          box-shadow: 0 0 12px rgba(124, 109, 240, 0.3);
        }

        .modal-contributions {
          margin-bottom: 28px;
        }

        .modal-contributions-header {
          color: #d1d5db;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          font-family: 'Space Grotesk', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-contributions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .modal-contribution-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 6px 0;
          color: #d1d5db;
          font-size: 14px;
          line-height: 1.6;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .modal-contribution-item:last-child {
          border-bottom: none;
        }

        .modal-contribution-bullet {
          color: #4ade80;
          font-size: 16px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .modal-tech-section {
          margin-bottom: 24px;
        }

        .modal-tech-header {
          color: #d1d5db;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          font-family: 'Space Grotesk', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .modal-tech-tag {
          background: rgba(124, 109, 240, 0.1);
          color: #a78bfa;
          padding: 4px 14px;
          border-radius: 6px;
          font-size: 12px;
          border: 1px solid rgba(124, 109, 240, 0.08);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
        }

        /* ============================================
           BUTTONS: GitHub + Live Demo
           ============================================ */
        .modal-buttons-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .modal-github-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          background: rgba(255, 255, 255, 0.03);
          color: #60a5fa;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(96, 165, 250, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .modal-github-link:hover {
          background: rgba(96, 165, 250, 0.1);
          border-color: rgba(96, 165, 250, 0.2);
          transform: translateY(-2px);
        }

        .modal-live-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          background: rgba(124, 109, 240, 0.1);
          color: #a78bfa;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(124, 109, 240, 0.15);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .modal-live-link:hover {
          background: rgba(124, 109, 240, 0.2);
          border-color: rgba(124, 109, 240, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(124, 109, 240, 0.2);
        }

        .modal-footer {
          margin-top: 0px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          color: #374151;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
        }

        .modal-footer-accent {
          color: #4ade80;
        }

        .modal-footer-key {
          color: #fbbf24;
        }

        .modal-footer-time {
          color: #4b5563;
        }

        @media (max-width: 768px) {
          .modal-screenshot-grid {
            gap: 8px;
          }
          .modal-screenshot-item img {
            height: 150px;
          }
          .modal-nav-btn {
            width: 30px;
            height: 30px;
            font-size: 16px;
          }
          .modal-nav-prev {
            left: -10px;
          }
          .modal-nav-next {
            right: -10px;
          }
          .modal-buttons-wrapper {
            flex-direction: column;
          }
          .modal-github-link,
          .modal-live-link {
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          .modal-screenshot-grid {
            grid-template-columns: 1fr;
          }
          .modal-screenshot-item img {
            height: 180px;
          }
          .modal-nav-prev {
            left: -8px;
          }
          .modal-nav-next {
            right: -8px;
          }
          .modal-body {
            padding: 20px 16px;
          }
          .modal-title {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
};

export default ProjectCarousel;