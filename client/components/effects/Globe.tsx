import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useMemo, useRef } from 'react';

function RotatingPoints() {
  const ref = useRef<THREE.Points>(null!);
  const sphere = useMemo(() => new Float32Array(Array.from({ length: 2000 }, () => 0).flatMap(() => {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 1.4;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    return [x, y, z];
  })), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.12;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled>
      <PointMaterial transparent color="#00FFFF" size={0.02} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

export function Globe() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <RotatingPoints />
        </Suspense>
      </Canvas>
    </div>
  );
}
