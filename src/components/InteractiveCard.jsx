import React, { useState, useEffect } from 'react';
import styles from './InteractiveCard.module.css';

const InteractiveCard = () => {
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -30;
    const rotateY = ((x - rect.width / 2) / rect.width) * 30;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  const themeClass = isDarkMode ? 'dark' : 'light';

  return (
    <div className={`${styles.container} ${styles[themeClass]}`}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${styles[themeClass]}`}
      >
        {isDarkMode ? (
          <svg className={styles.themeIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className={styles.themeIcon} fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className={styles.cardWrapper}>
        <div
          className={`${styles.card} ${styles[themeClass]}`}
          style={{ transform }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.cardContent}>
            <div className={styles.header}>
              <div className={`${styles.iconContainer} ${styles[themeClass]}`}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className={`${styles.title} ${styles[themeClass]}`}>
                Interactive Card
              </h2>
              <p className={`${styles.description} ${styles[themeClass]}`}>
                Move your mouse around this card to see the amazing 3D hover effect in action. 
                The card responds to your cursor movement with smooth rotations.
              </p>
            </div>

            <div className={styles.footer}>
              <span className={`${styles.footerText} ${styles[themeClass]}`}>
                Hover me!
              </span>
            </div>
          </div>
          <div className={`${styles.glowEffect} ${styles[themeClass]} ${isHovered ? styles.visible : styles.hidden}`} />
        </div>
      </div>
    </div>
  );
};

export default InteractiveCard;