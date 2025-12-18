"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import CarModel from "./CarModel";
import Lights from "./Lights";
import { useEffect, useState, useRef } from "react";
import { Vector3, Box3, Group } from "three";
import gsap from "gsap";

// Auto camera transitions
function AutoCamera({ view, sceneRef }: { view: "exterior" | "interior"; sceneRef: React.RefObject<Group | null> }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!sceneRef.current) return;

    const cameraPresets = {
      exterior: { position: [4, 2, 6], target: [0, 0, 0] },
      interior: { position: [0, 1.2, 1], target: [0, 1.2, 2] },
    };

    const { position, target } = cameraPresets[view];

    gsap.to(camera.position, { x: position[0], y: position[1], z: position[2], duration: 1 });
    gsap.to({}, {
      duration: 1,
      onUpdate: () => camera.lookAt(target[0], target[1], target[2]),
    });
  }, [camera, view, sceneRef]);

  return null;
}

// Hook: compute dynamic zoom limits based on visible objects
function useCameraLimits(view: "exterior" | "interior", scene: Group | null) {
  const [limits, setLimits] = useState({ min: 0.5, max: 8 });

  useEffect(() => {
    if (!scene) return;

    const box = new Box3();
    const tempBox = new Box3();
    let first = true;

    scene.traverse((child) => {
      if ((child as Group).isGroup || (child as any).isMesh) {
        const mesh = child as any;
        if (mesh.visible) {
          tempBox.setFromObject(mesh);
          if (first) {
            box.copy(tempBox);
            first = false;
          } else {
            box.union(tempBox);
          }
        }
      }
    });

    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    if (view === "exterior") {
      setLimits({ min: maxDim * 0.5, max: maxDim * 4 });
    } else {
      // Interior zoom slightly closer
      setLimits({ min: maxDim * 0.15, max: maxDim * 3 });
    }
  }, [scene, view]);

  return limits;
}

export default function CarViewer() {
  const [view, setView] = useState<"exterior" | "interior">("exterior");
  const sceneRef = useRef<Group | null>(null);
  const limits = useCameraLimits(view, sceneRef.current);

  return (
    <div className="w-full h-full relative">
      {/* Toggle buttons */}
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
        {/* Lights */}
        <Lights intensity={view === "interior" ? 0.6 : 1} />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.81, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={view === "interior" ? 0.1 : 0.4} />
        </mesh>

        {/* Car model */}
        <CarModel ref={sceneRef} view={view} />

        {/* Camera */}
        <AutoCamera view={view} sceneRef={sceneRef} />

        {/* Orbit controls */}
        <OrbitControls
          enablePan={false}
          autoRotate={false}
          minDistance={limits.min}
          maxDistance={limits.max}
          maxPolarAngle={view === "interior" ? Math.PI / 2.1 : Math.PI / 2.1}
          minPolarAngle={view === "interior" ? Math.PI / 8 : 0}
        />

        {/* Environment */}
        <Environment preset="studio" background={false} />
      </Canvas>
    </div>
  );
}
