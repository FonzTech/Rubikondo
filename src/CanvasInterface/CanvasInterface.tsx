import * as THREE from "three";

export interface CanvasUseEffectProps {
  clock: THREE.Clock,
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
}

export interface CanvasInterface {
  getBoundingClientRect(element: HTMLElement): DOMRect;
  useEffectStep(props: CanvasUseEffectProps): void;
}
