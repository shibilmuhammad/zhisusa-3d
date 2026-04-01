import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';

const loader = new SplineLoader();
loader.load('https://prod.spline.design/jlu-LrL7kOx-S9uS/scene.splinecode', (splineScene) => {
  console.log("Loaded Spline Scene!");
  splineScene.traverse((obj) => {
    if (obj.name) {
      console.log(`- ${obj.name} (${obj.type})`);
    }
  });
});
