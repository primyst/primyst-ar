"use client";

import { useGLTF } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useCarConfig } from "@/context/CarConfigContext";

export default function CarModel() {
  const { color } = useCarConfig();

  const { scene } = useGLTF(
    "/models/2026_mercedes-benz_cla_sedan_ev.glb"
  ) as { scene: Group };

  scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      if (mesh.material instanceof MeshStandardMaterial) {
        mesh.material.color.set(color);
      }
    }
  });

  return <primitive object={scene} scale={1} position={[0, -0.6, 0]} />;
}