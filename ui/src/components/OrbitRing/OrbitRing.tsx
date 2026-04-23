interface Props {
  radius: number;
  opacity?: number;
}

export function OrbitRing({ radius, opacity = 0.55 }: Props) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* torusGeometry: [orbitRadius, tubeRadius, radialSegs, tubularSegs] */}
      <torusGeometry args={[radius, 0.1, 6, 256]} />
      <meshBasicMaterial color="#ffaa55" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}
