import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface Props {
  radius: number;
  segments?: number;
  opacity?: number;
}

export function OrbitRing({ radius, segments = 128, opacity = 0.38 }: Props) {
  const points = useMemo(() => {
    const pts: Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius, segments]);

  return (
    <Line points={points} color="#8ab0d0" transparent opacity={opacity} lineWidth={0.7} />
  );
}
