import * as THREE from "three";
import Utils from "../Utils/Utils.tsx";
import {Vector2} from "three";

interface RubikDragState {
  autoRotate: boolean | null,
  animMultFactory: number,
  angleX: number,
  angleY: number,
  signX: number
}

class RubikCube {
  static readonly MAX_ANIM_MULT_FACTOR = 0.35;
  static readonly X_AXIS = new THREE.Vector3(1, 0, 0);
  static readonly Y_AXIS = new THREE.Vector3(0, 1, 0);

  gameSize: number;

  group: THREE.Group;
  rotation: THREE.Quaternion;
  lightPosition: THREE.Vector3;
  materials: THREE.ShaderMaterial[];
  cubeColors: Map<string, THREE.Color>;

  dragState: RubikDragState;

  constructor(gameSize: number) {
    // Assign variables
    this.gameSize = gameSize;

    // Initialize variables
    this.group = new THREE.Group();
    this.rotation = new THREE.Quaternion();
    this.lightPosition = new THREE.Vector3(0, 0, 0);
    this.materials = [];
    this.cubeColors = new Map<string, THREE.Color>();

    this.dragState = {
      autoRotate: null,
      animMultFactory: 0,
      angleX: 0,
      angleY: 0,
      signX: 1.0
    };
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

    // Build cube colors
    this.buildCubeColors();

    // Create group of six cubes
    this.group = this.getNewGroup();

    const limit = this.gameSize;
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
          const color = this.cubeColors.get(key);
          if (!color) {
            throw new Error(`Could not get color for face ${key}`);
          }

          const faceGroup = this.getNewGroup();

          const clone = this.getCubeMesh(cube, texture, color, `Cube_${key}`);
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
    if (this.group !== null && this.dragState.autoRotate !== null) {
      // Rotate only if user isn't rotating by his actions
      if (this.dragState.autoRotate) {
        this.dragState.animMultFactory += 0.005;
        if (this.dragState.animMultFactory > RubikCube.MAX_ANIM_MULT_FACTOR) {
          this.dragState.animMultFactory = RubikCube.MAX_ANIM_MULT_FACTOR;
        }
      } else {
        this.dragState.animMultFactory -= 0.005;
        if (this.dragState.animMultFactory < 0) {
          this.dragState.animMultFactory = 0;
        }
      }
      if (this.dragState.animMultFactory > 0.000001) {
        const f = this.dragState.animMultFactory * dt;
        this.rotateInScreenSpace(f, f);
      }

      // Log
      {
        const otherInfo = document.getElementsByClassName("debug-data");
        if (otherInfo.length) {
          otherInfo[0].innerHTML = "dragState.animMultFactory = " + this.dragState.animMultFactory.toFixed(2);
        }
      }
    }

    // Update rotation
    this.group.rotation.setFromQuaternion(this.rotation, "XYZ");
  }

  onDragStart(point: THREE.Vector2) {
    if (this.dragState.autoRotate !== null) {
      this.dragState.autoRotate = false;
    }

    // Save sign X
    const angleY = THREE.MathUtils.euclideanModulo(this.dragState.angleY, Utils.DOUBLE_PI);
    this.dragState.signX = angleY > Utils.HALF_PI && angleY < Utils.ONE_AND_HALF_PI ? -1.0 : 1.0;
  }

  onDragging(point: THREE.Vector2, delta: THREE.Vector2) {
    this.rotateFromMouseDelta(delta);
  }

  onDragEnd(point: Vector2) {
    if (this.dragState.autoRotate !== null) {
      this.dragState.autoRotate = true;
    }
  }

  gameSizeChange(gameSize: number, scene: THREE.Scene | null, cube: THREE.Group<THREE.Object3DEventMap> | null, texture: THREE.Texture | null): void {
    this.gameSize = gameSize;

    if (this.group !== null && scene !== null && cube !== null && texture !== null) {
      this.spawnFullCube(scene!, cube!, texture!);
    }
  }

  getCubeMesh(cube: THREE.Group<THREE.Object3DEventMap>, texture: THREE.Texture, color: THREE.Color, meshName: string): THREE.Group<THREE.Object3DEventMap> {
    // Apply texture to mesh
    const mesh = cube.clone();
    mesh.traverse((child) => {
      // Texturize mesh
      if (child.isMesh) {
        const material = Utils.getMaterialForCube(this.lightPosition, texture, color);
        child.material = material;
        child.name = meshName;

        this.materials.push(material);
      }
    });
    return mesh;
  }

  getNewGroup(): THREE.Group {
    return new THREE.Group();
  }

  buildCubeColors(): void {
    let limit = Math.pow(this.gameSize, 2);

    this.cubeColors.clear();

    const colors: THREE.Color[] =
      new Array(limit).fill(Utils.CUBE_COLOR_WHITE)
        .concat(new Array(limit).fill(Utils.CUBE_COLOR_ORANGE))
        .concat(new Array(limit).fill(Utils.CUBE_COLOR_GREEN))
        .concat(new Array(limit).fill(Utils.CUBE_COLOR_RED))
        .concat(new Array(limit).fill(Utils.CUBE_COLOR_BLUE))
        .concat(new Array(limit).fill(Utils.CUBE_COLOR_YELLOW));

    limit = this.gameSize;
    for (let fi = 0; fi < 6; ++fi) {
      for (let x = 0; x < limit; ++x) {
        for (let y = 0; y < limit; ++y) {
          const index = Math.floor(Math.random() * colors.length);
          const key = `${fi}_${x}_${y}`;
          this.cubeColors.set(key, colors[index]);
          colors.splice(index, 1);
        }
      }
    }
  }

  rotateFromMouseDelta(delta: THREE.Vector2) {
    const deltaX = delta.x * 0.0075 * this.dragState.signX;
    const deltaY = delta.y * 0.0075;

    this.rotateInScreenSpace(deltaX, deltaY);
  }

  rotateInScreenSpace(deltaX: number, deltaY: number) {
    this.dragState.angleX += deltaX;
    this.dragState.angleY += deltaY;

    const viewVector = Utils.VIEW_VECTOR.clone();
    viewVector.applyEuler(new THREE.Euler(0, -this.dragState.angleX, 0, "XYZ"));

    const newQuat = new THREE.Quaternion();

    const verAxis = new THREE.Vector3().crossVectors(RubikCube.Y_AXIS, viewVector).normalize();

    newQuat.multiply(new THREE.Quaternion()
    .setFromAxisAngle(
      RubikCube.Y_AXIS,
      deltaX
    ));

    newQuat.multiply(new THREE.Quaternion()
    .setFromAxisAngle(
      verAxis,
      deltaY
    ));

    this.rotation.multiply(newQuat);
  }
}

export default RubikCube;