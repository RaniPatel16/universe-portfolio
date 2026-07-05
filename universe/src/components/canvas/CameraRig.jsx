import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Spaceship from './Spaceship';
import { getPlanet, CAMERA_OFFSET, SHIP_OFFSET } from '../../lib/navigation';
import { useUniverseStore } from '../../store/useUniverseStore';

/**
 * Owns the spaceship's position and the camera's position/lookAt.
 * Handles planet-to-planet flight sequences natively inside the R3F frame loop,
 * avoiding GSAP clock dependencies and potential thread deadlocks.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const shipGroup = useRef();
  const lookTarget = useRef(new THREE.Vector3());
  const shakeAmount = useRef(0);
  const travelProgress = useRef(0);

  const activePlanetId = useUniverseStore((s) => s.activePlanetId);
  const targetPlanetId = useUniverseStore((s) => s.targetPlanetId);
  const isTraveling = useUniverseStore((s) => s.isTraveling);

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

  // Reset travel progress when a new sequence starts
  useEffect(() => {
    if (isTraveling) {
      travelProgress.current = 0;
    }
  }, [isTraveling]);

  useFrame((state, delta) => {
    if (!shipGroup.current) return;

    // Pull dynamic states directly on every frame to avoid React render closure lags
    const storeState = useUniverseStore.getState();
    const currentIsTraveling = storeState.isTraveling;
    const currentActivePlanetId = storeState.activePlanetId;
    const currentTargetPlanetId = storeState.targetPlanetId;
    const focusedPos = storeState.focusedCertificatePosition;
    const focusedBoothPos = storeState.focusedBoothPosition;
    const focusedPhotoPos = storeState.focusedPhotoPosition;

    let desiredCamPos;

    if (currentIsTraveling) {
      // 1. Flight / Warp Animation State
      const from = getPlanet(currentActivePlanetId);
      const to = getPlanet(currentTargetPlanetId);

      if (from && to) {
        // Warp travel duration of 1.8 seconds. Step progress inside R3F loop.
        travelProgress.current = Math.min(1.0, travelProgress.current + delta / 1.8);

        const fromShip = new THREE.Vector3(...from.position).add(new THREE.Vector3(...SHIP_OFFSET));
        const toShip = new THREE.Vector3(...to.position).add(new THREE.Vector3(...SHIP_OFFSET));

        // Arc path upward mid-flight
        const mid = fromShip.clone().lerp(toShip, 0.5).add(new THREE.Vector3(0, 12, 0));
        const curve = new THREE.QuadraticBezierCurve3(fromShip, mid, toShip);

        // Update ship coordinates along bezier curve
        const currentShipPos = curve.getPoint(travelProgress.current);
        shipGroup.current.position.copy(currentShipPos);

        // Lerp looking target at the same progress
        const fromPlanetPos = new THREE.Vector3(...from.position);
        const toPlanetPos = new THREE.Vector3(...to.position);
        lookTarget.current.lerpVectors(fromPlanetPos, toPlanetPos, travelProgress.current);

        // Shake peaks mid-flight (sine curve) and resolves at termination
        const shakeVal = Math.sin(travelProgress.current * Math.PI);
        shakeAmount.current = shakeVal;

        desiredCamPos = shipGroup.current.position.clone().add(new THREE.Vector3(...CAMERA_OFFSET));

        // Apply visual ship shake
        if (shakeAmount.current > 0.01) {
          desiredCamPos.x += (Math.random() - 0.5) * 0.15 * shakeAmount.current;
          desiredCamPos.y += (Math.random() - 0.5) * 0.15 * shakeAmount.current;
        }

        // Trigger arrival when timeline progress is full
        if (travelProgress.current >= 1.0) {
          travelProgress.current = 0;
          shakeAmount.current = 0;

          // Execute asynchronously outside the strict render phase to avoid Zustand warning
          setTimeout(() => {
            useUniverseStore.getState().arriveAtPlanet();
          }, 0);
        }
      } else {
        desiredCamPos = shipGroup.current.position.clone().add(new THREE.Vector3(...CAMERA_OFFSET));
      }
    } else {
      // 2. Stationary / Exploration State
      const p = getPlanet(currentActivePlanetId);
      if (p) {
        const shipPos = new THREE.Vector3(...p.position).add(new THREE.Vector3(...SHIP_OFFSET));
        shipGroup.current.position.lerp(shipPos, delta * 2);

        if (currentActivePlanetId === 'certificates' && focusedPos) {
          lookTarget.current.lerp(new THREE.Vector3(...focusedPos), delta * 2.8);
        } else if (currentActivePlanetId === 'hackathons' && focusedPhotoPos) {
          lookTarget.current.lerp(new THREE.Vector3(...focusedPhotoPos), delta * 2.8);
        } else if (currentActivePlanetId === 'hackathons' && focusedBoothPos) {
          lookTarget.current.lerp(new THREE.Vector3(...focusedBoothPos), delta * 2.8);
        } else {
          lookTarget.current.lerp(new THREE.Vector3(...p.position), delta * 2);
        }
      }

      if (currentActivePlanetId === 'certificates' && focusedPos) {
        const p = getPlanet(currentActivePlanetId);
        if (p) {
          const planetPos = new THREE.Vector3(...p.position);
          const crystalPos = new THREE.Vector3(...focusedPos);
          const dirOfCrystal = crystalPos.clone().sub(planetPos).normalize();
          // Offset camera to orbit crystal
          desiredCamPos = crystalPos.clone().add(dirOfCrystal.multiplyScalar(3.2)).add(new THREE.Vector3(0, 0.4, 0));
        } else {
          desiredCamPos = shipGroup.current.position.clone().add(new THREE.Vector3(...CAMERA_OFFSET));
        }
      } else if (currentActivePlanetId === 'hackathons' && focusedPhotoPos) {
        const p = getPlanet(currentActivePlanetId);
        if (p) {
          const planetPos = new THREE.Vector3(...p.position);
          const photoPos = new THREE.Vector3(...focusedPhotoPos);
          const dir = photoPos.clone().sub(planetPos).normalize();
          // Orbit focused photo closely
          desiredCamPos = photoPos.clone().add(dir.multiplyScalar(2.0)).add(new THREE.Vector3(0, 0.1, 0));
        } else {
          desiredCamPos = shipGroup.current.position.clone().add(new THREE.Vector3(...CAMERA_OFFSET));
        }
      } else if (currentActivePlanetId === 'hackathons' && focusedBoothPos) {
        const p = getPlanet(currentActivePlanetId);
        if (p) {
          const planetPos = new THREE.Vector3(...p.position);
          const boothPos = new THREE.Vector3(...focusedBoothPos);
          const dir = boothPos.clone().sub(planetPos).normalize();
          // Orbit focused booth at a nice distance
          desiredCamPos = boothPos.clone().add(dir.multiplyScalar(5.5)).add(new THREE.Vector3(0, 1.2, 0));
        } else {
          desiredCamPos = shipGroup.current.position.clone().add(new THREE.Vector3(...CAMERA_OFFSET));
        }
      } else {
        desiredCamPos = shipGroup.current.position.clone().add(new THREE.Vector3(...CAMERA_OFFSET));
      }
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
