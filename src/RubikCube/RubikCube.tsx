import * as THREE from "three";
import Utils from "../Utils/Utils.tsx";

class RubikCube {
  group: THREE.Group;
  gameSize: number;
  rotation: number;
  lightPosition: THREE.Vector3;
  materials: THREE.ShaderMaterial[];

  constructor(gameSize: number) {
    this.group = new THREE.Group();
    this.gameSize = gameSize;
    this.rotation = 0;
    this.lightPosition = new THREE.Vector3(0, 0, 0);
    this.materials = [];
  }

  spawnFullCube(scene: THREE.Scene, cube: THREE.Group<THREE.Object3DEventMap>, texture: THREE.Texture): void {
    // Destroy old group
    if (this.group !== null) {
      // Safety of this call is demanded to the caller!!
      scene.remove(this.group);
    }

    // Setup
    this.lightPosition.set(0, 0, this.gameSize);
    this.materials = [];

    // Create group of six cubes
    this.group = this.getNewGroup();

    const limit = this.gameSize;
    const offset = this.gameSize * -0.5;

    for (let x = 0; x < limit; ++x) {
      for (let y = 0; y < limit; ++y) {
        for (let z = 0; z < limit; ++z) {
          const position = new THREE.Vector3(
            offset + x,
            offset + y,
            offset + z
          );
          const clone = this.getCubeMesh(cube, texture, position);
          clone.position.set(position.x, position.y, position.z);
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
      this.rotation += f;
      this.group.rotation.set(this.rotation, this.rotation, 0);
    }
  }

  gameSizeChange(gameSize: number, scene: THREE.Scene | null, cube: THREE.Group<THREE.Object3DEventMap> | null, texture: THREE.Texture | null): void {
    this.gameSize = gameSize;

    if (this.group !== null && scene !== null && cube !== null && texture !== null) {
      this.spawnFullCube(scene!, cube!, texture!);
    }
  }

  getCubeMesh(cube: THREE.Group<THREE.Object3DEventMap>, texture: THREE.Texture, position: THREE.Vector3): THREE.Group<THREE.Object3DEventMap> {
    // Apply texture to mesh
    const mesh = cube.clone();
    mesh.traverse((child) => {
      // Texturize mesh
      if (child.isMesh) {
        const material = Utils.getMaterialForCube(this.lightPosition, texture);
        child.material = material;

        this.materials.push(material);
      }
    });
    return mesh;
  }

  getNewGroup(): THREE.Group {
    return new THREE.Group();
  }
}

export default RubikCube;