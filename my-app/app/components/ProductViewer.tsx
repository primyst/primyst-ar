"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";

export default function ProductViewer() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
          <Model />
        </Stage>
      </Suspense>
      <OrbitControls enableZoom enablePan enableRotate />
    </Canvas>
  );
}