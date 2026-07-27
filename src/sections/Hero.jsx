import React, { useState, useEffect } from 'react';
import myImage from '/images/cedric.jpg';

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);

  const roles = ['Frontend Developer', 'Quality Assurance Engineer'];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 1500;

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
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <div className="hero-about-grid">
          <div className="hero-image-col">
            <div className="hero-image-container">
              <img 
                src={myImage}
                alt="John Cedric Acapulco"
                className="hero-image"
              />
            </div>
          </div>

          <div className="hero-info-col">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Available for work
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
            <p className="hero-desc">
              Building interfaces that don't suck,<br />
              and testing them until they do.
            </p>
            <div className="hero-links">
              <a href="#projects" className="primary-link">See my work →</a>
              <a href="/resume/JohnCedricAcapulco_Resume.docx" className="secondary-link">Resume</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">3+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-num">10+</span>
                <span className="stat-label">Technologies</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-num">100%</span>
                <span className="stat-label">Frontend Developer</span>
              </div>
            </div>
          </div>

          <div className="about-col">
            <div className="about-label">01. About</div>
            <h2 className="about-title">
              I build & break<br />
              <span className="about-highlight">things for a living</span>
            </h2>
            <p className="about-text">
              BSIT grad who actually enjoys what they do. I make websites that 
              look good and work even better — then I test them until I find 
              something that doesn't.
            </p>
            <p className="about-text">
              Some people code, some people test. I do both. Because shipping 
              broken code is just not my vibe.
            </p>
            <div className="about-tools">
              <span>Currently obsessed with:</span>
              <div className="tools-list">
                <span>React</span>
                <span>Tailwind</span>
                <span>Frontend Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;