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
    setIsDragging(true);
    hasMovedRef.current = false;
    setStartX(e.pageX - containerRef.current.offsetLeft);
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
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
    // CRITICAL: Prevent ALL default behavior and stop propagation
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
    return false; // Additional prevent default
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

  // Keyboard navigation
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

  // Prevent/allow body scroll when modal opens/closes.
  // No position:fixed / top / scrollTo trick — that approach resets native
  // scroll to 0 the instant position:fixed is removed, then jumps it back
  // via JS, which is what caused the visible jump on close. Just toggling
  // overflow never touches the scroll position at all, so there's nothing
  // to restore and nothing to jump.
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
        pointerEvents: 'auto',
        cursor: 'default'
      }}
      onClick={handleModalClose}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #12121e, #1a1a2e)',
          borderRadius: '16px',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 100px rgba(124, 109, 240, 0.1), 0 30px 80px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(124, 109, 240, 0.15)',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'auto',
          cursor: 'default'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <div
                style={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '50%',
                  background: '#ff5f56',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onClick={handleModalClose}
              />
              <div style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#ffbd2e'
              }} />
              <div style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#27c93f'
              }} />
            </div>
            <span style={{
              color: '#6b7280',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.3px',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              <span style={{ color: '#60a5fa' }}>project</span>
              <span style={{ color: '#6b7280' }}>/{selectedProject.id || 'details'}</span>
            </span>
          </div>
          <button
            onClick={handleModalClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#9ca3af',
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '28px 32px',
          maxHeight: 'calc(90vh - 70px)',
          overflowY: 'auto'
        }}>
          <h2 style={{
            color: '#f3f4f6',
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '4px',
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '-0.02em'
          }}>
            {selectedProject.title}
          </h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            {selectedProject.description}
          </p>

          {/* Screenshots Section */}
          {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '12px',
                fontFamily: 'Space Grotesk, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <span>
                  <span style={{ color: '#7c6df0' }}>└─</span> Screenshots
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: 400
                }}>
                  {imageIndex + 1} - {Math.min(imageIndex + 2, selectedProject.screenshots.length)} of {selectedProject.screenshots.length}
                </span>
              </h3>

              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={handlePrevImage}
                  style={{
                    position: 'absolute',
                    left: '-14px',
                    zIndex: 10,
                    background: 'rgba(18, 18, 30, 0.9)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d1d5db',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(124, 109, 240, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(124, 109, 240, 0.3)';
                    e.currentTarget.style.color = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(18, 18, 30, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                  disabled={imageIndex === 0}
                >
                  ‹
                </button>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  width: '100%',
                  overflow: 'hidden',
                  padding: '4px 0'
                }}>
                  {selectedProject.screenshots.slice(imageIndex, imageIndex + 2).map((screenshot, index) => (
                    <div
                      key={index}
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        background: 'rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        animation: 'fadeIn 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(124, 109, 240, 0.3)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <img
                        src={screenshot}
                        alt={selectedProject.title + ' screenshot ' + (imageIndex + index + 1)}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextImage}
                  style={{
                    position: 'absolute',
                    right: '-14px',
                    zIndex: 10,
                    background: 'rgba(18, 18, 30, 0.9)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d1d5db',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(124, 109, 240, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(124, 109, 240, 0.3)';
                    e.currentTarget.style.color = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(18, 18, 30, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                  disabled={imageIndex + 2 >= selectedProject.screenshots.length}
                >
                  ›
                </button>
              </div>

              {selectedProject.screenshots.length > 2 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px'
                }}>
                  {Array.from({ length: Math.ceil(selectedProject.screenshots.length / 2) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i * 2)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: Math.floor(imageIndex / 2) === i ? '#7c6df0' : 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contributions Section */}
          {selectedProject.contributions && selectedProject.contributions.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '10px',
                fontFamily: 'Space Grotesk, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: '#7c6df0' }}>└─</span> My Contributions
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {selectedProject.contributions.map((contribution, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '6px 0',
                      color: '#d1d5db',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      borderBottom: index < selectedProject.contributions.length - 1 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none'
                    }}
                  >
                    <span style={{
                      color: '#4ade80',
                      fontSize: '16px',
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      ▸
                    </span>
                    {contribution}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {selectedProject.tech && selectedProject.tech.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '10px',
                fontFamily: 'Space Grotesk, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: '#7c6df0' }}>└─</span> Tech Stack
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {selectedProject.tech.map((tech, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'rgba(124, 109, 240, 0.1)',
                      color: '#a78bfa',
                      padding: '4px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      border: '1px solid rgba(124, 109, 240, 0.08)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 500
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Link */}
          {selectedProject.github && (
            <div>
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 24px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#60a5fa',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: '1px solid rgba(96, 165, 250, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.03)',
            color: '#374151',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>
              <span style={{ color: '#4ade80' }}>✦</span> Press <span style={{ color: '#fbbf24' }}>ESC</span> to close
            </span>
            <span style={{ color: '#4b5563' }}>
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  // CRITICAL: Prevent all clicks from navigating
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
          boxShadow: 'inset 0 0 60px rgba(124, 109, 240, 0.05)'
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
                              {(project.tech || ['🚀', '✨', '🔜']).slice(0, 3).map((tech, idx) => (
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

        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default ProjectCarousel;