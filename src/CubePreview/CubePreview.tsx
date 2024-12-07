import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {CanvasInterface, CanvasUseEffectProps} from "../CanvasInterface/CanvasInterface.tsx";
import Utils from "../Utils/Utils.tsx";
import RubikCube from "../RubikCube/RubikCube.tsx";
import {Vector2} from "three";

class CubePreview implements CanvasInterface {
  static readonly DEBUG_AXIS_LENGTH = 15;

  props: CanvasUseEffectProps | null;
  cubeMesh: THREE.Group<THREE.Object3DEventMap> | null;
  texture: THREE.Texture | null;

  objLoader: OBJLoader;
  textureLoader: THREE.TextureLoader;

  rubikCube: RubikCube;
  gameSize: number;

  startDragging: boolean;

  static getRubikCubeImpl(): RubikCube {
    return new RubikCube(Utils.DEFAULT_GAME_SIZE);
  }

  constructor() {
    this.props = null;
    this.cubeMesh = null;
    this.texture = null;

    this.objLoader = new OBJLoader().setPath(document.URL);
    this.textureLoader = new THREE.TextureLoader();

    this.rubikCube = CubePreview.getRubikCubeImpl();
    this.gameSize = Utils.DEFAULT_GAME_SIZE;

    this.startDragging = false;
  }

  getBoundingClientRect(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  };

  useEffectStep(props: CanvasUseEffectProps): void {
    // Set props
    this.props = props;

    // Add lighting
    props.scene!.add(new THREE.AmbientLight(0xffffff, 0.75)); // Soft global illumination

    // Load Obj model
    this.objLoader.load(Utils.MESH_CUBE_PATH, (object) => this.meshLoaded(object));

    // Load texture
    this.textureLoader.load(Utils.TEXTURE_CUBE_PATH, (texture) => this.textureLoaded(texture));

    // Add the cube to the scene
    props.camera.position.z = this.getCameraDistanceForGameSize();

    // Create axis for debug
    if (CubePreview.DEBUG_AXIS_LENGTH > 0) {
      const axesHelper = new THREE.AxesHelper(CubePreview.DEBUG_AXIS_LENGTH);
      props.scene.add(axesHelper);
    }

    // Start animation loop
    const animate = () => {
      // Request animation frame
      requestAnimationFrame(animate);

      // Logic for advance frame
      if (this.cubeMesh !== null) {
        const dt = this.props!.clock.getDelta();
        this.advanceFrame(dt);

        // Render scene
        this.props!.renderer.render(this.props!.scene, this.props!.camera);
      }
    };
    animate();
  };

  gameSizeChange(gameSize: number) {
    // Call game size change on Rubik's Cube handler
    this.gameSize = gameSize;
    this.rubikCube.gameSizeChange(gameSize, this.props ? this.props!.scene : null, this.cubeMesh, this.texture);

    // Move camera accordingly
    if (this.props && this.props!.camera) {
      this.props!.camera.position.z = this.getCameraDistanceForGameSize();
    }
  }

  onDragStart(point: Vector2) {
    this.startDragging = true;
    this.rubikCube.onDragStart();
  }

  onDragging(point: Vector2) {
    if (!this.startDragging) {
      return;
    }

    this.rubikCube.onDragging(new THREE.Vector3(point.x, point.y, 0));
  }

  onDragEnd() {
    this.startDragging = false;
    this.rubikCube.onDragEnd();
  }

  getCameraDistanceForGameSize(): number {
    return 3 + (this.gameSize - 2) * 1.3;
  }

  meshLoaded(object: THREE.Group<THREE.Object3DEventMap>): void {
    this.cubeMesh = object;
    this.assetLoaded();
  }

  textureLoaded(texture: THREE.Texture): void {
    this.texture = texture;
    this.assetLoaded();
  }

  advanceFrame(dt: number): void {
    this.rubikCube.advanceFrame(dt);
  }

  assetLoaded(): void {
    // Check if both mesh and texture are present
    if (this.cubeMesh === null || this.texture === null) {
      return;
    }

    // Add cube to scene
    this.rubikCube.spawnFullCube(this.props!.scene, this.cubeMesh!, this.texture!)
  }
}

export default CubePreview;