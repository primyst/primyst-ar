"use client";

import { useGLTF } from "@react-three/drei";
import { Group } from "three";

type ModelProps = {
  color?: string;
};

export default function Model({ color = "#ffffff" }: ModelProps) {
  const { scene } = useGLTF("/models/product.glb") as { scene: Group };

  // Apply color to all meshes
  scene.traverse((child) => {
    if ("material" in child && child.material) {
      // @ts-ignore
      child.material.color.set(color);
    }
  });

  return <primitive object={scene} scale={1} position={[0, -0.5, 0]} />;
}