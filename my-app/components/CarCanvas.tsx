"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CarModel from "./CarModel";

export default function CarCanvas() {
  return (
    <Canvas camera={{ position: [3, 1.5, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />

      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, 3, -5]} intensity={1} />

      <CarModel />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
      />
    </Canvas>
  );
}