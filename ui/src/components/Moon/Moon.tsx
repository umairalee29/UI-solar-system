import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Mesh, Group } from 'three';
import type { Moon as MoonType } from '../../types/solar';
import { generatePlanetTexture } from '../../utils/planetTextures';

interface Props {
  moon: MoonType;
  index: number;
  parentPosition: Vector3;
  onSelect: (moon: MoonType) => void;
}

const MOON_ORBIT_BASE = 3.5;
const MOON_SIZE_BASE = 0.18;

export function Moon({ moon, index, onSelect }: Props) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const texture = useMemo(() => generatePlanetTexture('moon'), []);

  const orbitRadius = MOON_ORBIT_BASE + index * 1.4;
  const orbitSpeed = 0.8 / (index + 1);
  const size = Math.max(MOON_SIZE_BASE, Math.min(moon.meanRadius / 5000, 0.45));
  const initialAngle = (index * Math.PI * 2) / 6;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, initialAngle, 0]}>
      <mesh
        ref={meshRef}
        position={[orbitRadius, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect(moon); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}
