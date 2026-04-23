import { useState, useEffect } from 'react';
import type { Planet } from '../types/solar';
import { getPlanets } from '../services/api';

interface UsePlanetsResult {
  planets: Planet[];
  loading: boolean;
  error: string | null;
}

export function usePlanets(): UsePlanetsResult {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getPlanets();
        if (!cancelled) {
          setPlanets(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          try {
            const fallback = await import('../data/planets-fallback.json');
            setPlanets(fallback.default as Planet[]);
          } catch {
            setError('Failed to load planet data');
          } finally {
            setLoading(false);
          }
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { planets, loading, error };
}
