"use client";

import { useGLTF } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useMemo, useImperativeHandle } from "react";
import { Group, Mesh, MeshStandardMaterial, Box3, Vector3 } from "three";
import { useCarConfig } from "@/context/CarConfigContext";
import gsap from "gsap";

interface CarModelProps {
  view: "exterior" | "interior";
}

const MODEL_PATH = "/models/2026_mercedes-benz_cla_sedan_ev-draco.glb";

const CarModel = forwardRef<Group | null, CarModelProps>(({ view }, ref) => {
  const { color } = useCarConfig();
  const groupRef = useRef<Group>(null);
  const initialized = useRef(false);

  const { scene } = useGLTF(MODEL_PATH) as { scene: Group };

  // Categorized mesh buckets, built once per loaded scene
  const meshBuckets = useMemo(() => {
    const interior: Mesh[] = [];
    const roofAndDoors: Mesh[] = [];
    const paintable: Mesh[] = [];

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;

        if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material = mesh.material.clone();
          mesh.material.transparent = true;
          paintable.push(mesh);
        }

        if (mesh.name.includes("Interior")) {
          interior.push(mesh);
        } else if (mesh.name.includes("Roof") || mesh.name.includes("Door")) {
          roofAndDoors.push(mesh);
        }
      }
    });

    return { interior, roofAndDoors, paintable };
  }, [scene]);

  useImperativeHandle(ref, () => groupRef.current as Group);

  // Auto-center and scale — runs once per scene load
  useEffect(() => {
    if (!groupRef.current || initialized.current) return;

    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    scene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.8 / maxDim;
    groupRef.current.scale.set(scale, scale, scale);

    initialized.current = true;
  }, [scene]);

  // Apply car color — only touches cached paintable meshes, no traverse
  useEffect(() => {
    meshBuckets.paintable.forEach((mesh) => {
      (mesh.material as MeshStandardMaterial).color.set(color.hex);
    });
  }, [color, meshBuckets.paintable]);

  // Fade animation for interior vs exterior — only touches cached buckets
  useEffect(() => {
    meshBuckets.interior.forEach((mesh) => {
      const mat = mesh.material as MeshStandardMaterial;
      if (view === "interior") mesh.visible = true;
      gsap.to(mat, {
        opacity: view === "interior" ? 1 : 0,
        duration: 0.8,
        onComplete: () => {
          if (view !== "interior") mesh.visible = false;
        },
      });
    });

    meshBuckets.roofAndDoors.forEach((mesh) => {
      const mat = mesh.material as MeshStandardMaterial;
      if (view !== "interior") mesh.visible = true;
      gsap.to(mat, {
        opacity: view === "interior" ? 0 : 1,
        duration: 0.8,
        onComplete: () => {
          if (view === "interior") mesh.visible = false;
        },
      });
    });
  }, [view, meshBuckets.interior, meshBuckets.roofAndDoors]);

  // Cleanup on unmount — dispose geometries/materials to avoid GPU memory leaks
  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    };
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
});

CarModel.displayName = "CarModel";

useGLTF.preload(MODEL_PATH);

export default CarModel;
