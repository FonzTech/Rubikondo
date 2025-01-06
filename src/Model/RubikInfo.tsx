import * as THREE from "three";

interface RubikInfo {
  mesh: THREE.Group<THREE.Object3DEventMap>,
  material: THREE.ShaderMaterial
  selected: boolean
}

export default RubikInfo;