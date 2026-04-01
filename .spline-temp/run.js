import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';
const loader = new SplineLoader();
loader.load('https://prod.spline.design/jlu-LrL7kOx-S9uS/scene.splinecode', (splineScene) => {
  const msgs = [];
  splineScene.traverse((obj) => { if(obj.name) msgs.push('- ' + obj.name + ' (' + obj.type + ')'); });
  console.log(msgs.join('\n'));
});
