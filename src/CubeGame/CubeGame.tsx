import * as THREE from "three";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";
import {Vector2} from "three";
import {RubikShaderInfo} from "../Utils/Utils.tsx";

class CubeGame extends CanvasBase {
  static readonly MAX_DRAG_AMOUNT = 5;
  static readonly SELECT_ANIM_SPEED = 10;

  raycaster: THREE.Raycaster;
  dragAmount: number;
  selectedAnim: number;

  constructor(gameSize: number) {
    super(CanvasBase.getRubikCubeImpl(gameSize), gameSize);

    this.raycaster = new THREE.Raycaster();
    this.dragAmount = 0;
    this.selectedAnim = 0.0;
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

    Array.from(this.rubikCube.materials.values())
      .filter((mat: RubikShaderInfo) => mat.selected)
      .forEach((mat: RubikShaderInfo) => {
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
    super.onDragStart(point);

    this.dragAmount = 0;
  }

  onDragging(point: Vector2, delta: Vector2) {
    super.onDragging(point, delta);

    this.dragAmount += Math.abs(delta.x) + Math.abs(delta.y);
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

    this.selectCubeFace(frontObject.object);
  }

  selectCubeFace(object: THREE.Object3D) {
    // frontObject.object.parent!.remove(frontObject.object);
    const name = object.name;
    console.log(`Selected object type is ${object.type} and name is ${name}`);

    const mat = this.rubikCube.materials.get(name);
    if (!mat) {
      throw `Could not find material for face ${name}`;
    }

    // Reset selection animation
    this.selectedAnim = 0;

    // Apply animation to shaders
    mat!.material.uniforms.uSelected.value = 1.0;
    mat!.material.uniforms.uSelectedAnim.value = 0.0;
    mat!.selected = true;
    mat!.material.needsUpdate = true;
  }
}

export default CubeGame;