import * as THREE from "three";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";
import {Vector2} from "three";
import {RubikInfo, Utils} from "../Utils/Utils.tsx";

type GestureDirection = "up" | "down" | "left" | "right" | null;

interface SelectingInfo {
  status: boolean,
  start: THREE.Vector2,
  direction: GestureDirection
}

class CubeGame extends CanvasBase {
  static readonly MAX_DRAG_AMOUNT = 5;
  static readonly SELECT_ANIM_SPEED = 10;

  static readonly GESTURE_DISTANCE_THRESHOLD = 20;

  static readonly BISECT_QUADRANT_FIRST = THREE.MathUtils.degToRad(45);
  static readonly BISECT_QUADRANT_SECOND = THREE.MathUtils.degToRad(135);
  static readonly BISECT_QUADRANT_THIRD = THREE.MathUtils.degToRad(225);
  static readonly BISECT_QUADRANT_FOURTH = THREE.MathUtils.degToRad(315);

  static readonly X_AXIS_VECTOR = new THREE.Vector2(1, 0);

  raycaster: THREE.Raycaster;
  dragAmount: number;
  selectedAnim: number;
  selectingInfo: SelectingInfo;

  constructor(gameSize: number) {
    super(CanvasBase.getRubikCubeImpl(gameSize), gameSize);

    this.raycaster = new THREE.Raycaster();
    this.dragAmount = 0;
    this.selectedAnim = 0.0;
    this.selectingInfo = {
      status: false,
      start: new THREE.Vector2(0, 0),
      direction: null
    };
  }

  getBoundingClientRect(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  }

  gameSizeChange(gameSize: number): void {
    // Move camera accordingly
    if (this.props && this.props!.camera) {
      this.setCameraPosition();
    }
  }

  advanceFrame(dt: number): void {
    this.rubikCube.advanceFrame(dt);

    this.selectedAnim += dt * CubeGame.SELECT_ANIM_SPEED;
    if (this.selectedAnim >= 314.1592) { // Prevent overflow (this is PI * 100)
      this.selectedAnim = 0;
    }

    Array.from(this.rubikCube.rubikInfos.values())
      .filter((mat: RubikInfo) => mat.selected)
      .forEach((mat: RubikInfo) => {
        mat.material.uniforms.uSelectedAnim.value = this.selectedAnim;
        mat.material.needsUpdate = true;
      });
  }

  assetLoaded() {
    super.assetLoaded();

    // Rotate on load (just for looks)
    const angle = new THREE.Euler().setFromQuaternion(this.rubikCube.rotation);
    if (angle.x.toFixed(0) == "0" && angle.y.toFixed(0) == "0") {
      this.rubikCube.rotateInScreenSpace(
        THREE.MathUtils.degToRad(16),
        THREE.MathUtils.degToRad(15)
      );
    }
  }

  onDragStart(point: Vector2) {
    if (this.selectingInfo.status) {
      this.selectingInfo.start = point;

      return;
    }

    super.onDragStart(point);

    this.dragAmount = 0;
  }

  onDragging(point: Vector2, delta: Vector2) {
    if (this.selectingInfo.status) {
      if (this.computeGesture(point)) {
        this.selectingInfo.status = false;
        this.deselectCubeFaces();
      }
      return;
    }

    super.onDragging(point, delta);

    this.dragAmount += Math.abs(delta.x) + Math.abs(delta.y);
  }

  onDragEnd(point: Vector2) {
    if (!this.selectingInfo.status) {
      super.onDragEnd(point);
    }

    if (!this.props) {
      return;
    }

    if (this.dragAmount > CubeGame.MAX_DRAG_AMOUNT) {
      return;
    } else if (this.selectingInfo.status) {
      this.deselectCubeFaces();
      return;
    }

    this.raycaster.setFromCamera(
      new THREE.Vector2(
        point.x / window.innerWidth * 2 - 1,
        point.y / window.innerHeight * -2 + 1,
      ),
      this.props!.camera
    );

    const intersects = this.raycaster.intersectObjects(this.props!.scene.children, true);
    if (intersects.length < 0) {
      return;
    }

    const allObjects = intersects.filter(item => item.object.type === "Mesh");
    if (!allObjects.length) {
      return;
    }

    const frontObject = allObjects.reduce(
      (previousValue, currentValue) =>
        !previousValue || currentValue.distance < previousValue.distance ? currentValue : previousValue
    );

    this.selectCubeFace(frontObject.object);
  }

  selectCubeFace(object: THREE.Object3D) {
    // frontObject.object.parent!.remove(frontObject.object);
    const name = object.name;
    const [ _, faceIndex, x, y ] = name.split("_").map(v => parseInt(v));
    const selecteds = this.selectCubeRow(faceIndex, x, y);
    console.log(`Selected object type is ${object.type} and name is ${name} and I select ${selecteds}`);

    this.selectedAnim = 0;

    for (const [key, material] of this.rubikCube.rubikInfos.entries()) {
      // Apply animation to shaders
      const selected = selecteds.has(key);
      material.material.uniforms.uSelected.value = selected ? 1.0 : 0.0;
      material.material.uniforms.uSelectedAnim.value = 0.0;
      material.selected = selected;
      material.material.needsUpdate = true;
    }

    this.selectingInfo.status = true;
  }

  deselectCubeFaces() {
    this.selectingInfo.status = false;

    for (const [_, material] of this.rubikCube.rubikInfos.entries()) {
      material.material.uniforms.uSelected.value = 0.0;
      material.material.uniforms.uSelectedAnim.value = 0.0;
      material.selected = false;
      material.material.needsUpdate = true;
    }
  }

  selectCubeRow(faceIndex: number, x: number, y: number): Set<string> {
    const names = new Set<string>();

    const hors = new Map<number, Array<THREE.Vector2>>();
    const vers = new Map<number, Array<THREE.Vector2>>();

    switch (faceIndex) {
      case 0:
        [0, 1, 2, 3].forEach((fi) => {
          hors.set(fi, [
            new THREE.Vector2(0, y),
            new THREE.Vector2(1, y),
            new THREE.Vector2(2, y)
          ]);
        });
        [0, 2, 4, 5].forEach((fi) => {
          vers.set(fi, [
            new THREE.Vector2(x, 0),
            new THREE.Vector2(x, 1),
            new THREE.Vector2(x, 2)
          ]);
        });
        break;
      default:
        throw `Invalid face index ${faceIndex}`;
    }

    for (let fi = 0; fi < 6; ++fi) {
      if (hors.has(fi)) {
        const hor = hors.get(fi)!;
        names.add(Utils.getCubeKeyForGame(fi, hor[0].x, hor[0].y));
        names.add(Utils.getCubeKeyForGame(fi, hor[1].x, hor[1].y));
        names.add(Utils.getCubeKeyForGame(fi, hor[2].x, hor[2].y));
      }

      if (vers.has(fi)) {
        const ver = vers.get(fi)!;
        names.add(Utils.getCubeKeyForGame(fi, ver[0].x, ver[0].y));
        names.add(Utils.getCubeKeyForGame(fi, ver[1].x, ver[1].y));
        names.add(Utils.getCubeKeyForGame(fi, ver[2].x, ver[2].y));
      }
    }

    return names;
  }

  /**
   * Please, don't provide angle over 360 degrees (in radians),
   * otherwise it will return always "right". Normalize it outside,
   * in the caller function.
   *
   * @param angleInRad angle in radians to compute the gesture direction for.
   */
  getGestureDirectionByAngle(angleInRad: number): GestureDirection {
    return angleInRad < CubeGame.BISECT_QUADRANT_FIRST ? "right" :
      angleInRad < CubeGame.BISECT_QUADRANT_SECOND ? "up" :
        angleInRad < CubeGame.BISECT_QUADRANT_THIRD ? "left" :
          angleInRad < CubeGame.BISECT_QUADRANT_FOURTH ? "down" :
            "right";
  }

  computeGesture(point: THREE.Vector2) {
    // Check if gesture is "enough"
    const dist = this.selectingInfo.start.distanceTo(point);
    if (dist < CubeGame.GESTURE_DISTANCE_THRESHOLD) {
      return false;
    }

    // Compute gesture direction
    const vdiff = point.clone().sub(this.selectingInfo.start);
    let angleInRad = vdiff.angleTo(CubeGame.X_AXIS_VECTOR);
    if (point.y > this.selectingInfo.start.y) {
      angleInRad += Math.PI;
    }

    this.selectingInfo.direction = this.getGestureDirectionByAngle(angleInRad);
    return true;
  }
}

export default CubeGame;