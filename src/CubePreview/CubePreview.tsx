import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {CanvasInterface, CanvasUseEffectProps} from "../CanvasInterface/CanvasInterface.tsx";
import Utils from "../Utils/Utils.tsx";
import RubikCube from "../RubikCube/RubikCube.tsx";

class CubePreview implements CanvasInterface {
  static readonly DEBUG_AXIS_LENGTH = 15;

  props: CanvasUseEffectProps | null;
  cubeMesh: THREE.Group<THREE.Object3DEventMap> | null;
  texture: THREE.Texture | null;

  objLoader: OBJLoader;
  textureLoader: THREE.TextureLoader;

  rubikCube: RubikCube;
  gameSize: number;

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
      // X-axis (Red)
      const xGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),  // Start point
        new THREE.Vector3(CubePreview.DEBUG_AXIS_LENGTH, 0, 0) // End point
      ]);
      const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red for X-axis
      const xAxis = new THREE.Line(xGeometry, xMaterial);

      // Y-axis (Green)
      const yGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, CubePreview.DEBUG_AXIS_LENGTH, 0)
      ]);
      const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Green for Y-axis
      const yAxis = new THREE.Line(yGeometry, yMaterial);

      // Z-axis (Blue)
      const zGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, CubePreview.DEBUG_AXIS_LENGTH)
      ]);
      const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue for Z-axis
      const zAxis = new THREE.Line(zGeometry, zMaterial);

      // Add axes to the scene
      props.scene.add(xAxis);
      props.scene.add(yAxis);
      props.scene.add(zAxis);
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