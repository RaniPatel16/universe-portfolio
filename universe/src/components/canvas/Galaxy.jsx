import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The persistent backdrop of the entire experience: a deep star field,
 * two large drifting nebula clouds, a distant rotating galaxy disc,
 * and slow-moving space dust. Everything animates gently so the void
 * never reads as a static background image.
 */
export default function Galaxy() {
  const nebulaA = useRef();
  const nebulaB = useRef();
  const galaxyDisc = useRef();

  const nebulaTexture = useMemo(() => makeNebulaTexture('#7C5CFF'), []);
  const nebulaTextureB = useMemo(() => makeNebulaTexture('#35F0D0'), []);

  useFrame((state, delta) => {
    if (nebulaA.current) nebulaA.current.rotation.z += delta * 0.004;
    if (nebulaB.current) nebulaB.current.rotation.z -= delta * 0.003;
    if (galaxyDisc.current) galaxyDisc.current.rotation.z += delta * 0.01;
  });

  return (
    <group>
      <Stars radius={400} depth={200} count={9000} factor={4} saturation={0} fade speed={0.4} />
      <Sparkles count={200} scale={[600, 200, 600]} size={2} speed={0.15} color="#EAF6FF" opacity={0.5} />

      {/* Nebula clouds */}
      <sprite ref={nebulaA} position={[-120, 40, -260]} scale={[420, 420, 1]}>
        <spriteMaterial map={nebulaTexture} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={nebulaB} position={[220, -30, -320]} scale={[380, 380, 1]}>
        <spriteMaterial map={nebulaTextureB} transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* Distant rotating galaxy disc */}
      <mesh ref={galaxyDisc} position={[-260, 120, -500]} rotation={[1.1, 0, 0]}>
        <ringGeometry args={[40, 140, 64]} />
        <meshBasicMaterial color="#7C5CFF" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#35F0D0', '#05060B', 0.3]} />
    </group>
  );
}

// Procedurally paints a soft radial-gradient blob to use as a nebula sprite,
// avoiding the need for external texture assets.
function makeNebulaTexture(hex) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, hex);
  gradient.addColorStop(0.4, hex + 'AA');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
