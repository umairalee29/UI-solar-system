import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Planet } from '../../types/solar';
import { PLANET_DESCRIPTIONS } from '../../data/planetDescriptions';
import styles from './PlanetHero.module.css';

interface Props {
  planet: Planet | null;
  currentIndex: number;
  totalPlanets: number;
  onNavigate: (dir: 1 | -1) => void;
  onGoTo: (i: number) => void;
}

export function PlanetHero({ planet, currentIndex, totalPlanets, onNavigate, onGoTo }: Props) {
  const desc = planet ? PLANET_DESCRIPTIONS[planet.id] : null;
  const [key, setKey] = useState(currentIndex);

  useEffect(() => {
    const t = setTimeout(() => setKey(currentIndex), 80); // slight delay so text fades after planet starts moving
    return () => clearTimeout(t);
  }, [currentIndex]);

  return (
    <div className={styles.overlay}>
      {/* ← arrow */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => onNavigate(-1)} aria-label="Previous planet">
        &#8592;
      </button>

      {/* → arrow */}
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => onNavigate(1)} aria-label="Next planet">
        &#8594;
      </button>

      {/* Bottom info block */}
      <div className={styles.info}>
        {/* Pagination dots */}
        <div className={styles.dots}>
          {Array.from({ length: totalPlanets }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              onClick={() => onGoTo(i)}
              aria-label={`Go to planet ${i + 1}`}
            />
          ))}
        </div>

        {/* Planet name + description — animate on change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={styles.textBlock}
          >
            {planet && (
              <>
                <h1 className={styles.planetName}>
                  <span className={styles.paren}>(</span>
                  {' '}{planet.englishName.toLowerCase()}{' '}
                  <span className={styles.paren}>)</span>
                </h1>
                {desc && <p className={styles.description}>{desc.description}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Scroll indicator */}
        <div className={styles.scrollHint}>
          <svg className={styles.mouse} viewBox="0 0 24 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="36" rx="11" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10.5" y="7" width="3" height="7" rx="1.5" fill="currentColor" />
          </svg>
          <svg className={styles.chevrons} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2l8 8 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 6l8 8 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
