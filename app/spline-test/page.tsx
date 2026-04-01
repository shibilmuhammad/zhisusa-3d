"use client";

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';

export default function SplineTest() {
  const [objects, setObjects] = useState<string[]>([]);

  useEffect(() => {
    const loader = new SplineLoader();
    loader.load('https://prod.spline.design/jlu-LrL7kOx-S9uS/scene.splinecode', (splineScene) => {
      const msgs: string[] = [];
      splineScene.traverse((obj) => {
        if (obj.name) {
          msgs.push(`- ${obj.name} (${obj.type}) [uuid: ${obj.uuid}]`);
        }
      });
      setObjects(msgs);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Spline Objects</h1>
      <pre id="spline-objects">{objects.join('\n')}</pre>
    </div>
  );
}
