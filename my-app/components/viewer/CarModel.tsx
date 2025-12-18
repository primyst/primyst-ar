"use client";

import { useGLTF } from "@react-three/drei";
import { forwardRef, useEffect, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial, Box3, Vector3 } from "three";
import { useCarConfig } from "@/context/CarConfigContext";
import gsap from "gsap";

interface CarModelProps {
  view: "exterior" | "interior";
}

const CarModel = forwardRef<Group | null, CarModelProps>(({ view }, ref) => {
  const { color } = useCarConfig();
  const groupRef = useRef<Group>(null);

  const { scene } = useGLTF("/models/2026_mercedes-benz_cla_sedan_ev.glb") as { scene: Group };

  // Forward ref to parent
  useEffect(() => {
    if (ref && typeof ref === "object" && "current" in ref) {
      ref.current = groupRef.current;
    }
  }, [ref]);

  // Auto-center and scale
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    scene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.8 / maxDim;
    groupRef.current.scale.set(scale, scale, scale);
  }, [scene]);

  // Apply car color
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

  // Fade animation for interior and roof/doors
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;

        // Interior meshes
        if (mesh.name.includes("Interior")) {
          (mesh.material as MeshStandardMaterial).transparent = true;
          gsap.to(mesh.material as MeshStandardMaterial, {
            opacity: view === "interior" ? 1 : 0,
            duration: 0.8,
            onStart: () => { if (view === "interior") mesh.visible = true },
            onComplete: () => { if (view !== "interior") mesh.visible = false },
          });
        }

        // Roof/doors
        if (mesh.name.includes("Roof") || mesh.name.includes("Door")) {
          (mesh.material as MeshStandardMaterial).transparent = true;
          gsap.to(mesh.material as MeshStandardMaterial, {
            opacity: view === "interior" ? 0 : 1,
            duration: 0.8,
            onStart: () => { if (view !== "interior") mesh.visible = true },
            onComplete: () => { if (view === "interior") mesh.visible = false },
          });
        }

        // Ensure exterior other parts always visible
        if (!mesh.name.includes("Interior") && !mesh.name.includes("Roof") && !mesh.name.includes("Door")) {
          mesh.visible = true;
        }
      }
    });
  }, [view, scene]);

  return <group ref={groupRef}><primitive object={scene} /></group>;
});

export default CarModel;
