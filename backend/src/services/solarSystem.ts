import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getCache, setCache } from '../middleware/cache';
import type { ApiBody, Planet, Moon } from '../types';

function loadFallback(): Planet[] {
  const jsonPath = path.resolve(__dirname, '../../../data/planets-fallback.json');
  return JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Planet[];
}

const BASE = 'https://api.le-systeme-solaire.net/rest';
const API_KEY = process.env.SOLAR_API_KEY ?? '';

function mapMoon(body: ApiBody): Moon {
  return {
    id: body.id,
    name: body.name,
    englishName: body.englishName,
    meanRadius: body.meanRadius,
    semimajorAxis: body.semimajorAxis,
    sideralOrbit: body.sideralOrbit,
    discoveredBy: body.discoveredBy,
    discoveryDate: body.discoveryDate,
  };
}

function mapPlanet(body: ApiBody, moons: Moon[]): Planet {
  return {
    id: body.id,
    name: body.name,
    englishName: body.englishName,
    isPlanet: body.isPlanet,
    moons,
    moonCount: moons.length,
    semimajorAxis: body.semimajorAxis,
    perihelion: body.perihelion,
    aphelion: body.aphelion,
    eccentricity: body.eccentricity,
    inclination: body.inclination,
    mass: body.mass,
    vol: body.vol,
    density: body.density,
    gravity: body.gravity,
    escape: body.escape,
    meanRadius: body.meanRadius,
    equaRadius: body.equaRadius,
    polarRadius: body.polarRadius,
    flattening: body.flattening,
    dimension: body.dimension,
    sideralOrbit: body.sideralOrbit,
    sideralRotation: body.sideralRotation,
    aroundPlanet: null,
    discoveredBy: body.discoveredBy,
    discoveryDate: body.discoveryDate,
    alternativeName: body.alternativeName,
    axialTilt: body.axialTilt,
    avgTemp: body.avgTemp,
    mainAnomaly: body.mainAnomaly,
    argPeriapsis: body.argPeriapsis,
    longAscNode: body.longAscNode,
  };
}

async function fetchBody(id: string): Promise<ApiBody> {
  const cacheKey = `body:${id}`;
  const cached = getCache<ApiBody>(cacheKey);
  if (cached) return cached;

  const headers = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};
  const { data } = await axios.get<ApiBody>(`${BASE}/bodies/${id}`, { headers });
  setCache(cacheKey, data);
  return data;
}

async function fetchFromLiveApi(): Promise<Planet[]> {
  const headers = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};
  const { data } = await axios.get<{ bodies: ApiBody[] }>(
    `${BASE}/bodies/?filter[]=isPlanet,eq,true`,
    { headers, timeout: 8000 }
  );
  return data.bodies.map((b) =>
    mapPlanet(b, (b.moons ?? []).map((m) => ({
      id: m.moon, name: m.moon, englishName: m.moon,
      meanRadius: 0, semimajorAxis: 0, sideralOrbit: 0,
      discoveredBy: '', discoveryDate: '',
    })))
  );
}

export async function getAllPlanets(): Promise<Planet[]> {
  const cacheKey = 'planets:all';
  const cached = getCache<Planet[]>(cacheKey);
  if (cached) return cached;

  // Live API requires SOLAR_API_KEY; fall back to bundled data otherwise
  if (API_KEY) {
    try {
      const planets = await fetchFromLiveApi();
      setCache(cacheKey, planets);
      return planets;
    } catch (err) {
      console.warn('[solarSystem] Live API failed, using static data:', err);
    }
  }

  const planets = loadFallback();
  setCache(cacheKey, planets);
  return planets;
}

export async function getPlanetById(id: string): Promise<Planet | null> {
  const cacheKey = `planet:${id}`;
  const cached = getCache<Planet>(cacheKey);
  if (cached) return cached;

  // If no API key, find in static data
  if (!API_KEY) {
    const planet = loadFallback().find((p) => p.id === id) ?? null;
    if (planet) setCache(cacheKey, planet);
    return planet;
  }

  try {
    const body = await fetchBody(id);
    if (!body.isPlanet) return null;

    const moonRefs = (body.moons ?? []).slice(0, 20);
    const moonBodies = await Promise.all(
      moonRefs.map((m) => fetchBody(m.moon).catch(() => null))
    );
    const moons: Moon[] = moonBodies
      .filter((m): m is ApiBody => m !== null)
      .map(mapMoon);

    const planet = mapPlanet(body, moons);
    setCache(cacheKey, planet);
    return planet;
  } catch {
    const planet = loadFallback().find((p) => p.id === id) ?? null;
    if (planet) setCache(cacheKey, planet);
    return planet;
  }
}
