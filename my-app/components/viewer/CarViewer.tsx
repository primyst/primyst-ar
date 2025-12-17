"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CarModel from "./CarModel";
import Lights from "./Lights";

export default function CarViewer() {
  return (
    <Canvas
      camera={{ position: [3, 1.5, 5], fov: 45 }}
      dpr={[1, 1.5]}
      className="bg-neutral-950"
    >
      <Lights />
      <CarModel />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
    </Canvas>
  );
}