"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import CarModel from "./CarModel";
import Lights from "./Lights";
import { useEffect, useState, useRef, useMemo } from "react";
import { Vector3, Box3, Group } from "three";
import gsap from "gsap";

const CAMERA_PRESETS = {
  exterior: { position: [4, 2, 6] as const, target: [0, 0, 0] as const },
  interior: { position: [0, 1.2, 1] as const, target: [0, 1.2, 2] as const },
};

// Auto camera transitions
function AutoCamera({ view }: { view: "exterior" | "interior" }) {
  const { camera } = useThree();

  useEffect(() => {
    const { position, target } = CAMERA_PRESETS[view];

    gsap.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 1,
    });

    const lookAtTarget = new Vector3(...target);
    const proxy = { t: 0 };

    gsap.to(proxy, {
      t: 1,
      duration: 1,
      onUpdate: () => camera.lookAt(lookAtTarget),
    });
  }, [camera, view]);

  return null;
}

// Camera zoom limits, computed once per view (not per render)
function useCameraLimits(view: "exterior" | "interior", scene: Group | null) {
  return useMemo(() => {
    if (!scene) return { min: 0.5, max: 8 };

    const box = new Box3();
    const tempBox = new Box3();
    let first = true;

    scene.traverse((child) => {
      const mesh = child as any;
      if ((mesh.isGroup || mesh.isMesh) && mesh.visible) {
        tempBox.setFromObject(mesh);
        if (first) {
          box.copy(tempBox);
          first = false;
        } else {
          box.union(tempBox);
        }
      }
    });

    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    return view === "exterior"
      ? { min: maxDim * 0.5, max: maxDim * 4 }
      : { min: maxDim * 0.15, max: maxDim * 3 };
  }, [view, scene]);
}

export default function CarViewer() {
  const [view, setView] = useState<"exterior" | "interior">("exterior");
  const sceneRef = useRef<Group | null>(null);
  const limits = useCameraLimits(view, sceneRef.current);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setView("exterior")}
          className={`px-4 py-2 rounded shadow transition-colors ${
            view === "exterior"
              ? "bg-blue-600 text-white"
              : "bg-neutral-700 text-neutral-200"
          }`}
        >
          Exterior
        </button>
        <button
          onClick={() => setView("interior")}
          className={`px-4 py-2 rounded shadow transition-colors ${
            view === "interior"
              ? "bg-blue-600 text-white"
              : "bg-neutral-700 text-neutral-200"
          }`}
        >
          Interior
        </button>
      </div>

      <Canvas
        dpr={[1, 1.5]}
        className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950"
        shadows
      >
        <Lights intensity={view === "interior" ? 0.6 : 1} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.81, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={view === "interior" ? 0.1 : 0.4} />
        </mesh>

        <CarModel ref={sceneRef} view={view} />

        <AutoCamera view={view} />

        <OrbitControls
          enablePan={false}
          autoRotate={false}
          minDistance={limits.min}
          maxDistance={limits.max}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={view === "interior" ? Math.PI / 8 : 0}
        />

        <Environment preset="studio" background={false} />
      </Canvas>
    </div>
  );
      }
