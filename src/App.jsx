import { useState, useEffect } from 'react';
import Header from "./components/Header";
import GlowCursor from "./components/GlowCursor";
import Hero from "./sections/Hero";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Service from "./sections/Service";

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ width: scrollProgress + '%' }}
      />

      <Header />
      <GlowCursor />
      
      <main className="page-load">
        <Hero />
        <Skills />
        <Service />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;