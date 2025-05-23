import * as THREE from "three";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";
import {Vector2} from "three";
import Utils from "../Utils/Utils.tsx";
import {RotateInfo, SelectedFace} from "./commonDataStructs.ts";
import getRotateInfoAggregate from "./getRotateInfoAggregate.ts";

type GestureDirection = "up" | "down" | "left" | "right";

interface SelectingInfo {
  status: 0 | 1 | 2,
  start: THREE.Vector2,
  direction: GestureDirection,
  selectedFace: SelectedFace,
  selecteds: Set<string>,
  rotateInfos: Map<string, RotateInfo | null>,
  frame: number
}

class CubeGame extends CanvasBase {
  static readonly MAX_DRAG_AMOUNT = 5;
  static readonly SELECT_ANIM_SPEED = 10;

  static readonly GESTURE_DISTANCE_THRESHOLD = 50;

  static readonly BISECT_QUADRANT_FIRST = THREE.MathUtils.degToRad(45);
  static readonly BISECT_QUADRANT_SECOND = THREE.MathUtils.degToRad(135);
  static readonly BISECT_QUADRANT_THIRD = THREE.MathUtils.degToRad(225);
  static readonly BISECT_QUADRANT_FOURTH = THREE.MathUtils.degToRad(315);

  static readonly X_AXIS_VECTOR = new THREE.Vector2(1, 0);

  isKeyPressed: (key: string) => boolean;
  gameOverCallback?: () => void;

  raycaster: THREE.Raycaster;
  dragAmount: number;
  selectedAnim: number;
  selectingInfo: SelectingInfo;

  constructor(gameSize: number, isKeyPressed: (key: string) => boolean, gameOverCallback?: () => void) {
    super(CanvasBase.getRubikCubeImpl(gameSize, gameOverCallback), gameSize);
    this.isKeyPressed = isKeyPressed;
    this.gameOverCallback = gameOverCallback;

    console.log("CubeGame Game size is", gameSize);

    this.raycaster = new THREE.Raycaster();
    this.dragAmount = 0;
    this.selectedAnim = 0.0;
    this.selectingInfo = {
      status: 0,
      start: new THREE.Vector2(0, 0),
      direction: "up",
      selectedFace: {
        faceIndex: -1,
        x: -1,
        y: -1
      },
      rotateInfos: new Map<string, RotateInfo | null>(),
      selecteds: new Set<string>(),
      frame: 0
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
    if (Utils.IS_DEBUG && this.isKeyPressed("E")) {
      if (this.gameOverCallback) {
        this.gameOverCallback();
      } else {
        console.log("Game Over detected, but no callback was provided");
      }
    }

    this.rubikCube.advanceFrame(dt);

    this.selectedAnim += dt * CubeGame.SELECT_ANIM_SPEED;
    if (this.selectedAnim >= 314.1592) { // Prevent overflow (this is PI * 100)
      this.selectedAnim = 0;
    }

    for (const [_, value] of this.rubikCube.rubikInfos.entries()) {
      if (!value.selected) {
        continue;
      }
      value.material.uniforms.uSelectedAnim.value = this.selectedAnim;
      value.material.needsUpdate = true;
    }

    if (this.selectingInfo.status === 2) {
      dt *= Utils.IS_DEBUG && this.isKeyPressed(" ") ? 10.0 : (Utils.IS_DEBUG ? 0.1 : 5.0);
      let angle: number;

      if (this.selectingInfo.frame + dt > 1.0) {
        angle = (1.0 - this.selectingInfo.frame) * 90;
        this.selectingInfo.frame = 1.0;

        this.selectingInfo.status = 0;

        this.props!.scene.updateMatrixWorld(true);

        this.rubikCube.endRotateCallback();
      } else {
        this.selectingInfo.frame += dt;
        angle = dt * 90;
      }

      const zeroVector = new THREE.Vector3(0, 0, 0);

      for (const [key, value] of this.rubikCube.rubikInfos.entries()) {
        const rotateInfo = this.selectingInfo.rotateInfos.get(key);
        if (rotateInfo) {
          Utils.rotateAroundPoint(value.mesh, zeroVector, rotateInfo.axis, THREE.MathUtils.degToRad(angle * rotateInfo.sign), rotateInfo.axisFirst, rotateInfo.signFirst);
        }
      }
    }
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
    this.selectingInfo.start = point;

    if (this.selectingInfo.status !== 0) {
      return;
    }

    super.onDragStart(point);

    this.dragAmount = 0;
  }

  onDragging(point: Vector2, delta: Vector2) {
    if (this.selectingInfo.status === 1) {
      if (this.computeGesture(point)) {
        // Status in "Wait for animation"
        this.selectingInfo.status = 2;

        // Perform rotation
        this.setupForRotation();

        // Deselect all faces
        this.deselectCubeFaces();
      }
      return;
    }

    super.onDragging(point, delta);

    this.dragAmount += Math.abs(delta.x) + Math.abs(delta.y);
  }

  onDragEnd(point: Vector2) {
    if (this.selectingInfo.status === 0) {
      super.onDragEnd(point);
    }

    if (!this.props) {
      return;
    }

    if (this.dragAmount > CubeGame.MAX_DRAG_AMOUNT) {
      return;
    } else if (this.selectingInfo.status === 1) {
      this.deselectCubeFaces();
      this.selectingInfo.status = 0;
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
    const [ faceIndex, x, y ] = Utils.getComponentsFromCubeKey(name);

    this.selectingInfo.selectedFace = {
      faceIndex: faceIndex,
      x: x,
      y: y
    };
    this.selectingInfo.selecteds = this.selectCubeRow(faceIndex, x, y);

    console.log(`Selected object type is ${object.type} and name is ${name} and I select`, this.selectingInfo.selecteds);

    this.selectedAnim = 0;

    for (const [key, value] of this.rubikCube.rubikInfos.entries()) {
      // Apply animation to shaders
      const selected = this.selectingInfo.selecteds.has(key);
      value.material.uniforms.uSelected.value = selected ? name === key ? 1.0 : 0.5 : 0.0;
      value.material.uniforms.uSelectedAnim.value = 0.0;
      value.material.needsUpdate = true;

      value.selected = selected;

      this.rubikCube.rubikInfos.set(key, value);
    }

    this.selectingInfo.status = 1;
  }

  deselectCubeFaces() {
    for (const [key, value] of this.rubikCube.rubikInfos.entries()) {
      value.material.uniforms.uSelected.value = 0.0;
      value.material.uniforms.uSelectedAnim.value = 0.0;
      value.material.needsUpdate = true;

      value.selected = false;

      this.rubikCube.rubikInfos.set(key, value);
    }
  }

  selectCubeRow(faceIndex: number, x: number, y: number): Set<string> {
    const names = new Set<string>();

    const items = new Map<number, Set<THREE.Vector2>>();
    [
      Utils.CUBE_FACE_INDEX_FRONT,
      Utils.CUBE_FACE_INDEX_RIGHT,
      Utils.CUBE_FACE_INDEX_BACK,
      Utils.CUBE_FACE_INDEX_LEFT,
      Utils.CUBE_FACE_INDEX_BOTTOM,
      Utils.CUBE_FACE_INDEX_TOP,
    ].forEach((fi) => items.set(fi, new Set<THREE.Vector2>()));

    const _add =
      (faceIndex: number, values: Array<THREE.Vector2>) =>
        values.forEach(v => items.get(faceIndex)!.add(v));

    const _inc = (fv: number, axisToFill: "x" | "y") =>
      new Array<THREE.Vector2>(this.gameSize)
        .fill(new THREE.Vector2(fv, fv))
        .map((v, index) => v.clone().setComponent(axisToFill === "x" ? 0 : 1, index));

    const gs = this.gameSize - 1;

    switch (faceIndex) {
      case Utils.CUBE_FACE_INDEX_FRONT:
        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(y, "x"));

        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(gs - x, "y"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(x, "y"));
        break;
      case Utils.CUBE_FACE_INDEX_RIGHT:
        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(y, "x"));

        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(gs - x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(gs - x, "x"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(x, "x"));
        break;
      case Utils.CUBE_FACE_INDEX_BACK:
        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(y, "x"));

        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(gs - x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(gs - x, "y"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(gs - x, "y"));
        break;
      case Utils.CUBE_FACE_INDEX_LEFT:
        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(y, "x"));

        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(gs - x, "y"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(x, "x"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(gs - x, "x"));
        break;
      case Utils.CUBE_FACE_INDEX_BOTTOM:
        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(gs - x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(x, "y"));

        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(gs - y, "y"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(y, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(y, "x"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(gs - y, "x"));
        break;
      case Utils.CUBE_FACE_INDEX_TOP:
        _add(Utils.CUBE_FACE_INDEX_FRONT, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BACK, _inc(gs - x, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(x, "y"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(x, "y"));

        _add(Utils.CUBE_FACE_INDEX_RIGHT, _inc(y, "y"));
        _add(Utils.CUBE_FACE_INDEX_LEFT, _inc(gs - y, "y"));
        _add(Utils.CUBE_FACE_INDEX_BOTTOM, _inc(gs - y, "x"));
        _add(Utils.CUBE_FACE_INDEX_TOP, _inc(y, "x"));
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
    let v: "h" | "v";
    let m: number;

    if (angleInRad < CubeGame.BISECT_QUADRANT_FIRST) {
      v = "h";
      m = 1;
    } else if (angleInRad < CubeGame.BISECT_QUADRANT_SECOND) {
      v = "v";
      m = 1;
    } else if (angleInRad < CubeGame.BISECT_QUADRANT_THIRD) {
      v = "h";
      m = -1;
    } else if (angleInRad < CubeGame.BISECT_QUADRANT_FOURTH) {
      v = "v";
      m = -1;
    } else {
      v = "h";
      m = 1;
    }

    if (Utils.CUBE_FACE_HORIZONTALS.includes(this.selectingInfo.selectedFace.faceIndex)) {
      m *= this.rubikCube.dragState.signX;
    }

    const mc = m > 0;
    return v === "h" ? (mc ? "right" : "left") : (mc ? "up" : "down");
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

    // Adjust angle based on direction
    if (vdiff.cross(CubeGame.X_AXIS_VECTOR) < 0) {
      angleInRad = 2 * Math.PI - angleInRad;
    }

    this.selectingInfo.direction = this.getGestureDirectionByAngle(angleInRad);
    console.log("Computed gesture direction is:", this.selectingInfo.direction);
    return true;
  }

  setupForRotation() {
    // Get row or column
    this.selectingInfo.frame = 0;
    this.selectingInfo.rotateInfos.clear();

    for (const [key, _] of this.rubikCube.rubikInfos.entries()) {
      const [faceIndex, x, y] = Utils.getComponentsFromCubeKey(key);
      const rotateInfo = getRotateInfoAggregate(this.isSwipeVertical(), this.isSwipeNegative(), this.gameSize, this.selectingInfo.selectedFace, faceIndex, x, y);
      this.selectingInfo.rotateInfos.set(key, rotateInfo);
    }
  }

  isSwipeVertical(): boolean {
    return this.selectingInfo.direction == "up" ||
      this.selectingInfo.direction == "down";
  }

  isSwipeNegative(): boolean {
    return this.selectingInfo.direction == "up" ||
      this.selectingInfo.direction == "left";
  }
}

export default CubeGame;