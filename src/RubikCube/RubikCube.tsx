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
    
    // Create cube colors
    const limit = this.gameSize;

    const cubeColors = new Map<string, THREE.Color>();
    for (let fi = 0; fi < 6; ++fi) {
      for (let x = 0; x < limit; ++x) {
        for (let y = 0; y < limit; ++y) {
          const key = `${fi}_${x}_${y}`;
          cubeColors.set(key, new THREE.Color(
            fi == 0 ?
              Utils.CUBE_COLOR_WHITE :
              fi == 1 ?
                Utils.CUBE_COLOR_ORANGE :
                fi == 2 ?
                  Utils.CUBE_COLOR_GREEN :
                  fi == 3 ?
                    Utils.CUBE_COLOR_RED :
                    fi == 4 ?
                      Utils.CUBE_COLOR_BLUE :
                      Utils.CUBE_COLOR_YELLOW
          ));
        }
      }
    }

    // Create group of six cubes
    this.group = this.getNewGroup();

    const offset = this.gameSize * -0.5;

    for (let fi = 0; fi < 6; ++fi) {
      for (let x = 0; x < limit; ++x) {
        for (let y = 0; y < limit; ++y) {
          const position = new THREE.Vector3(
            offset + x,
            offset + y,
            offset + this.gameSize
          );

          const key = `${fi}_${x}_${y}`;
          const color = cubeColors.get(key);
          if (!color) {
            throw new Error(`Could not get color for face ${key}`);
          }

          const faceGroup = this.getNewGroup();

          const clone = this.getCubeMesh(cube, texture, color);
          clone.position.set(position.x, position.y, position.z);
          faceGroup.add(clone);

          let axis = new THREE.Vector3();
          let angle = 0;

          if (fi < 0) {
            throw new Error(`Invalid face index ${fi}`);
          } else if (fi < 4) {
            axis.setY(1);
            angle = THREE.MathUtils.degToRad(90 * fi);
          } else if (fi < 6) {
            axis.setX(1);
            angle = THREE.MathUtils.degToRad(90 + 180 * (fi - 4));
          } else {
            throw new Error(`Invalid face index ${fi}`);
          }

          faceGroup.rotateOnAxis(axis, angle);

          this.group.add(faceGroup);
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

  getCubeMesh(cube: THREE.Group<THREE.Object3DEventMap>, texture: THREE.Texture, color: THREE.Color): THREE.Group<THREE.Object3DEventMap> {
    // Apply texture to mesh
    const mesh = cube.clone();
    mesh.traverse((child) => {
      // Texturize mesh
      if (child.isMesh) {
        const material = Utils.getMaterialForCube(this.lightPosition, texture, color);
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