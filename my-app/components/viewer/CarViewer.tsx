"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import CarModel from "./CarModel";
import Lights from "./Lights";
import { useEffect, useState } from "react";
import { Vector3, Box3 } from "three";
import gsap from "gsap";

// Auto camera component
function AutoCamera({ view }: { view: "exterior" | "interior" }) {
  const { camera, scene } = useThree();

  useEffect(() => {
    if (!scene) return;

    const cameraPresets = {
      exterior: { position: [4, 2, 6], target: [0, 0, 0] },
      interior: { position: [0, 1.5, 0], target: [0, 1.2, 2] },
    };

    const { position, target } = cameraPresets[view];

    gsap.to(camera.position, { x: position[0], y: position[1], z: position[2], duration: 1 });
    gsap.to({}, {
      duration: 1,
      onUpdate: () => camera.lookAt(target[0], target[1], target[2]),
    });
  }, [camera, scene, view]);

  return null;
}

export default function CarViewer() {
  const [view, setView] = useState<"exterior" | "interior">("exterior");

  return (
    <div className="w-full h-full relative">
      {/* Interior / Exterior toggle buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setView("exterior")}
          className={`px-4 py-2 rounded shadow ${view === "exterior" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}
        >
          Exterior
        </button>
        <button
          onClick={() => setView("interior")}
          className={`px-4 py-2 rounded shadow ${view === "interior" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}
        >
          Interior
        </button>
      </div>

      <Canvas
        dpr={[1, 1.5]}
        className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950"
        shadows
      >
        <Lights />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.81, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.4} />
        </mesh>

        {/* Car model */}
        <CarModel view={view} />

        {/* Auto camera based on current view */}
        <AutoCamera view={view} />

        {/* Orbit controls */}
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={false}
        />

        <Environment preset="studio" background={false} />
      </Canvas>
    </div>
  );
}