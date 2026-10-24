import React, { useCallback, useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react';
import styles from './InteractiveCard.module.css';

const MAX_TILT = 18; // degrees — restrained, editorial
const KEY_STEP = 6;

export default function InteractiveCard(): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem('theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();

  // Pointer position, normalised to [-0.5, 0.5] from card centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Glare position in % (0–100).
  const gx = useMotionValue(50);
  const gy = useMotionValue(20);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.9 };
  const rotateX = useSpring(py, springConfig);
  const rotateY = useSpring(px, springConfig);
  const scale = useSpring(1, springConfig);

  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 30%, transparent 60%)`;
  // Foil hue shifts with tilt.
  const foilFilter = useMotionTemplate`hue-rotate(${px}deg) saturate(1.4)`;

  useEffect(() => {
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      px.set(nx * MAX_TILT * 2);
      py.set(ny * -MAX_TILT * 2);
      gx.set((nx + 0.5) * 100);
      gy.set((ny + 0.5) * 100);
    },
    [reducedMotion, px, py, gx, gy],
  );

  const handleEnter = useCallback(() => {
    if (reducedMotion) return;
    setActive(true);
    scale.set(1.04);
  }, [reducedMotion, scale]);

  const resetTilt = useCallback(() => {
    setActive(false);
    scale.set(1);
    px.set(0);
    py.set(0);
    gx.set(50);
    gy.set(20);
  }, [px, py, gx, gy, scale]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      let handled = true;
      switch (e.key) {
        case 'ArrowLeft':
          px.set(Math.max(px.get() - KEY_STEP, -MAX_TILT));
          break;
        case 'ArrowRight':
          px.set(Math.min(px.get() + KEY_STEP, MAX_TILT));
          break;
        case 'ArrowUp':
          py.set(Math.max(py.get() - KEY_STEP, -MAX_TILT));
          break;
        case 'ArrowDown':
          py.set(Math.min(py.get() + KEY_STEP, MAX_TILT));
          break;
        case 'Escape':
        case 'Enter':
        case ' ':
          resetTilt();
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        setActive(true);
        scale.set(1.04);
      }
    },
    [reducedMotion, px, py, resetTilt, scale],
  );

  const themeClass = isDarkMode ? styles.dark : styles.light;

  const cardHandlers = reducedMotion
    ? {}
    : {
        onPointerMove: handlePointerMove,
        onPointerEnter: handleEnter,
        onPointerLeave: resetTilt,
        onPointerCancel: resetTilt,
        onKeyDown: handleKeyDown,
        onBlur: resetTilt,
      };

  return (
    <div className={`${styles.container} ${themeClass}`}>
      <button
        type="button"
        onClick={() => setIsDarkMode((d) => !d)}
        aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
        className={`${styles.themeToggle} ${themeClass}`}
      >
        {isDarkMode ? (
          <svg className={styles.themeIcon} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className={styles.themeIcon} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className={styles.cardWrapper}>
        <motion.div
          className={`${styles.card} ${themeClass}`}
          style={
            reducedMotion
              ? undefined
              : {
                  rotateX,
                  rotateY,
                  scale,
                  transformPerspective: 900,
                }
          }
          tabIndex={0}
          role="group"
          aria-label="Interactive holographic tilt card. Use arrow keys to tilt, Escape to reset."
          data-active={active ? 'true' : 'false'}
          data-testid="tilt-card"
          {...cardHandlers}
        >
          {/* foil / hologram layer — hue shifts as the card tilts */}
          <motion.div className={styles.foil} style={{ filter: foilFilter }} />
          {/* cursor glare */}
          <motion.div className={styles.glare} style={{ background: glare }} />
          {/* depth layers */}
          <div className={styles.cardContent}>
            <div className={styles.depth1}>
              <span className={`${styles.brand} ${themeClass}`}>PRISM</span>
              <span className={`${styles.tier} ${themeClass}`}>HOLO · SERIES 01</span>
            </div>
            <div className={styles.depth2}>
              <span className={`${styles.chip} ${themeClass}`} aria-hidden="true" />
              <p className={`${styles.number} ${themeClass}`}>4242 ···· ···· 0042</p>
              <div className={styles.metaRow}>
                <span className={`${styles.meta} ${themeClass}`}>MEMBER · X.Ə.</span>
                <span className={`${styles.meta} ${themeClass}`}>EXP · 10/29</span>
              </div>
            </div>
          </div>
        </motion.div>
        <p className={`${styles.hint} ${themeClass}`} data-testid="hint">
          {reducedMotion
            ? 'Reduced motion: static foil card'
            : 'Move, drag or arrow-key the card'}
        </p>
      </div>
    </div>
  );
}
