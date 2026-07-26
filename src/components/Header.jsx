import React, { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a href="#hero" className="logo-link">
        <img 
          src="/logo/myLogo.png" 
          alt="JC Acapulco" 
          className="logo-image" 
          style={{ width: '32px', height: '32px' }}
        />
      </a>
      <nav>
        <a href="#hero">Home</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#contact" className="nav-cta">Contact</a>
      </nav>
    </header>
  );
};

export default Header;