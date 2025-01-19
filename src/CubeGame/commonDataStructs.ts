import * as THREE from "three";

export interface RotateInfo {
  sign: number,
  signFirst: number,
  axis: THREE.Vector3,
  axisFirst: THREE.Vector3
}

export interface SelectedFace {
  faceIndex: number,
  x: number,
  y: number
}