import { useEffect, useRef, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Showcase } from './components/Showcase/Showcase';
import { PlanetHero } from './components/PlanetHero/PlanetHero';
import { StatsSection } from './components/StatsSection/StatsSection';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { usePlanets } from './hooks/usePlanets';
import { useCarousel } from './hooks/useCarousel';
import { getPlanetById } from './services/api';
import type { Moon, Planet } from './types/solar';
import styles from './App.module.css';

export default function App() {
  const { planets, loading, error } = usePlanets();
  const { currentIndex, navigate, goTo, moonFlyTarget, selectMoon, clearMoon } =
    useCarousel(planets.length);

  const [detailedPlanet, setDetailedPlanet] = useState<Planet | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const moonWorldPos = useRef<Map<string, [number, number, number]>>(new Map());

  // Fetch full planet detail (with moons) when selection changes
  useEffect(() => {
    if (planets.length === 0) return;
    const planet = planets[currentIndex];
    setDetailedPlanet(planet);
    if (planet.moonCount > 0 && planet.moons.length === 0) {
      setLoadingDetail(true);
      getPlanetById(planet.id)
        .then((detail) => setDetailedPlanet(detail))
        .catch(() => { /* keep basic data */ })
        .finally(() => setLoadingDetail(false));
    } else {
      setLoadingDetail(false);
    }
  }, [currentIndex, planets]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape')     clearMoon();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, clearMoon]);

  const handleMoonWorldPos = useCallback((id: string, pos: [number, number, number]) => {
    moonWorldPos.current.set(id, pos);
  }, []);

  const handleSelectMoon = useCallback((moon: Moon, parentPlanet: Planet) => {
    const pos = moonWorldPos.current.get(moon.id) ?? ([0, 0, 0] as [number, number, number]);
    selectMoon(moon, parentPlanet, pos);
  }, [selectMoon]);

  const selectedPlanet = planets.length > 0 ? planets[currentIndex] : null;

  return (
    <div className={styles.root}>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {error && (
        <div className={styles.error}>
          {error} — <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <div className={styles.scroll}>
        {/* ── Sticky hero: 3D canvas + HTML overlay ── */}
        <div className={styles.hero}>
          {!loading && (
            <Showcase
              planets={planets}
              currentIndex={currentIndex}
              moonFlyTarget={moonFlyTarget}
              onNavigate={navigate}
              onMoonWorldPos={handleMoonWorldPos}
              onSelectMoon={handleSelectMoon}
            />
          )}
          <PlanetHero
            planet={selectedPlanet}
            currentIndex={currentIndex}
            totalPlanets={planets.length}
            onNavigate={navigate}
            onGoTo={goTo}
          />
        </div>

        {/* ── Stats scroll-behind section ── */}
        <div className={styles.stats}>
          <StatsSection
            planet={detailedPlanet}
            loadingDetail={loadingDetail}
            onSelectMoon={handleSelectMoon}
          />
        </div>
      </div>
    </div>
  );
}
