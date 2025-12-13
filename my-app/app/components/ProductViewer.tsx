"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";
import { useColor } from "@/context/ColorContext";

export default function ProductViewer() {
  const { color } = useColor();

  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
          <Model color={color} />
        </Stage>
      </Suspense>
      <OrbitControls enableZoom enablePan enableRotate />
    </Canvas>
  );
}