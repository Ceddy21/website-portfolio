import React, { useEffect, useRef, useState } from 'react';

const Skills = () => {
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
        threshold: 0.2,
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

  const skillGroups = [
    {
      title: "Frontend",
      skills: ["React", "JavaScript", "HTML/CSS", "Tailwind", "Bootstrap"]
    },
    {
      title: "Backend",
      skills: ["Python", "Django", "Flask", "Firebase", "SQL"]
    },
    {
      title: "QA",
      skills: ["Manual Testing", "UAT", "Cross Browser", "Functional", "Responsive"]
    },
    {
      title: "Tools",
      skills: ["Git", "GitHub", "VS Code"]
    }
  ];

  const softSkills = [
    "Time Management",
    "Attention to Detail",
    "Team Collaboration",
    "Communication",
    "Analytical Thinking",
    "Critical Thinking",
    "Adaptability",
    "Continuous Learning"
  ];

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="skills-container">
        <div className="skills-header">
          <span className={`skills-label ${isVisible ? 'fade-in-up' : 'fade-out-down'}`}>
            02. Skills
          </span>
          <h2 className={`skills-title ${isVisible ? 'fade-in-up delay-1' : 'fade-out-down'}`}>
            My <span className="skills-highlight">Tech Stack</span>
          </h2>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <div 
              key={i} 
              className={`skill-group ${isVisible ? 'fade-in-up' : 'fade-out-down'}`}
              style={{ animationDelay: isVisible ? `${0.15 + i * 0.1}s` : '0s' }}
            >
              <div className="skill-group-header">
                <h3>{group.title}</h3>
              </div>
              <div className="skill-tags">
                {group.skills.map((skill, j) => (
                  <span 
                    key={j} 
                    className={`skill-tag ${isVisible ? 'fade-in-up' : 'fade-out-down'}`}
                    style={{ animationDelay: isVisible ? `${0.3 + i * 0.1 + j * 0.05}s` : '0s' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div 
          className={`soft-skills ${isVisible ? 'fade-in-up' : 'fade-out-down'}`}
          style={{ animationDelay: isVisible ? '0.5s' : '0s' }}
        >
          <div className="soft-skills-header">
            <div className="soft-skills-label">Soft Skills</div>
          </div>
          <div className="soft-skills-list">
            {softSkills.map((skill, i) => (
              <span 
                key={i} 
                className={`soft-skill ${isVisible ? 'fade-in-up' : 'fade-out-down'}`}
                style={{ animationDelay: isVisible ? `${0.6 + i * 0.04}s` : '0s' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;