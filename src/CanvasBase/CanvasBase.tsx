import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import RubikCube from "../RubikCube/RubikCube.tsx";
import {Utils} from "../Utils/Utils.tsx";
import {Vector2} from "three";

export interface CanvasUseEffectProps {
  clock: THREE.Clock,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  gameSize: number,
}

export abstract class CanvasBase {
  rubikCube: RubikCube;
  gameSize: number;

  props: CanvasUseEffectProps | null;
  cubeMesh: THREE.Group<THREE.Object3DEventMap> | null;
  texture: THREE.Texture | null;

  objLoader: OBJLoader;
  textureLoader: THREE.TextureLoader;

  startDragging: boolean;

  static getRubikCubeImpl(gameSize?: number): RubikCube {
    return new RubikCube(gameSize || Utils.DEFAULT_GAME_SIZE);
  }

  constructor(rubikCube: RubikCube, gameSize: number) {
    this.rubikCube = rubikCube;
    this.gameSize = gameSize;

    this.props = null;
    this.cubeMesh = null;
    this.texture = null;

    this.objLoader = new OBJLoader().setPath(Utils.getAssetBasePath());
    this.textureLoader = new THREE.TextureLoader();

    this.startDragging = false;
  }

  gameSizeChange(gameSize: number): void;
  advanceFrame(dt: number): void;

  onDragStart(point: Vector2) {
    this.startDragging = true;
    this.rubikCube.onDragStart(point);
  }

  onDragging(point: Vector2, delta: THREE.Vector2) {
    if (!this.startDragging) {
      return;
    }

    this.rubikCube.onDragging(point, delta);
  }

  onDragEnd(point: Vector2) {
    this.startDragging = false;
    this.rubikCube.onDragEnd(point);
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
    this.textureLoader.load(Utils.getAssetBasePath() + Utils.TEXTURE_CUBE_PATH, (texture) => this.textureLoaded(texture));

    // Set camera position
    this.setCameraPosition();

    // Create axis for debug
    const al = Utils.getAxesLength();
    if (al > 0) {
      const axesGroup = new THREE.Group();

      const arrowPos = new THREE.Vector3( 0,0,0 );
      const arrowSize = 0;

      // Positive axes
      axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), arrowPos, al, 0xFF0000, arrowSize, arrowSize));
      axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), arrowPos, al, 0x00FF00, arrowSize, arrowSize));
      axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), arrowPos, al, 0x0000FF, arrowSize, arrowSize));

      // Negative axes
      axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), arrowPos, al, 0x600000, arrowSize, arrowSize));
      axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), arrowPos, al, 0x006000, arrowSize, arrowSize));
      axesGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), arrowPos, al, 0x000060, arrowSize, arrowSize));

      props.scene.add(axesGroup);
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

  meshLoaded(object: THREE.Group<THREE.Object3DEventMap>): void {
    this.cubeMesh = object;
    this.assetLoaded();
  }

  textureLoaded(texture: THREE.Texture): void {
    this.texture = texture;
    this.assetLoaded();
  }

  getCameraDistanceForGameSize(): number {
    if (this.props!.camera.aspect < 1) {
      return 12 + (this.gameSize - 2) * 5.5;
    }
    return 7 + (this.gameSize - 2) * 3.5;
  }

  assetLoaded(): void {
    // Check if both mesh and texture are present
    if (this.cubeMesh === null || this.texture === null) {
      return;
    }

    // Add cube to scene
    this.rubikCube.spawnFullCube(this.props!.scene, this.cubeMesh!, this.texture!)
  }

  setCameraPosition(): void {
    const position = Utils.VIEW_VECTOR.clone().multiplyScalar(this.getCameraDistanceForGameSize());
    this.props!.camera.position.set(position.x, position.y, position.z);
  }
}
