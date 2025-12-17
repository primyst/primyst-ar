"use client";

import { useGLTF } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useEffect, useRef } from "react";
import { useCarConfig } from "@/context/CarConfigContext";

export default function CarModel() {
  const { color } = useCarConfig();
  const groupRef = useRef<Group>(null);

  // Load GLB model
  const { scene } = useGLTF(
    "/models/2026_mercedes-benz_cla_sedan_ev.glb"
  ) as { scene: Group };

  // Apply color whenever it changes
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material.color.set(color.hex);
        }
      }
    });
  }, [color, scene]);

  return (
    <group
      ref={groupRef}
      scale={[1.8, 1.8, 1.8]}        // Makes the car bigger and prominent
      position={[0, -0.82, 0]}       // Centers vertically above ground plane
      rotation={[0, Math.PI, 0]}     // Optional: face camera properly
    >
      <primitive object={scene} />
    </group>
  );
}