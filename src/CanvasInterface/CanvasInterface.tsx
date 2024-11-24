import * as THREE from "three";

export interface CanvasFrameStepProps {
  clock: THREE.Clock,
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
}

export interface CanvasInterface {
  frameStep(props: CanvasFrameStepProps): void;
}
