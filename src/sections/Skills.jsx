import React, { useEffect, useRef, useState } from 'react';
import {
  Palette,
  Server,
  Database,
  Key,
  Mail,
  Cloud,
  Rocket,
  Bug,
  Wrench,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

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
        rootMargin: '0px 0px -80px 0px',
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
    // 1. Frontend
    {
      title: 'Frontend',
      icon: Palette,
      skills: [
        'React 18',
        'React Router v6',
        'React Context API',
        'Tailwind CSS',
        'Axios',
        'React Icons',
        'React Hot Toast',
      ],
    },
    // 2. Backend
    {
      title: 'Backend',
      icon: Server,
      skills: [
        'Node.js',
        'Express.js',
        'JWT',
        'Passport.js',
        'bcryptjs',
        'Helmet',
        'CORS',
        'Rate Limit',
      ],
    },
    // 3. Database
    {
      title: 'Database',
      icon: Database,
      skills: ['MongoDB Atlas', 'Mongoose'],
    },
    // 4. Email & Storage
    {
      title: 'Email & Storage',
      icon: Mail,
      skills: ['Gmail API', 'nodemailer', 'Cloudinary', 'Multer'],
    },
    // 5. Deployment
    {
      title: 'Deployment',
      icon: Rocket,
      skills: ['Vercel', 'Render', 'MongoDB Atlas'],
    },
    // 6. QA & Tools
    {
      title: 'QA & Tools',
      icon: Wrench,
      skills: ['Manual Testing', 'UAT', 'Git', 'GitHub', 'VS Code'],
    },
  ];

  const softSkills = [
    'Time Management',
    'Attention to Detail',
    'Team Collaboration',
    'Communication',
    'Analytical Thinking',
    'Critical Thinking',
    'Adaptability',
    'Continuous Learning',
  ];

  return (
    <section
      id="skills"
      className={`skills-section section-reveal ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className="skills-glow" />

      <div className={`skills-container stagger-children ${isVisible ? 'visible' : ''}`}>
        <div className="skills-header">
          <span className="skills-label">Skills</span>
          <h2 className="skills-title">
            My <span className="skills-highlight">Tech Stack</span>
          </h2>

          {/* MERN Badge — Updated */}
          <div className="skills-badges">
            <span className="skills-badge mern">MERN</span>
            <span className="skills-badge">Full Stack</span>
            <span className="skills-badge">Auth & APIs</span>
            <span className="skills-badge">QA</span>
          </div>

          <p className="skills-subtitle">
            Full-stack technologies, authentication, cloud services, and deployment
          </p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, i) => {
            const Icon = group.icon;
            return (
              <div key={i} className="skill-group">
                <div className="skill-group-header">
                  <div className="skill-icon-wrapper">
                    <Icon />
                  </div>
                  <h3>{group.title}</h3>
                </div>
                <div className="skill-tags">
                  {group.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="skill-tag"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                        transition: `all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) ${0.3 + i * 0.1 + j * 0.05}s`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="soft-skills-wrapper">
          <div className="soft-skills-header">
            <div className="soft-skills-icon-wrapper">
              <Lightbulb />
            </div>
            <span className="soft-skills-label">Soft Skills</span>
            <div className="soft-skills-divider" />
            <Sparkles className="soft-skills-sparkle" />
          </div>

          <div className="soft-skills-list">
            {softSkills.map((skill, i) => (
              <span
                key={i}
                className="soft-skill"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
                  transition: `all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) ${0.6 + i * 0.04}s`,
                }}
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