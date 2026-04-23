import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Mesh, Group } from 'three';
import { Html } from '@react-three/drei';
import type { Planet as PlanetType, PlanetConfig, Moon as MoonType } from '../../types/solar';
import { generatePlanetTexture } from '../../utils/planetTextures';
import { Moon } from '../Moon/Moon';

interface Props {
  planet: PlanetType;
  config: PlanetConfig;
  isSelected: boolean;
  onSelect: (planet: PlanetType) => void;
  onSelectMoon: (moon: MoonType, planet: PlanetType) => void;
  showMoons: boolean;
}

export function Planet({ planet, config, isSelected, onSelect, onSelectMoon, showMoons }: Props) {
  const orbitGroupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => generatePlanetTexture(config.id), [config.id]);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angleRef.current += delta * config.orbitSpeed * 0.15;

    const x = Math.cos(angleRef.current) * config.orbitRadius;
    const z = Math.sin(angleRef.current) * config.orbitRadius;

    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.set(x, 0, z);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * config.rotationSpeed * 10;
    }
  });

  const ringTiltRad = (config.tilt * Math.PI) / 180;

  return (
    <group ref={orbitGroupRef}>
      <group rotation={[ringTiltRad, 0, 0]}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onSelect(planet); }}
          onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        >
          <sphereGeometry args={[config.size, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            emissive={isSelected ? '#4488ff' : hovered ? '#224466' : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : hovered ? 0.15 : 0}
          />
        </mesh>

        {config.hasRings && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[config.size * 1.4, config.size * 2.4, 64]} />
            <meshBasicMaterial color={config.ringColor ?? '#c2a060'} transparent opacity={0.7} side={2} />
          </mesh>
        )}

        {hovered && !isSelected && (
          <Html center distanceFactor={60} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              {planet.englishName}
            </div>
          </Html>
        )}
      </group>

      {showMoons && planet.moons.slice(0, 6).map((moon, i) => (
        <Moon
          key={moon.id}
          moon={moon}
          index={i}
          parentPosition={new Vector3(0, 0, 0)}
          onSelect={(m) => onSelectMoon(m, planet)}
        />
      ))}
    </group>
  );
}
