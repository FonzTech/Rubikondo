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
        console.log("Computed gesture is:", this.selectingInfo.direction);
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
    console.log(`Selected object type is ${object.type} and name is ${name} and I select`, selecteds);

    this.selectedAnim = 0;

    for (const [key, material] of this.rubikCube.rubikInfos.entries()) {
      // Apply animation to shaders
      const selected = selecteds.has(key);
      material.material.uniforms.uSelected.value = selected ? name === key ? 1.0 : 0.5 : 0.0;
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

    const items = new Map<number, Set<THREE.Vector2>>();
    [0, 1, 2, 3, 4, 5].forEach((fi) => items.set(fi, new Set<THREE.Vector2>()));

    const _add =
      (faceIndex: number, values: Array<THREE.Vector2>) =>
        values.forEach(v => items.get(faceIndex)!.add(v));

    const _inc = (fv: number, axisToFill: "x" | "y") =>
      new Array<THREE.Vector2>(this.gameSize)
        .fill(new THREE.Vector2(fv, fv))
        .map((v, index) => v.clone().setComponent(axisToFill === "x" ? 0 : 1, index));

    switch (faceIndex) {
      case 0:
        _add(0, _inc(y, "x"));
        _add(1, _inc(y, "x"));
        _add(2, _inc(y, "x"));
        _add(3, _inc(y, "x"));

        _add(0, _inc(x, "y"));
        _add(2, _inc(2 - x, "y"));
        _add(4, _inc(x, "y"));
        _add(5, _inc(x, "y"));
        break;
      case 1:
        _add(0, _inc(y, "x"));
        _add(1, _inc(y, "x"));
        _add(2, _inc(y, "x"));
        _add(3, _inc(y, "x"));

        _add(1, _inc(x, "y"));
        _add(3, _inc(2 - x, "y"));
        _add(4, _inc(2 - x, "x"));
        _add(5, _inc(x, "x"));
        break;
      case 2:
        _add(0, _inc(y, "x"));
        _add(1, _inc(y, "x"));
        _add(2, _inc(y, "x"));
        _add(3, _inc(y, "x"));

        _add(0, _inc(2 - x, "y"));
        _add(2, _inc(x, "y"));
        _add(4, _inc(2 - x, "y"));
        _add(5, _inc(2 - x, "y"));
        break;
      case 3:
        _add(0, _inc(y, "x"));
        _add(1, _inc(y, "x"));
        _add(2, _inc(y, "x"));
        _add(3, _inc(y, "x"));

        _add(1, _inc(2 - x, "y"));
        _add(3, _inc(x, "y"));
        _add(4, _inc(x, "x"));
        _add(5, _inc(2 - x, "x"));
        break;
      case 4:
        _add(0, _inc(x, "y"));
        _add(2, _inc(2 - x, "y"));
        _add(4, _inc(x, "y"));
        _add(5, _inc(x, "y"));

        _add(1, _inc(x, "y"));
        _add(3, _inc(2 - x, "y"));
        _add(4, _inc(y, "x"));
        _add(5, _inc(2 - y, "x"));
        break;
      case 5:
        _add(0, _inc(x, "y"));
        _add(2, _inc(2 - x, "y"));
        _add(4, _inc(x, "y"));
        _add(5, _inc(x, "y"));

        _add(1, _inc(x, "y"));
        _add(3, _inc(2 - x, "y"));
        _add(4, _inc(2 - y, "x"));
        _add(5, _inc(y, "x"));
        break;
      default:
        throw `Invalid face index ${faceIndex}`;
    }

    for (let fi = 0; fi < 6; ++fi) {
      items.get(fi)!.forEach((v) => {
        names.add(Utils.getCubeKeyForGame(fi, v.x, v.y));
        names.add(Utils.getCubeKeyForGame(fi, v.x, v.y));
        names.add(Utils.getCubeKeyForGame(fi, v.x, v.y));
      });
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