import * as THREE from "three";

export interface CanvasUseEffectProps {
  clock: THREE.Clock,
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  gameSize: number,
}

export interface CanvasInterface {
  getBoundingClientRect(element: HTMLElement): DOMRect;
  useEffectStep(props: CanvasUseEffectProps): void;
  gameSizeChange(gameSize: number): void;
}
