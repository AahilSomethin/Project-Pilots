"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  memo,
  useRef,
  Component,
  type ReactNode,
  type RefObject,
} from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

useGLTF.preload("/models/hand.glb");

class HandSceneErrorBoundary extends Component<
  { fallback?: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep it local and non-fatal; failures should not break the lesson UI.
    console.error("HandScene failed to render:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (!this.props.fallback) return null;
    return (
      <div className="flex h-full w-full items-center justify-center">
        {this.props.fallback}
      </div>
    );
  }
}

export const HandScene = memo(function HandScene({
  className = "",
  poseKey,
  fallback,
}: {
  className?: string;
  /**
   * Placeholder for future pose switching.
   * For now it only affects a tiny deterministic rotation offset.
   */
  poseKey?: string;
  fallback?: ReactNode;
}) {
  return (
    <div className={className}>
      <HandSceneErrorBoundary fallback={fallback}>
        <HandCanvas poseKey={poseKey} />
      </HandSceneErrorBoundary>
    </div>
  );
});

function hashToRange(input: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  const t = hash / 0xffffffff;
  return min + (max - min) * t;
}

function HandCanvas({ poseKey }: { poseKey?: string }) {
  const groupRef = useRef<THREE.Object3D | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const isClient = typeof window !== "undefined";

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 1.85], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      shadows={false}
    >
      <CameraLookAt />
      <ambientLight intensity={0.35} />
      {/* Front-facing directional light helps keep the hand visible. */}
      <directionalLight position={[0, 1.8, 2.5]} intensity={0.9} />

      {isClient && (
        <Suspense fallback={null}>
          <HandModel
            groupRef={groupRef}
            poseKey={poseKey}
            reduceMotion={reduceMotion}
          />
        </Suspense>
      )}
    </Canvas>
  );
}

function CameraLookAt() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function HandModel({
  groupRef,
  poseKey,
  reduceMotion,
}: {
  groupRef: RefObject<THREE.Object3D | null>;
  poseKey?: string;
  reduceMotion: boolean;
}) {
  const model = useGLTF("/models/hand.glb");

  useEffect(() => {
    // Brighten materials slightly so the model isn't too dark.
    const scene = model.scene as THREE.Object3D;
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const material = obj.material;
      const materials = Array.isArray(material) ? material : [material];

      materials.forEach((m) => {
        const matWithAny = m as unknown as { userData?: Record<string, unknown> };
        if (matWithAny.userData?.__handBrightened) return;
        if (!matWithAny.userData) matWithAny.userData = {};
        matWithAny.userData.__handBrightened = true;

        const mat = m as unknown as {
          color?: THREE.Color;
          emissive?: THREE.Color;
          roughness?: number;
        };
        if (mat.color) mat.color.multiplyScalar(1.18);
        if (mat.emissive) mat.emissive.multiplyScalar(1.08);
        if (typeof mat.roughness === "number") mat.roughness = Math.min(mat.roughness, 0.95);
      });
    });
  }, [model.scene]);

  const { center, scaleFactor } = useMemo(() => {
    const scene = model.scene as THREE.Object3D;
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    // Using `any` here avoids IDE typing mismatches between `@types/three`
    // and `three` exports while keeping the runtime behavior unchanged.
    type Vector3Param = Parameters<THREE.Box3["getSize"]>[0];
    const Vector3Ctor = (THREE as unknown as { Vector3: new () => Vector3Param }).Vector3;
    const size = box.getSize(new Vector3Ctor());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 1 / maxDim;

    // Make the hand feel slightly "larger" in the frame.
    const adjustedScale = scale * 0.95;

    const c = box.getCenter(new Vector3Ctor());
    return { center: c, scaleFactor: adjustedScale };
  }, [model.scene]);

  const initialOffset = useMemo(() => {
    const key = poseKey || "default";
    return {
      yRotation: hashToRange(key, -0.15, 0.15),
      xRotation: hashToRange(key + "x", -0.1, 0.1),
    };
  }, [poseKey]);

  useFrame(({ clock }) => {
    if (reduceMotion) return;
    const group = groupRef.current;
    if (!group) return;
    const t = clock.getElapsedTime();
    group.rotation.y = initialOffset.yRotation + Math.sin(t * 0.12) * 0.04;
    group.rotation.x = initialOffset.xRotation + Math.cos(t * 0.09) * 0.02;
  });

  return (
    <primitive
      ref={groupRef}
      object={model.scene}
      position={[
        -center.x * scaleFactor,
        -center.y * scaleFactor,
        -center.z * scaleFactor,
      ]}
      scale={scaleFactor}
      rotation={[initialOffset.xRotation, initialOffset.yRotation, 0]}
    />
  );
}

