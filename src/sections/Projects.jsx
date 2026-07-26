import React, { useEffect, useRef, useState } from 'react';
import ProjectCarousel from '../components/ProjectCarousel';
import { projects } from '../data/projects';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      {/* Subtle background glow */}
      <div className="projects-glow"></div>
      
      <div className="section-gradient-top"></div>

      <div className="projects-header">
        <span className={`projects-label ${isVisible ? 'fade-in-up' : 'fade-out-down'}`}>
          04. Work
        </span>
        <h2 className={`projects-title ${isVisible ? 'fade-in-up delay-1' : 'fade-out-down'}`}>
          Stuff I've actually<br />
          <span className="projects-highlight">built and shipped</span>
        </h2>
        <p className={`projects-subtitle ${isVisible ? 'fade-in-up delay-2' : 'fade-out-down'}`}>
          Each project is a story of problem-solving and learning
        </p>
      </div>

      <div className="projects-carousel-wrapper">
        <div className="gradient-top"></div>
        <ProjectCarousel projects={projects} />
        <div className="gradient-bottom"></div>
      </div>

      <div className="section-gradient-bottom"></div>
    </section>
  );
};

export default Projects;