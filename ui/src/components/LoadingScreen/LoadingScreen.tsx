import { motion } from 'framer-motion';
import styles from './LoadingScreen.module.css';

export function LoadingScreen() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.solar}>
        <div className={styles.sun} />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={styles.orbit}
            style={{ '--i': i } as React.CSSProperties}
          >
            <div className={styles.planet} />
          </div>
        ))}
      </div>
      <motion.p
        className={styles.text}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Calculating orbits…
      </motion.p>
    </motion.div>
  );
}
