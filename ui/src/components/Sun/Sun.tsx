import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { generatePlanetTexture } from '../../utils/planetTextures';

export function Sun() {
  const meshRef = useRef<Mesh>(null);
  const texture = useMemo(() => generatePlanetTexture('sun'), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      <pointLight intensity={3} distance={500} decay={0.5} color="#fff5cc" />
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial map={texture} emissive="#ff6600" emissiveIntensity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[5.8, 32, 32]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.05} />
      </mesh>
      <mesh>
        <sphereGeometry args={[6.4, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}
