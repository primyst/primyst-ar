"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import CarModel from "./CarModel";
import Lights from "./Lights";
import { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { Vector3, Box3, Group } from "three";
import gsap from "gsap";

const CAMERA_PRESETS = {
  exterior: { position: [4, 2, 6] as const, target: [0, 0, 0] as const },
  interior: { position: [0, 1.2, 1] as const, target: [0, 1.2, 2] as const },
};

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

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 z-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-neutral-700 border-t-white animate-spin" />
        <p className="text-sm text-neutral-400">Loading vehicle…</p>
      </div>
    </div>
  );
}

export default function CarViewer() {
  const [view, setView] = useState<"exterior" | "interior">("exterior");
  const sceneRef = useRef<Group | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);

  const limits = useCameraLimits(view, modelReady ? sceneRef.current : null);

  const dismissDragHint = () => setShowDragHint(false);

  return (
    <div className="w-full h-full relative" onPointerDown={dismissDragHint}>
      {!modelReady && <LoadingFallback />}

      {modelReady && showDragHint && (
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center pointer-events-none">
          <div className="rounded-full bg-black/60 px-4 py-2 text-xs text-neutral-200 animate-pulse">
            Drag to rotate
          </div>
        </div>
      )}

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

        <Suspense fallback={null}>
          <CarModel
            ref={(group) => {
              sceneRef.current = group;
              if (group && !modelReady) setModelReady(true);
            }}
            view={view}
          />
        </Suspense>

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
