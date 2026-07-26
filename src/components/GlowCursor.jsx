import React, { useEffect, useRef } from 'react';

const GlowCursor = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const glowElement = glowRef.current;
    if (!glowElement) return;

    const handleMouseMove = (e) => {
      const x = e.clientX - 175;
      const y = e.clientY - 175;
      glowElement.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = () => {
      glowElement.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      glowElement.style.opacity = '1';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, 
            rgba(124, 109, 240, 0.08) 0%, 
            rgba(124, 109, 240, 0.04) 30%, 
            rgba(124, 109, 240, 0.015) 55%, 
            transparent 75%
          )`,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(0px, 0px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
          transition: 'none',
        }}
      />
    </>
  );
};

export default GlowCursor;