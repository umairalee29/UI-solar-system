import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute, Line as ThreeLine, LineBasicMaterial } from 'three';

interface ArcConfig {
  radius: number;
  tiltX: number;
  tiltZ: number;
  startAngle: number;
  endAngle: number;
  opacity: number;
}

const ARCS: ArcConfig[] = [
  { radius: 6.2,  tiltX:  0.0,  tiltZ: 0.08, startAngle: -0.6, endAngle: Math.PI * 1.8, opacity: 0.18 },
  { radius: 8.8,  tiltX:  0.42, tiltZ: 0.05, startAngle:  0.2, endAngle: Math.PI * 1.6, opacity: 0.13 },
  { radius: 11.5, tiltX: -0.26, tiltZ: 0.12, startAngle: -0.3, endAngle: Math.PI * 1.9, opacity: 0.09 },
];

function Arc({ config, segments = 120 }: { config: ArcConfig; segments?: number }) {
  const lineObj = useMemo(() => {
    const { radius, tiltX, tiltZ, startAngle, endAngle } = config;
    const geo = new BufferGeometry();
    const positions: number[] = [];
    const range = endAngle - startAngle;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = startAngle + t * range;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const yt = y * Math.cos(tiltX);
      const zt = y * Math.sin(tiltX);
      const xf = x * Math.cos(tiltZ) - zt * Math.sin(tiltZ);
      const yf = yt;
      const zf = x * Math.sin(tiltZ) + zt * Math.cos(tiltZ);
      positions.push(xf, yf, zf);
    }
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    const mat = new LineBasicMaterial({ color: '#8ab4cc', transparent: true, opacity: config.opacity, depthWrite: false });
    return new ThreeLine(geo, mat);
  }, [config, segments]);

  return <primitive object={lineObj} />;
}

export function OrbitArcs() {
  return (
    <group>
      {ARCS.map((arc, i) => (
        <Arc key={i} config={arc} />
      ))}
    </group>
  );
}
