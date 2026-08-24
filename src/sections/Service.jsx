import React, { useEffect, useRef, useState } from 'react';
import { Code, Layers, Bug, Gauge } from 'lucide-react';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const capabilities = [
    {
      icon: Code,
      title: 'Frontend Development',
      description:
        'I build responsive, accessible interfaces in React — from component architecture to polished micro-interactions, without relying on heavy UI frameworks.',
    },
    {
      icon: Layers,
      title: 'Full-Stack Implementation',
      description:
        'Comfortable across the MERN stack and Python/Django, connecting frontend to real APIs, databases, and services like Firebase.',
    },
    {
      icon: Bug,
      title: 'Quality-Focused Development',
      description:
        'I test as I build — cross-browser checks, edge cases, and UAT-style thinking — so fewer bugs reach production in the first place.',
    },
    {
      icon: Gauge,
      title: 'Performance & Polish',
      description:
        'Attention to load times, image optimization, and UX details that make a product feel finished rather than just functional.',
    },
  ];

  return (
    <section
      id="capabilities"
      className={`services-section section-reveal ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className="services-glow" />

      <div className={`services-container stagger-children ${isVisible ? 'visible' : ''}`}>
        <div className="services-header">
          <span className="services-label">What I Bring</span>
          <h2 className="services-title">
            How I <span className="services-highlight">Add Value</span>
          </h2>
          <p className="services-subtitle">
            A quick look at where I focus and what I care about when building
          </p>
        </div>

        <div className="services-grid">
          {capabilities.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="service-card">
                <div className="service-icon-wrapper">
                  <Icon className="service-icon" />
                </div>
                <h3 className="service-title">{item.title}</h3>
                <p className="service-description">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;