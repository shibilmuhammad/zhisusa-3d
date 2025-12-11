"use client";

import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { Group, Material, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useThree } from "@react-three/fiber";

type ModelAssetProps = {
  url: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  onReady?: (root: Group) => void;
  fallback?: React.ReactNode;
  toneMapped?: boolean;
} & JSX.IntrinsicElements["group"];

const loader = new GLTFLoader();

const mergeRefs =
  <T,>(...refs: Array<React.MutableRefObject<T | null> | React.Ref<T>>) =>
  (value: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };

export const ModelAsset = forwardRef<Group, ModelAssetProps>(function ModelAsset(
  { url, castShadow = true, receiveShadow = true, onReady, fallback, toneMapped = true, ...rest },
  forwardedRef
) {
  const invalidate = useThree((state) => state.invalidate);
  const [root, setRoot] = useState<Group | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    setFailed(false);
    setRoot(null);

    loader.load(
      url,
      (gltf) => {
        if (!mounted) return;
        const cloned = gltf.scene.clone(true);

        const applyToneMapping = (material: Material | Material[] | undefined) => {
          if (!material) return;
          if (Array.isArray(material)) {
            material.forEach((mat) => applyToneMapping(mat));
            return;
          }
          if ("toneMapped" in material) {
            (material as any).toneMapped = toneMapped;
          }
        };

        cloned.traverse((child) => {
          if ("isMesh" in child && (child as Mesh).isMesh) {
            const mesh = child as Mesh;
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
            applyToneMapping(mesh.material as Material | Material[] | undefined);
          }
        });

        setRoot(cloned);
        onReady?.(cloned);
        invalidate();
      },
      undefined,
      (error) => {
        console.warn(`[ModelAsset] Failed to load ${url}`, error);
        if (mounted) {
          setFailed(true);
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [url, castShadow, receiveShadow, toneMapped, onReady, invalidate]);

  const content = useMemo(() => {
    if (failed) {
      return fallback ?? (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1d2c40" />
        </mesh>
      );
    }

    if (!root) {
      return null;
    }

    return <primitive object={root} />;
  }, [failed, fallback, root]);

  return (
    <group ref={mergeRefs(forwardedRef)} {...rest}>
      {content}
    </group>
  );
});

export default ModelAsset;


