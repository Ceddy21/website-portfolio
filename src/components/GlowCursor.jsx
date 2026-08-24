import React, { useEffect, useRef } from 'react';

const GlowCursor = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const glowElement = glowRef.current;
    if (!glowElement) return;

    const handleMouseMove = (e) => {
      // Position the element's center exactly at the cursor
      glowElement.style.left = e.clientX + 'px';
      glowElement.style.top = e.clientY + 'px';
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
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center, 
          rgba(124, 109, 240, 0.08) 0%, 
          rgba(124, 109, 240, 0.04) 30%, 
          rgba(124, 109, 240, 0.015) 55%, 
          transparent 75%
        )`,
        pointerEvents: 'none',
        zIndex: 9999,
        // Center the element on the left/top position
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen',
        willChange: 'left, top',
        transition: 'none',
        // Reset any default positioning
        left: 0,
        top: 0,
      }}
    />
  );
};

export default GlowCursor;