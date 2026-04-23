import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Sun } from '../Sun/Sun';
import { Planet } from '../Planet/Planet';
import { OrbitRing } from '../OrbitRing/OrbitRing';
import { PLANET_CONFIGS } from '../../types/solar';
import type { Planet as PlanetType, Moon as MoonType } from '../../types/solar';
import type { FlyTarget } from '../../hooks/useSelection';

// ─── Camera rig lives inside Canvas so it can use useFrame/useThree ───────────
function CameraRig({ flyTarget }: { flyTarget: FlyTarget | null }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const flying = useRef(false);
  const destPos = useRef(new Vector3());
  const destLook = useRef(new Vector3());

  useEffect(() => {
    if (!flyTarget) {
      flying.current = false;
      if (controlsRef.current) controlsRef.current.enabled = true;
      return;
    }
    destPos.current.set(...flyTarget.position);
    destLook.current.set(...flyTarget.lookAt);
    flying.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [flyTarget]);

  useFrame(() => {
    if (!flying.current || !controlsRef.current) return;
    camera.position.lerp(destPos.current, 0.07);
    controlsRef.current.target.lerp(destLook.current, 0.07);
    controlsRef.current.update();
    if (camera.position.distanceTo(destPos.current) < 0.25) {
      flying.current = false;
      controlsRef.current.enabled = true;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={1.5}
      maxDistance={250}
      zoomSpeed={0.6}
      rotateSpeed={0.5}
      makeDefault
    />
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
interface Props {
  planets: PlanetType[];
  selectedPlanetId: string | null;
  paused: boolean;
  flyTarget: FlyTarget | null;
  onSelectPlanet: (planet: PlanetType, worldPos: [number, number, number]) => void;
  onSelectMoon: (moon: MoonType, planet: PlanetType) => void;
  onMoonWorldPos: (id: string, pos: [number, number, number]) => void;
}

export function Scene({
  planets, selectedPlanetId, paused, flyTarget,
  onSelectPlanet, onSelectMoon, onMoonWorldPos,
}: Props) {
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
                paused={paused}
                onSelect={onSelectPlanet}
                onSelectMoon={onSelectMoon}
                onMoonWorldPos={onMoonWorldPos}
                showMoons={selectedPlanetId === planet.id}
              />
            </group>
          );
        })}
      </Suspense>

      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.2} />
      </EffectComposer>

      <CameraRig flyTarget={flyTarget} />
    </Canvas>
  );
}
