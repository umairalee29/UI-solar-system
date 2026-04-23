import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Scene } from './components/SolarSystem/Scene';
import { InfoPanel } from './components/InfoPanel/InfoPanel';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { usePlanets } from './hooks/usePlanets';
import { useSelection } from './hooks/useSelection';
import type { Moon, Planet } from './types/solar';
import styles from './App.module.css';

export default function App() {
  const { planets, loading, error } = usePlanets();
  const {
    selected, detailedPlanet, loadingDetail,
    paused, flyTarget,
    selectPlanet, selectMoon, clear,
  } = useSelection();

  // Populated each frame by Moon components — keyed by moon.id
  const moonWorldPos = useRef<Map<string, [number, number, number]>>(new Map());

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') clear(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [clear]);

  const selectedPlanetId =
    selected?.type === 'planet' ? selected.planet.id :
    selected?.type === 'moon'   ? selected.parentPlanet.id :
    null;

  const selectedMoonId = selected?.type === 'moon' ? selected.moon.id : null;

  const handleMoonWorldPos = useCallback((id: string, pos: [number, number, number]) => {
    moonWorldPos.current.set(id, pos);
  }, []);

  // Both InfoPanel moon clicks and 3D moon clicks route through here so world pos is always resolved
  const handleSelectMoon = useCallback((moon: Moon, parentPlanet: Planet) => {
    const pos = moonWorldPos.current.get(moon.id) ?? [0, 0, 0] as [number, number, number];
    selectMoon(moon, parentPlanet, pos);
  }, [selectMoon]);

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

      {/* Heading */}
      <div className={styles.heading}>
        <h1 className={styles.headingTitle}>Solar System</h1>
        <div className={styles.headingRule} />
      </div>

      {!loading && (
        <Scene
          planets={planets}
          selectedPlanetId={selectedPlanetId}
          selectedMoonId={selectedMoonId}
          paused={paused}
          flyTarget={flyTarget}
          onSelectPlanet={selectPlanet}
          onSelectMoon={handleSelectMoon}
          onMoonWorldPos={handleMoonWorldPos}
        />
      )}

      <InfoPanel
        selected={selected}
        detailedPlanet={detailedPlanet}
        loadingDetail={loadingDetail}
        onClose={clear}
        onSelectMoon={handleSelectMoon}
      />

      <div className={styles.hint}>
        <span>Scroll to zoom</span>
        <span>Drag to rotate</span>
        <span>Click a planet to explore</span>
      </div>
    </div>
  );
}
