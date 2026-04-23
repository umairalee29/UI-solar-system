export interface Moon {
  id: string;
  name: string;
  englishName: string;
  meanRadius: number;
  semimajorAxis: number;
  sideralOrbit: number;
  discoveredBy: string;
  discoveryDate: string;
}

export interface Planet {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  moons: Moon[];
  moonCount: number;
  semimajorAxis: number;
  perihelion: number;
  aphelion: number;
  eccentricity: number;
  inclination: number;
  mass: { massValue: number; massExponent: number } | null;
  vol: { volValue: number; volExponent: number } | null;
  density: number;
  gravity: number;
  escape: number;
  meanRadius: number;
  equaRadius: number;
  polarRadius: number;
  flattening: number;
  dimension: string;
  sideralOrbit: number;
  sideralRotation: number;
  aroundPlanet: null;
  discoveredBy: string;
  discoveryDate: string;
  alternativeName: string;
  axialTilt: number;
  avgTemp: number;
  mainAnomaly: number;
  argPeriapsis: number;
  longAscNode: number;
}

export type SelectedBody =
  | { type: 'planet'; planet: Planet }
  | { type: 'moon'; moon: Moon; parentPlanet: Planet };

// Visual config per planet (not from API)
export interface PlanetConfig {
  id: string;
  textureFile: string;
  orbitRadius: number;
  size: number;
  orbitSpeed: number;
  rotationSpeed: number;
  tilt: number;
  hasRings?: boolean;
  ringColor?: string;
}

export const PLANET_CONFIGS: Record<string, PlanetConfig> = {
  mercure: { id: 'mercure', textureFile: 'mercury.jpg', orbitRadius: 14, size: 0.55, orbitSpeed: 1.607, rotationSpeed: 0.003, tilt: 0.034 },
  venus:   { id: 'venus',   textureFile: 'venus.jpg',   orbitRadius: 20, size: 1.35, orbitSpeed: 1.174, rotationSpeed: -0.002, tilt: 177.36 },
  terre:   { id: 'terre',   textureFile: 'earth.jpg',   orbitRadius: 28, size: 1.4,  orbitSpeed: 1.0,   rotationSpeed: 0.01,  tilt: 23.44 },
  mars:    { id: 'mars',    textureFile: 'mars.jpg',     orbitRadius: 37, size: 0.75, orbitSpeed: 0.808, rotationSpeed: 0.009, tilt: 25.19 },
  jupiter: { id: 'jupiter', textureFile: 'jupiter.jpg', orbitRadius: 56, size: 4.8,  orbitSpeed: 0.434, rotationSpeed: 0.04,  tilt: 3.13 },
  saturne: { id: 'saturne', textureFile: 'saturn.jpg',  orbitRadius: 76, size: 4.0,  orbitSpeed: 0.323, rotationSpeed: 0.038, tilt: 26.73, hasRings: true, ringColor: '#c2a060' },
  uranus:  { id: 'uranus',  textureFile: 'uranus.jpg',  orbitRadius: 94, size: 2.5,  orbitSpeed: 0.228, rotationSpeed: -0.03, tilt: 97.77 },
  neptune: { id: 'neptune', textureFile: 'neptune.jpg', orbitRadius: 110, size: 2.4, orbitSpeed: 0.182, rotationSpeed: 0.032, tilt: 28.32 },
};
