"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import CarModel from "./CarModel";
import Lights from "./Lights";

export default function CarViewer() {
  return (
    <Canvas
      camera={{ position: [4, 2, 6], fov: 45 }}
      dpr={[1, 1.5]}
      className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 w-full h-full"
      shadows
    >
      {/* Studio Lighting */}
      <Lights />

      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.81, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.4} />
      </mesh>

      {/* Optional HDRI environment for reflections */}
      <Environment preset="studio" background={false} />

      {/* Car Model */}
      <CarModel />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2.1} // prevent flipping
        autoRotate={false}
      />
    </Canvas>
  );
}