import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Group, Mesh } from 'three';
import type { Planet as PlanetType } from '../../types/solar';
import { PLANET_CONFIGS } from '../../types/solar';
import { PLANET_DESCRIPTIONS } from '../../data/planetDescriptions';
import { generatePlanetTexture } from '../../utils/planetTextures';
import { Moon } from '../Moon/Moon';

// Visual position/scale for each carousel offset
const SLOT: Record<number, { x: number; z: number; s: number }> = {
  0:  { x:  0,  z:  0,   s: 1.0  },
  1:  { x:  13, z: -3,   s: 0.48 },
  2:  { x:  22, z: -6,   s: 0.28 },
  3:  { x:  29, z: -9,   s: 0.16 },
  4:  { x:  35, z: -12,  s: 0.06 },
  '-1': { x: -13, z: -3,  s: 0.48 },
  '-2': { x: -22, z: -6,  s: 0.28 },
  '-3': { x: -29, z: -9,  s: 0.16 },
  '-4': { x: -35, z: -12, s: 0.06 },
};

function slotFor(offset: number) {
  const key = Math.max(-4, Math.min(4, offset));
  return SLOT[key] ?? SLOT[4];
}

interface Props {
  planet: PlanetType;
  planetIndex: number;
  currentIndex: number;
  totalPlanets: number;
  onNavigate: (dir: 1 | -1) => void;
  onMoonWorldPos: (id: string, pos: [number, number, number]) => void;
  onSelectMoon: (moon: import('../../types/solar').Moon, planet: PlanetType) => void;
}

export function CarouselPlanet({
  planet, planetIndex, currentIndex, totalPlanets,
  onNavigate, onMoonWorldPos, onSelectMoon,
}: Props) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const config = PLANET_CONFIGS[planet.id];
  const texture = useMemo(() => generatePlanetTexture(planet.id), [planet.id]);
  const desc = PLANET_DESCRIPTIONS[planet.id];

  const targetPos = useRef(new Vector3());
  const targetScale = useRef(1);
  const spinRef = useRef(0);

  // Compute signed offset in [-4, 4] range (shortest path around carousel)
  let raw = planetIndex - currentIndex;
  if (raw > totalPlanets / 2) raw -= totalPlanets;
  if (raw < -totalPlanets / 2) raw += totalPlanets;
  const offset = Math.max(-4, Math.min(4, raw));

  const slot = slotFor(offset);
  targetPos.current.set(slot.x, 0, slot.z);
  targetScale.current = slot.s;

  const isFeatured = offset === 0;
  const baseSize = config?.size ?? 1;
  const glowColor = desc?.glowColor ?? '#4a90d9';

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(targetPos.current, 0.08);
    const cs = groupRef.current.scale.x;
    const ts = targetScale.current;
    groupRef.current.scale.setScalar(cs + (ts - cs) * 0.08);

    // Slow self-rotation on featured planet
    if (isFeatured && meshRef.current) {
      spinRef.current += delta * 0.04;
      meshRef.current.rotation.y = spinRef.current;
    }
  });

  if (!config) return null;

  return (
    <group ref={groupRef} position={[slot.x, 0, slot.z]}>
      {/* Clickable non-featured planet navigates to it */}
      <mesh
        ref={meshRef}
        onClick={isFeatured ? undefined : () => onNavigate(offset > 0 ? 1 : -1)}
        onPointerOver={isFeatured ? undefined : () => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={isFeatured ? undefined : () => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[baseSize, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={isFeatured ? glowColor : '#000000'}
          emissiveIntensity={isFeatured ? 0.12 : 0}
        />
      </mesh>

      {/* Saturn rings */}
      {config.hasRings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseSize * 1.4, baseSize * 2.4, 64]} />
          <meshBasicMaterial color={config.ringColor ?? '#c2a060'} transparent opacity={0.7} side={2} />
        </mesh>
      )}

      {/* Atmospheric glow — only on featured planet */}
      {isFeatured && (
        <>
          <mesh>
            <sphereGeometry args={[baseSize * 1.09, 32, 32]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.07} depthWrite={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[baseSize * 1.22, 32, 32]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.035} depthWrite={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[baseSize * 1.42, 32, 32]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.015} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* Moons orbit around featured planet */}
      {isFeatured && planet.moons.slice(0, 5).map((moon, i) => (
        <Moon
          key={moon.id}
          moon={moon}
          index={i}
          isSelected={false}
          paused={false}
          onSelect={(m) => onSelectMoon(m, planet)}
          onWorldPos={onMoonWorldPos}
        />
      ))}
    </group>
  );
}
