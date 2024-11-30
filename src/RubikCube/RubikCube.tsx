import * as THREE from "three";

class RubikCube {
  static readonly CUBE_DIST = 1;

  group: THREE.Group;
  gameSize: number;
  rotation: number;

  constructor(gameSize: number) {
    this.group = new THREE.Group();
    this.gameSize = gameSize;
    this.rotation = 0;
  }

  spawnFullCube(scene: THREE.Scene, cube: THREE.Group<THREE.Object3DEventMap>): void {
    // Destroy old group
    if (this.group !== null) {
      // Safety of this call is demanded to the caller!!
      scene.remove(this.group);
    }

    // Create group of six cubes
    this.group = new THREE.Group();

    const limit = this.gameSize;
    const offset = this.gameSize * -0.5;

    for (let x = 0; x < limit; ++x) {
      for (let y = 0; y < limit; ++y) {
        for (let z = 0; z < limit; ++z) {
          const clone = cube.clone();
          clone.position.set(
            offset + x * RubikCube.CUBE_DIST,
            offset + y * RubikCube.CUBE_DIST,
            offset + z * RubikCube.CUBE_DIST
          );
          this.group.add(clone);
        }
      }
    }

    // Add group to scene
    scene.add(this.group);
  }

  advanceFrame(dt: number): void {
    if (this.group !== null) {
      const f = 0.4 * dt;
      this.group.rotation.x += f;
      this.group.rotation.y += f;
    }
  }

  gameSizeChange(gameSize: number, scene: THREE.Scene | null, cube: THREE.Group<THREE.Object3DEventMap> | null): void {
    this.gameSize = gameSize;

    if (this.group !== null && scene !== null && cube !== null) {
      this.spawnFullCube(scene!, cube!);
    }
  }
}

export default RubikCube;