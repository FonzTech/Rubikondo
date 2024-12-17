import * as THREE from "three";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";
import {Vector2} from "three";

class CubeGame extends CanvasBase {
  static readonly MAX_DRAG_AMOUNT = 5;

  raycaster: THREE.Raycaster;
  dragAmount: number;

  constructor(gameSize: number) {
    super(CanvasBase.getRubikCubeImpl(), gameSize);

    this.raycaster = new THREE.Raycaster();
    this.dragAmount = 0;
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
    super.onDragStart(point);

    this.dragAmount = 0;
  }

  onDragging(point: Vector2, delta: Vector2) {
    super.onDragging(point, delta);

    this.dragAmount += delta.x + delta.y;
  }

  onDragEnd(point: Vector2) {
    super.onDragEnd(point);

    if (!this.props || this.dragAmount > CubeGame.MAX_DRAG_AMOUNT) {
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

    frontObject.object.parent!.remove(frontObject.object);
  }
}

export default CubeGame;