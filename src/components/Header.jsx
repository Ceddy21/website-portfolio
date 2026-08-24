import React, { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a href="#hero" className="logo-link" onClick={handleNavClick}>
        <img
          src="/logo/myLogo.png"
          alt="JC Acapulco"
          className="logo-image"
          style={{ width: '32px', height: '32px' }}
        />
      </a>

      <nav className="nav-desktop">
        <a href="#hero">Home</a>
        <a href="#skills">Skills</a>
        <a href="#capabilities">Services</a>
        <a href="#projects">Projects</a>
        <a href="#contact" className="nav-cta">Contact</a>
      </nav>

      <button
        className={`nav-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <a href="#hero" onClick={handleNavClick}>Home</a>
        <a href="#skills" onClick={handleNavClick}>Skills</a>
        <a href="#capabilities" onClick={handleNavClick}>Services</a>
        <a href="#projects" onClick={handleNavClick}>Projects</a>
        <a href="#contact" className="nav-cta" onClick={handleNavClick}>Contact</a>
      </nav>
    </header>
  );
};

export default Header;