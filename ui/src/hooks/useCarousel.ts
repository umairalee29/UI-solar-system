import { useState, useCallback, useRef } from 'react';
import type { Planet, Moon } from '../types/solar';

export interface FlyTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface UseCarouselResult {
  currentIndex: number;
  transitioning: boolean;
  navigate: (dir: 1 | -1) => void;
  goTo: (index: number) => void;
  moonFlyTarget: FlyTarget | null;
  selectMoon: (moon: Moon, parentPlanet: Planet, worldPos: [number, number, number]) => void;
  clearMoon: () => void;
}

export function useCarousel(planetCount: number): UseCarouselResult {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [moonFlyTarget, setMoonFlyTarget] = useState<FlyTarget | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback((dir: 1 | -1) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrentIndex((i) => (i + dir + planetCount) % planetCount);
    setMoonFlyTarget(null);
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => setTransitioning(false), 700);
  }, [transitioning, planetCount]);

  const goTo = useCallback((index: number) => {
    if (transitioning || index === currentIndex) return;
    setTransitioning(true);
    setCurrentIndex(index);
    setMoonFlyTarget(null);
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => setTransitioning(false), 700);
  }, [transitioning, currentIndex]);

  const selectMoon = useCallback((moon: Moon, _parentPlanet: Planet, worldPos: [number, number, number]) => {
    const moonSize = Math.max(0.18, Math.min(moon.meanRadius / 5000, 0.45));
    const dist = moonSize * 6 + 1.5;
    const [mx, my, mz] = worldPos;
    setMoonFlyTarget({
      position: [mx + dist, my + dist * 0.5, mz + dist],
      lookAt: [mx, my, mz],
    });
  }, []);

  const clearMoon = useCallback(() => setMoonFlyTarget(null), []);

  return { currentIndex, transitioning, navigate, goTo, moonFlyTarget, selectMoon, clearMoon };
}
