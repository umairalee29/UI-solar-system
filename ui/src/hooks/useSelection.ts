import { useState, useCallback } from 'react';
import type { Planet, Moon, SelectedBody } from '../types/solar';
import { getPlanetById } from '../services/api';
import { PLANET_CONFIGS } from '../types/solar';

export interface FlyTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface UseSelectionResult {
  selected: SelectedBody | null;
  detailedPlanet: Planet | null;
  loadingDetail: boolean;
  paused: boolean;
  flyTarget: FlyTarget | null;
  selectPlanet: (planet: Planet, worldPos: [number, number, number]) => void;
  selectMoon: (moon: Moon, parentPlanet: Planet, worldPos: [number, number, number]) => void;
  clear: () => void;
}

export function useSelection(): UseSelectionResult {
  const [selected, setSelected] = useState<SelectedBody | null>(null);
  const [detailedPlanet, setDetailedPlanet] = useState<Planet | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [paused, setPaused] = useState(false);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);

  const selectPlanet = useCallback(async (planet: Planet, worldPos: [number, number, number]) => {
    setSelected({ type: 'planet', planet });
    setPaused(true);

    const config = PLANET_CONFIGS[planet.id];
    const dist = config ? config.size * 5 + 6 : 10;
    const [px, py, pz] = worldPos;
    setFlyTarget({
      position: [px + dist * 0.7, py + dist * 0.35, pz + dist * 0.7],
      lookAt: [px, py, pz],
    });

    setLoadingDetail(true);
    try {
      const detailed = await getPlanetById(planet.id);
      setDetailedPlanet(detailed);
    } catch {
      setDetailedPlanet(planet);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const selectMoon = useCallback((moon: Moon, parentPlanet: Planet, worldPos: [number, number, number]) => {
    setSelected({ type: 'moon', moon, parentPlanet });
    const moonSize = Math.max(0.18, Math.min(moon.meanRadius / 5000, 0.45));
    const dist = moonSize * 6 + 1.5;
    const [mx, my, mz] = worldPos;
    setFlyTarget({
      position: [mx + dist, my + dist * 0.5, mz + dist],
      lookAt: [mx, my, mz],
    });
  }, []);

  const clear = useCallback(() => {
    setSelected(null);
    setDetailedPlanet(null);
    setPaused(false);
    // Fly back to the default overview camera position
    setFlyTarget({ position: [0, 60, 130], lookAt: [0, 0, 0] });
  }, []);

  return { selected, detailedPlanet, loadingDetail, paused, flyTarget, selectPlanet, selectMoon, clear };
}
