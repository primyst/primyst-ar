"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import CarModel from "./CarModel";
import Lights from "./Lights";
import { useEffect } from "react";
import { Vector3, Box3 } from "three";

function AutoCamera() {
  const { camera, scene } = useThree();

  useEffect(() => {
    // Compute bounding box of the scene
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    // Position camera based on bounding box
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let distance = maxDim / (2 * Math.tan(fov / 2));

    distance *= 1.5; // padding around the car

    camera.position.set(center.x, center.y + maxDim * 0.5, center.z + distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }, [camera, scene]);

  return null;
}

export default function CarViewer() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950"
      shadows
    >
      {/* Lighting */}
      <Lights />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.81, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.4} />
      </mesh>

      {/* Car model */}
      <CarModel />

      {/* Auto-position camera */}
      <AutoCamera />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={false}
      />

      {/* Optional environment reflections */}
      <Environment preset="studio" background={false} />
    </Canvas>
  );
}