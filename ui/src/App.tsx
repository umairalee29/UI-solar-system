import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Scene } from './components/SolarSystem/Scene';
import { InfoPanel } from './components/InfoPanel/InfoPanel';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { usePlanets } from './hooks/usePlanets';
import { useSelection } from './hooks/useSelection';
import styles from './App.module.css';

export default function App() {
  const { planets, loading, error } = usePlanets();
  const { selected, detailedPlanet, loadingDetail, selectPlanet, selectMoon, clear } = useSelection();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') clear();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [clear]);

  const selectedPlanetId =
    selected?.type === 'planet' ? selected.planet.id :
    selected?.type === 'moon' ? selected.parentPlanet.id :
    null;

  return (
    <div className={styles.app}>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {error && (
        <div className={styles.error}>
          {error} — <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && (
        <Scene
          planets={planets}
          selectedPlanetId={selectedPlanetId}
          onSelectPlanet={selectPlanet}
          onSelectMoon={selectMoon}
        />
      )}

      <InfoPanel
        selected={selected}
        detailedPlanet={detailedPlanet}
        loadingDetail={loadingDetail}
        onClose={clear}
        onSelectMoon={selectMoon}
      />

      <div className={styles.hint}>
        <span>Scroll to zoom</span>
        <span>Drag to rotate</span>
        <span>Click a planet to explore</span>
      </div>
    </div>
  );
}
