"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial, Box3, Vector3 } from "three";
import { useCarConfig } from "@/context/CarConfigContext";

interface CarModelProps {
  view: "exterior" | "interior";
}

export default function CarModel({ view }: CarModelProps) {
  const { color } = useCarConfig();
  const groupRef = useRef<Group>(null);

  const { scene } = useGLTF(
    "/models/2026_mercedes-benz_cla_sedan_ev.glb"
  ) as { scene: Group };

  // Auto-center and auto-scale
  useEffect(() => {
    if (groupRef.current) {
      const box = new Box3().setFromObject(scene);
      const size = new Vector3();
      const center = new Vector3();
      box.getSize(size);
      box.getCenter(center);

      // Center model
      scene.position.sub(center);

      // Scale to fit max dimension (~1.8 units)
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.8 / maxDim;
      groupRef.current.scale.set(scale, scale, scale);
    }
  }, [scene]);

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

  // Toggle interior visibility based on view
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        // Example: interior meshes contain "Interior" in their name
        if (mesh.name.includes("Interior")) {
          mesh.visible = view === "interior";
        } else {
          // Exterior meshes always visible
          mesh.visible = true;
        }
      }
    });
  }, [view, scene]);

  return <group ref={groupRef}><primitive object={scene} /></group>;
}