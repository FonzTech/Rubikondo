import * as THREE from "three";

export interface CanvasFrameStepProps {
  clock: THREE.Clock,
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
}

export interface CanvasInterface {
  getBoundingClientRect(element: HTMLElement): DOMRect;
  frameStep(props: CanvasFrameStepProps): void;
}
