import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import Spaceship from './Spaceship';
import { getPlanet, CAMERA_OFFSET, SHIP_OFFSET } from '../../lib/navigation';
import { useUniverseStore } from '../../store/useUniverseStore';

/**
 * Owns the spaceship's position and the camera's position/lookAt.
 * On travelTo(), it tweens both along a great-arc path between the
 * current and target planet, with a camera-shake pass mid-flight,
 * then hands control back and marks arrival in the store.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const shipGroup = useRef();
  const lookTarget = useRef(new THREE.Vector3());
  const shakeAmount = useRef(0);

  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const targetPlanetId = useUniverseStore((s) => s.targetPlanetId);
  const isTraveling = useUniverseStore((s) => s.isTraveling);
  const arriveAtPlanet = useUniverseStore((s) => s.arriveAtPlanet);

  // Initialize position on mount
  useEffect(() => {
    const p = getPlanet(activePlanetId);
    if (!shipGroup.current || !p) return;
    const shipPos = new THREE.Vector3(...p.position).add(new THREE.Vector3(...SHIP_OFFSET));
    shipGroup.current.position.copy(shipPos);
    camera.position.copy(shipPos.clone().add(new THREE.Vector3(...CAMERA_OFFSET)));
    lookTarget.current.set(...p.position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isTraveling) return;
    const from = getPlanet(activePlanetId);
    const to = getPlanet(targetPlanetId);
    if (!from || !to || !shipGroup.current) return;

    const fromShip = new THREE.Vector3(...from.position).add(new THREE.Vector3(...SHIP_OFFSET));
    const toShip = new THREE.Vector3(...to.position).add(new THREE.Vector3(...SHIP_OFFSET));

    // Arc the path slightly upward so the flight reads as travel, not a
    // straight cut.
    const mid = fromShip.clone().lerp(toShip, 0.5).add(new THREE.Vector3(0, 12, 0));
    const curve = new THREE.QuadraticBezierCurve3(fromShip, mid, toShip);

    const proxy = { t: 0 };
    shakeAmount.current = 1;

    const tl = gsap.timeline({
      onComplete: () => {
        shakeAmount.current = 0;
        arriveAtPlanet();
      },
    });

    tl.to(proxy, {
      t: 1,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        const pos = curve.getPoint(proxy.t);
        shipGroup.current.position.copy(pos);
        lookTarget.current.lerpVectors(new THREE.Vector3(...from.position), new THREE.Vector3(...to.position), proxy.t);
      },
    });

    tl.to(shakeAmount, { current: 0, duration: 0.4 }, '-=0.4');

    return () => tl.kill();
  }, [isTraveling]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    if (!shipGroup.current) return;

    if (!isTraveling) {
      const p = getPlanet(activePlanetId);
      const shipPos = new THREE.Vector3(...p.position).add(new THREE.Vector3(...SHIP_OFFSET));
      shipGroup.current.position.lerp(shipPos, delta * 2);
      lookTarget.current.lerp(new THREE.Vector3(...p.position), delta * 2);
    }

    const desiredCamPos = shipGroup.current.position.clone().add(new THREE.Vector3(...CAMERA_OFFSET));

    // subtle camera shake during travel
    if (shakeAmount.current > 0.01) {
      desiredCamPos.x += (Math.random() - 0.5) * 0.15 * shakeAmount.current;
      desiredCamPos.y += (Math.random() - 0.5) * 0.15 * shakeAmount.current;
    }

    camera.position.lerp(desiredCamPos, delta * 2.2);
    camera.lookAt(lookTarget.current);
  });

  return (
    <group ref={shipGroup}>
      <Spaceship traveling={isTraveling} />
    </group>
  );
}
