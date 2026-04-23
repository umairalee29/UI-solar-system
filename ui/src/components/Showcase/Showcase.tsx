import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CarouselPlanet } from './CarouselPlanet';
import { OrbitArcs } from './OrbitArcs';
import type { Planet as PlanetType, Moon as MoonType } from '../../types/solar';
import type { FlyTarget } from '../../hooks/useCarousel';

// ─── Camera rig — handles moon fly-to inside Canvas ──────────────────────────
function CameraRig({ flyTarget }: { flyTarget: FlyTarget | null }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const flying = useRef(false);
  const destPos = useRef(new Vector3());
  const destLook = useRef(new Vector3());

  useEffect(() => {
    if (!flyTarget) {
      flying.current = false;
      if (controlsRef.current) controlsRef.current.enabled = false;
      return;
    }
    destPos.current.set(...flyTarget.position);
    destLook.current.set(...flyTarget.lookAt);
    flying.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [flyTarget]);

  useFrame(() => {
    if (!flying.current) return;
    camera.position.lerp(destPos.current, 0.07);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(destLook.current, 0.07);
      controlsRef.current.update();
    }
    if (camera.position.distanceTo(destPos.current) < 0.25) {
      flying.current = false;
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={false}
      enablePan={false}
      minDistance={1.5}
      maxDistance={40}
      makeDefault
    />
  );
}

// ─── Scene root ───────────────────────────────────────────────────────────────
interface Props {
  planets: PlanetType[];
  currentIndex: number;
  moonFlyTarget: FlyTarget | null;
  onNavigate: (dir: 1 | -1) => void;
  onMoonWorldPos: (id: string, pos: [number, number, number]) => void;
  onSelectMoon: (moon: MoonType, planet: PlanetType) => void;
}

export function Showcase({
  planets, currentIndex, moonFlyTarget,
  onNavigate, onMoonWorldPos, onSelectMoon,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 22], fov: 50, near: 0.1, far: 1000 }}
      style={{ width: '100%', height: '100%', background: '#000008' }}
    >
      <ambientLight intensity={0.06} />

      <Stars radius={280} depth={55} count={5000} factor={3.5} saturation={0} fade speed={0.3} />

      <Suspense fallback={null}>
        <OrbitArcs />

        {planets.map((planet, i) => (
          <CarouselPlanet
            key={planet.id}
            planet={planet}
            planetIndex={i}
            currentIndex={currentIndex}
            totalPlanets={planets.length}
            onNavigate={onNavigate}
            onMoonWorldPos={onMoonWorldPos}
            onSelectMoon={onSelectMoon}
          />
        ))}
      </Suspense>

      <EffectComposer>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.95} intensity={1.8} />
      </EffectComposer>

      <CameraRig flyTarget={moonFlyTarget} />
    </Canvas>
  );
}
