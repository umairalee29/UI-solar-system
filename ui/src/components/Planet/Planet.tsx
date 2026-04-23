import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mesh, Group } from 'three';
import { Html } from '@react-three/drei';
import type { Planet as PlanetType, PlanetConfig, Moon as MoonType } from '../../types/solar';
import { generatePlanetTexture } from '../../utils/planetTextures';
import { Moon } from '../Moon/Moon';

interface Props {
  planet: PlanetType;
  config: PlanetConfig;
  isSelected: boolean;
  selectedMoonId: string | null;
  paused: boolean;
  onSelect: (planet: PlanetType, worldPos: [number, number, number]) => void;
  onSelectMoon: (moon: MoonType, planet: PlanetType) => void;
  onMoonWorldPos: (id: string, pos: [number, number, number]) => void;
  showMoons: boolean;
}

export function Planet({
  planet, config, isSelected, selectedMoonId, paused,
  onSelect, onSelectMoon, onMoonWorldPos, showMoons,
}: Props) {
  const orbitGroupRef = useRef<Group>(null);
  const scaleGroupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => generatePlanetTexture(config.id), [config.id]);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const hoverScaleRef = useRef(1);

  useFrame((_, delta) => {
    if (!paused) {
      angleRef.current += delta * config.orbitSpeed * 0.15;
      const x = Math.cos(angleRef.current) * config.orbitRadius;
      const z = Math.sin(angleRef.current) * config.orbitRadius;
      if (orbitGroupRef.current) orbitGroupRef.current.position.set(x, 0, z);
      if (meshRef.current) meshRef.current.rotation.y += delta * config.rotationSpeed * 10;
    }

    // Smooth hover scale
    const targetScale = hovered ? 1.1 : 1.0;
    hoverScaleRef.current += (targetScale - hoverScaleRef.current) * Math.min(delta * 10, 1);
    if (scaleGroupRef.current) scaleGroupRef.current.scale.setScalar(hoverScaleRef.current);
  });

  const ringTiltRad = (config.tilt * Math.PI) / 180;

  function handleClick(e: { stopPropagation: () => void }) {
    e.stopPropagation();
    const pos = orbitGroupRef.current?.position;
    onSelect(planet, pos ? [pos.x, pos.y, pos.z] : [0, 0, 0]);
  }

  return (
    <group ref={orbitGroupRef}>
      <group ref={scaleGroupRef}>
        <group rotation={[ringTiltRad, 0, 0]}>
          <mesh
            ref={meshRef}
            onClick={handleClick}
            onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
          >
            <sphereGeometry args={[config.size, 64, 64]} />
            <meshStandardMaterial
              map={texture}
              emissive={isSelected ? '#4488ff' : hovered ? '#3366cc' : '#000000'}
              emissiveIntensity={isSelected ? 0.35 : hovered ? 0.28 : 0}
            />
          </mesh>

          {/* Subtle glow halo on hover */}
          {hovered && !isSelected && (
            <mesh>
              <sphereGeometry args={[config.size * 1.18, 32, 32]} />
              <meshBasicMaterial color="#5588ff" transparent opacity={0.07} side={2} depthWrite={false} />
            </mesh>
          )}

          {config.hasRings && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.4, config.size * 2.4, 64]} />
              <meshBasicMaterial color={config.ringColor ?? '#c2a060'} transparent opacity={0.7} side={2} />
            </mesh>
          )}

          {/* Tooltip — always rendered so AnimatePresence can exit-animate */}
          <Html center distanceFactor={55} style={{ pointerEvents: 'none' }}>
            <AnimatePresence>
              {hovered && !isSelected && (
                <motion.div
                  key="tooltip"
                  initial={{ opacity: 0, y: 12, scale: 0.82 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    transform: 'translateY(-18px)',
                    background: 'linear-gradient(135deg, rgba(8,18,45,0.95) 0%, rgba(4,10,28,0.95) 100%)',
                    color: '#ffffff',
                    padding: '10px 22px 8px',
                    borderRadius: '28px',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(120, 170, 255, 0.5)',
                    boxShadow: '0 0 24px rgba(60, 120, 255, 0.28), 0 4px 16px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: '#e8f0ff',
                  }}>
                    {planet.englishName}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: 'rgba(140, 180, 255, 0.7)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                  }}>
                    click to explore
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Html>
        </group>
      </group>

      {showMoons && planet.moons.slice(0, 6).map((moon, i) => (
        <Moon
          key={moon.id}
          moon={moon}
          index={i}
          isSelected={selectedMoonId === moon.id}
          paused={paused}
          onSelect={(m) => onSelectMoon(m, planet)}
          onWorldPos={onMoonWorldPos}
        />
      ))}
    </group>
  );
}
