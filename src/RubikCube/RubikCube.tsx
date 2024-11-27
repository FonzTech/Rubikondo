import * as THREE from "three";

class RubikCube {
  static readonly CUBE_DIST = 1;

  group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
  }

  spawnFullCube(scene: THREE.Scene, cube: THREE.Group<THREE.Object3DEventMap>): void {
    // Create group of six cubes
    this.group = new THREE.Group();

    for (let x = 0; x < 3; ++x) {
      for (let y = 0; y < 3; ++y) {
        for (let z = 0; z < 3; ++z) {
          const clone = cube.clone();
          clone.position.set(
            x * RubikCube.CUBE_DIST - RubikCube.CUBE_DIST,
            y * RubikCube.CUBE_DIST - RubikCube.CUBE_DIST,
            z * RubikCube.CUBE_DIST - RubikCube.CUBE_DIST
          );
          this.group.add(clone);
        }
      }
    }

    // Add group to scene
    scene.add(this.group);
  }

  advanceFrame(dt: number): void {
    this.group.rotation.x += 0.4 * dt;
    this.group.rotation.y += 0.4 * dt;
  }
}

export default RubikCube;