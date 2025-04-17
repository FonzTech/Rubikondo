import * as THREE from "three";
import Utils from "../Utils/Utils.tsx";
import {Vector2} from "three";
import RubikInfo from "../Model/RubikInfo.tsx";

interface RubikDragState {
  autoRotate: boolean | null,
  animMultFactory: number,
  angleX: number,
  angleY: number,
  signX: number
}

interface EndRotateItem {
  color: THREE.Color,
  current: string,
  reference: string
}

class RubikCube {
  static readonly MAX_ANIM_MULT_FACTOR = 0.35;
  static readonly X_AXIS = new THREE.Vector3(1, 0, 0);
  static readonly Y_AXIS = new THREE.Vector3(0, 1, 0);

  gameSize: number;
  gameOverCallback?: () => void;

  group: THREE.Group;
  rotation: THREE.Quaternion;
  lightPosition: THREE.Vector3;
  rubikInfos: Map<string, RubikInfo>;
  cubeColors: Map<string, THREE.Color>;

  dragState: RubikDragState;
  weakRefCube: WeakRef<THREE.Group<THREE.Object3DEventMap>> | null;
  weakRefTexture: WeakRef<THREE.Texture> | null;

  constructor(gameSize: number, gameOverCallback?: () => void) {
    // Assign variables
    this.gameSize = gameSize;
    this.gameOverCallback = gameOverCallback;

    // Initialize variables
    this.group = new THREE.Group();
    this.rotation = new THREE.Quaternion();
    this.lightPosition = new THREE.Vector3(0, 0, 0);
    this.rubikInfos = new Map<string, RubikInfo>();
    this.cubeColors = new Map<string, THREE.Color>();

    this.dragState = {
      autoRotate: null,
      animMultFactory: 0,
      angleX: 0,
      angleY: 0,
      signX: 1.0
    };

    this.weakRefCube = null;
    this.weakRefTexture = null;
  }

  spawnFullCube(scene: THREE.Scene, cube: THREE.Group<THREE.Object3DEventMap>, texture: THREE.Texture): void {
    // Destroy old group
    if (this.group !== null) {
      // Safety of this call is demanded to the caller!!
      scene.remove(this.group);
    }

    // Setup
    this.lightPosition.set(0, 0, this.gameSize);
    this.rubikInfos.clear();

    // Build cube colors
    this.buildCubeColors();

    // Create group of "N-squared" cubes
    this.group = this.getNewGroup();

    // Save (weak) references for later
    this.weakRefCube = new WeakRef<THREE.Group<THREE.Object3DEventMap>>(cube);
    this.weakRefTexture = new WeakRef<THREE.Texture>(texture);

    // Build cube faces
    this.buildCubeFaces(cube, texture);

    // Add group to scene
    scene.add(this.group);
  }

  buildCubeFaces(cube: THREE.Group<THREE.Object3DEventMap>, texture: THREE.Texture): void {
    // Build cube faces
    const zeroVector = new THREE.Vector3(0, 0, 0);

    const limit = this.gameSize;
    const offset = this.gameSize * -0.5 + 0.5;

    for (let fi = 0; fi < 6; ++fi) {
      for (let x = 0; x < limit; ++x) {
        for (let y = 0; y < limit; ++y) {
          const position = new THREE.Vector3(
            offset + x,
            offset + y,
            offset + this.gameSize - 0.5
          );

          const key = Utils.getCubeKey(fi, x, y);
          const color = this.cubeColors.get(key);
          if (!color) {
            throw new Error(`Could not get color for face ${key}`);
          }

          const _texture = Utils.IS_DEBUG ?
            Utils.generateCubeTextureForDebug(texture, key) :
            texture;

          const clone = this.getCubeMesh(cube, _texture!, color, Utils.getCubeKeyForGame(fi, x, y));
          clone.position.set(position.x, position.y, position.z);

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

          Utils.rotateAroundPoint(clone, zeroVector, axis, angle, axis);

          this.group.add(clone);
        }
      }
    }
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
        const shaderInfo: RubikInfo = {
          mesh: mesh,
          material: Utils.getMaterialForCube(this.lightPosition, texture, color),
          selected: false,
          lastRotationAxis: new THREE.Vector3(0, 0)
        };
        child.material = shaderInfo.material;
        child.name = meshName;

        this.rubikInfos.set(meshName, shaderInfo);
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
          const index = Utils.RANDOMIZE_CUBE ? Math.floor(Math.random() * colors.length) : 0;
          const key = Utils.getCubeKey(fi, x, y);
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

  endRotateCallback() {
    const inverseQuat = this.rotation.clone().invert();

    const references = this.getReferenceForFaces();
    // console.log("Computed references for faces is", references);

    const faces = new Map<string, EndRotateItem>();

    // Iterate through all faces
    for (const [key, value] of this.rubikInfos.entries()) {
      // Get absolute point position
      const p = new THREE.Vector3();
      value.mesh.updateMatrixWorld(true);
      value.mesh.getWorldPosition(p);
      p.applyQuaternion(inverseQuat);
      // console.log("End rotation is:", key, p);

      const pk = [
        this.getFaceStartingPositionCoord(p.x),
        this.getFaceStartingPositionCoord(p.y),
        this.getFaceStartingPositionCoord(p.z)
      ].join("_");

      if (faces.has(pk)) {
        // This should never happen!!
        console.error(`endRotateCallback - Computed face for PosKey ${pk} and FaceKey ${key} collides with ${faces.get(pk)}`);
      } else {
        const cubeKey = key.replace(Utils.getCubeKeyPrefix(), "");
        const color = this.cubeColors.get(cubeKey)!;

        const referenceValueOpt = references.get(pk);
        if (!referenceValueOpt) {
          throw `Could not get target for key ${pk}`;
        }
        const referenceValue = referenceValueOpt!;

        faces.set(pk, {
          color: color,
          current: cubeKey,
          reference: referenceValue
        });
      }
    }
    console.log("Computed Faces is", faces);

    // Swap colors
    for (const [_, faceItem] of faces.entries()) {
      this.cubeColors.set(faceItem.reference, faceItem.color);
    }

    // Rebuild cube faces with updated rotated colors
    requestAnimationFrame((() => {
      if (!this.weakRefCube) {
        throw "WeakRef for Cube is null";
      }
      if (!this.weakRefTexture) {
        throw "WeakRef for Texture is null";
      }

      this.group.clear();
      this.buildCubeFaces(this.weakRefCube.deref()!, this.weakRefTexture.deref()!);

      this.checkForGameEnd();
    }).bind(this));
  }

  getFaceStartingPositionCoord(value: number): string {
    return (Math.round(value / 0.5) * 0.5).toFixed(2);
  }

  getReferenceForFaces(): Map<string, string> {
    const items = new Map<string, string>();

    const limit = this.gameSize;
    const offset = this.gameSize * -0.5 + 0.5;

    for (let fi = 0; fi < 6; ++fi) {
      for (let x = 0; x < limit; ++x) {
        for (let y = 0; y < limit; ++y) {
          // Compute position in "game space"
          const position = new THREE.Vector3(
            offset + x,
            offset + y,
            offset + this.gameSize - 0.5
          );

          const key = Utils.getCubeKey(fi, x, y);

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

          position.applyAxisAngle(axis, angle);

          const pk = [
            this.getFaceStartingPositionCoord(position.x),
            this.getFaceStartingPositionCoord(position.y),
            this.getFaceStartingPositionCoord(position.z)
          ].join("_");

          const currentKey = items.get(pk);
          if (currentKey) {
            Utils.spawnDebugSphere(position, this.group);
            throw `Reference Face ${pk} has already key ${currentKey!} while trying to set ${key}`;
          }
          items.set(pk, key);

          // console.log(`I just set ${pk} for ${key} - Raw pos is ${position.x} - ${position.y} - ${position.z}`);
        }
      }
    }

    return items;
  }

  checkForGameEnd(): number {
    const limit = this.gameSize;

    for (let fi = 0; fi < 6; ++fi) {
      let color: THREE.Color | null = null;

      for (let x = 0; x < limit; ++x) {
        for (let y = 0; y < limit; ++y) {

          const item = this.cubeColors.get(`${fi}_${x}_${y}`)!;
          if (x === 0 && y === 0) {
            color = item;
            continue;
          }

          if (!color?.equals(item)) {
            return 1;
          }

        }
      }
    }

    if (this.gameOverCallback) {
      this.gameOverCallback();
      return 0;
    }

    console.log("Game Over detected, but no callback was provided");
    return 1;
  }
}

export default RubikCube;