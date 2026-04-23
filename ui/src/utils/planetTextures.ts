import { CanvasTexture } from 'three';

interface PlanetStyle {
  base: string;
  highlights?: string[];
  bands?: { color: string; y: number; width: number }[];
  poles?: string;
  craterDensity?: number;
}

const PLANET_STYLES: Record<string, PlanetStyle> = {
  mercure:  { base: '#9a8c84', highlights: ['#c0b0a8', '#6a5e58'], craterDensity: 30 },
  venus:    { base: '#e8c88a', highlights: ['#f5dda0', '#c49a40'], bands: [{ color: '#d4a860', y: 0.5, width: 0.15 }] },
  terre:    { base: '#1a5c8a', highlights: ['#2a7c3a', '#4a9c5a', '#c8d8e8'], bands: [
    { color: '#2a7c3a', y: 0.35, width: 0.22 },
    { color: '#2a7c3a', y: 0.65, width: 0.18 },
    { color: '#c8d8e8', y: 0.08, width: 0.12 },
    { color: '#c8d8e8', y: 0.92, width: 0.12 },
  ]},
  mars:     { base: '#c1440e', highlights: ['#e05a20', '#8a2a04'], craterDensity: 20, poles: '#ece8dc' },
  jupiter:  { base: '#c88b3a', highlights: ['#e0a86a', '#a06020'], bands: [
    { color: '#d4a060', y: 0.28, width: 0.10 },
    { color: '#9a6030', y: 0.38, width: 0.08 },
    { color: '#d4a060', y: 0.52, width: 0.12 },
    { color: '#8a5020', y: 0.62, width: 0.07 },
    { color: '#d4a060', y: 0.72, width: 0.09 },
  ]},
  saturne:  { base: '#e4d090', highlights: ['#f0e0a8', '#c0a860'], bands: [
    { color: '#d4c080', y: 0.38, width: 0.08 },
    { color: '#c8a870', y: 0.55, width: 0.07 },
  ]},
  uranus:   { base: '#7de8e8', highlights: ['#9efafa', '#5cc8c8'] },
  neptune:  { base: '#1a4acc', highlights: ['#2a5aec', '#0a2a8c'], bands: [
    { color: '#2050d0', y: 0.44, width: 0.06 },
  ]},
  sun:      { base: '#ff8800', highlights: ['#ffaa00', '#ff6600', '#ff4400'], bands: [
    { color: '#ffa000', y: 0.33, width: 0.08 },
    { color: '#ff7000', y: 0.66, width: 0.08 },
  ]},
  moon:     { base: '#a0a0a0', highlights: ['#c0c0c0', '#808080'], craterDensity: 25 },
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generatePlanetTexture(planetId: string, size = 512): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const style = PLANET_STYLES[planetId] ?? PLANET_STYLES['terre'];
  const rand = seededRandom(planetId.charCodeAt(0) * 31 + planetId.length * 17);

  // Base color
  ctx.fillStyle = style.base;
  ctx.fillRect(0, 0, size, size);

  // Subtle noise overlay
  for (let i = 0; i < 4000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = rand() * 2 + 0.5;
    const alpha = rand() * 0.12;
    const highlight = style.highlights?.[Math.floor(rand() * (style.highlights.length))] ?? style.base;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = highlight + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
  }

  // Atmospheric bands
  if (style.bands) {
    for (const band of style.bands) {
      const yPos = band.y * size;
      const h = band.width * size;
      const grad = ctx.createLinearGradient(0, yPos - h, 0, yPos + h);
      grad.addColorStop(0, band.color + '00');
      grad.addColorStop(0.5, band.color + 'cc');
      grad.addColorStop(1, band.color + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, yPos - h, size, h * 2);
    }
  }

  // Polar caps
  if (style.poles) {
    const capH = size * 0.08;
    // north
    const northGrad = ctx.createLinearGradient(0, 0, 0, capH);
    northGrad.addColorStop(0, style.poles + 'dd');
    northGrad.addColorStop(1, style.poles + '00');
    ctx.fillStyle = northGrad;
    ctx.fillRect(0, 0, size, capH);
    // south
    const southGrad = ctx.createLinearGradient(0, size - capH, 0, size);
    southGrad.addColorStop(0, style.poles + '00');
    southGrad.addColorStop(1, style.poles + 'dd');
    ctx.fillStyle = southGrad;
    ctx.fillRect(0, size - capH, size, capH);
  }

  // Impact craters
  if (style.craterDensity) {
    for (let i = 0; i < style.craterDensity; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = rand() * (size * 0.04) + size * 0.005;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fill();
    }
  }

  return new CanvasTexture(canvas);
}
