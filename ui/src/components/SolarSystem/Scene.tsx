import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Sun } from '../Sun/Sun';
import { Planet } from '../Planet/Planet';
import { OrbitRing } from '../OrbitRing/OrbitRing';
import { PLANET_CONFIGS } from '../../types/solar';
import type { Planet as PlanetType, Moon as MoonType } from '../../types/solar';

interface Props {
  planets: PlanetType[];
  selectedPlanetId: string | null;
  onSelectPlanet: (planet: PlanetType) => void;
  onSelectMoon: (moon: MoonType, planet: PlanetType) => void;
}

export function Scene({ planets, selectedPlanetId, onSelectPlanet, onSelectMoon }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 60, 130], fov: 55, near: 0.1, far: 2000 }}
      style={{ width: '100vw', height: '100vh', background: '#000005' }}
    >
      <ambientLight intensity={0.08} />

      <Stars radius={300} depth={60} count={6000} factor={4} saturation={0} fade speed={0.5} />

      <Suspense fallback={null}>
        <Sun />

        {planets.map((planet) => {
          const config = PLANET_CONFIGS[planet.id];
          if (!config) return null;
          return (
            <group key={planet.id}>
              <OrbitRing radius={config.orbitRadius} />
              <Planet
                planet={planet}
                config={config}
                isSelected={selectedPlanetId === planet.id}
                onSelect={onSelectPlanet}
                onSelectMoon={onSelectMoon}
                showMoons={selectedPlanetId === planet.id}
              />
            </group>
          );
        })}
      </Suspense>

      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.2} />
      </EffectComposer>

      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={250}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
        makeDefault
      />
    </Canvas>
  );
}
