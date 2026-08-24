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
    <section 
      id="projects" 
      className={`projects-section section-reveal ${isVisible ? 'visible' : ''}`} 
      ref={sectionRef}
    >
      <div className="projects-glow"></div>

      <div className={`projects-header stagger-children ${isVisible ? 'visible' : ''}`}>
        <span className="projects-label">
          <span className="projects-label-number">04.</span> Work
        </span>

        <h2 className="projects-title">
          Stuff I've actually<br />
          <span className="projects-highlight">
            built and shipped
            <span className="projects-title-icon">✦</span>
          </span>
        </h2>

        <div className="projects-subtitle-wrapper">
          <span className="projects-subtitle-line"></span>
          <p className="projects-subtitle">
            Each project is a story of problem-solving and learning
          </p>
        </div>
      </div>

      <div className="projects-carousel-wrapper">
        <div className="gradient-top"></div>
        <ProjectCarousel projects={projects} />
        <div className="gradient-bottom"></div>
      </div>
    </section>
  );
};

export default Projects;