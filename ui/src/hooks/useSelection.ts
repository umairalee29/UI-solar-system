import { useState, useCallback } from 'react';
import type { Planet, Moon, SelectedBody } from '../types/solar';
import { getPlanetById } from '../services/api';

interface UseSelectionResult {
  selected: SelectedBody | null;
  detailedPlanet: Planet | null;
  loadingDetail: boolean;
  selectPlanet: (planet: Planet) => void;
  selectMoon: (moon: Moon, parentPlanet: Planet) => void;
  clear: () => void;
}

export function useSelection(): UseSelectionResult {
  const [selected, setSelected] = useState<SelectedBody | null>(null);
  const [detailedPlanet, setDetailedPlanet] = useState<Planet | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const selectPlanet = useCallback(async (planet: Planet) => {
    setSelected({ type: 'planet', planet });
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

  const selectMoon = useCallback((moon: Moon, parentPlanet: Planet) => {
    setSelected({ type: 'moon', moon, parentPlanet });
  }, []);

  const clear = useCallback(() => {
    setSelected(null);
    setDetailedPlanet(null);
  }, []);

  return { selected, detailedPlanet, loadingDetail, selectPlanet, selectMoon, clear };
}
