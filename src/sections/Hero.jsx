import React, { useState, useEffect } from 'react';
import myImage from '/images/cedric.jpg';

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);

  const roles = ['Frontend Developer', 'Quality Assurance Engineer'];
  const typingSpeed = 80;
  const deletingSpeed = 40;
  const pauseTime = 2000;

  useEffect(() => {
    const currentRole = roles[loopIndex % roles.length];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentRole.length) {
          setText(currentRole.slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setIsDeleting(false);
          setLoopIndex(prev => prev + 1);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopIndex, roles]);

  const displayText = text;
  const hasText = displayText.length > 0;

  return (
    <section id="hero" className="hero-section section-reveal visible">
      <div className="hero-content">
        <div className="hero-about-grid">
          {/* Image column */}
          <div className="hero-image-col">
            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <img 
                  src={myImage}
                  alt="John Cedric Acapulco"
                  className="hero-image"
                  loading="lazy"
                />
              </div>
              <div className="hero-image-glow"></div>
            </div>
          </div>

          {/* Info column */}
          <div className="hero-info-col">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Open to opportunities
            </div>
            <h1 className="hero-name">
              John Cedric<br />
              <span className="hero-last">Acapulco</span>
            </h1>
            <div className="hero-role">
              <span className="role-bracket left-bracket">{'<'}</span>
              <span className="role-text">
                {displayText}
                <span className="typing-cursor">|</span>
              </span>
              <span className="role-bracket right-bracket">
                {hasText ? `/${'>'}` : ''}
              </span>
            </div>
            
            {/* Professional description */}
            <p className="hero-desc">
              Frontend developer with a focus on quality. I build accessible, 
              performant interfaces and rigorously test every component to 
              ensure a seamless user experience.
            </p>
            
            <div className="hero-links">
              <a href="#projects" className="primary-link">
                View my work →
              </a>
              <a 
                href="/resume/JohnCedricAcapulco-Resume.docx" 
                className="secondary-link" 
                download
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Resume
              </a>
            </div>

            <div className="hero-stack">
              <span className="stack-label">Tech stack</span>
              <div className="stack-tags">
                <span>React</span>
                <span>JavaScript</span>
                <span>Tailwind</span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          {/* About column */}
          <div className="about-col">
            <div className="about-connector">
              <span className="about-connector-line"></span>
              <span className="about-connector-text">About me</span>
            </div>
            <div className="about-label">About</div>
            <h2 className="about-title">
              I build & break<br />
              <span className="about-highlight">things for a living</span>
            </h2>
            <p className="about-text">
              BSIT graduate with a dual passion for frontend development and 
              quality assurance. I create interfaces that are both beautiful 
              and robust — then test them until they're bulletproof.
            </p>
            <p className="about-text">
              I believe shipping code without thorough testing is just 
              gambling with user trust. That's why I do both.
            </p>
            <div className="about-tools">
              <span>Currently focused on:</span>
              <div className="tools-list">
                <span>React</span>
                <span>Tailwind</span>
                <span>Frontend Testing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
};

export default Hero;