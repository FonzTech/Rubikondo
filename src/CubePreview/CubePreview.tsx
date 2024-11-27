import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {CanvasInterface, CanvasUseEffectProps} from "../CanvasInterface/CanvasInterface.tsx";
import Utils from "../Utils/Utils.tsx";
import RubikCube from "../RubikCube/RubikCube.tsx";

class CubePreview implements CanvasInterface {
  props: CanvasUseEffectProps | null;
  cubeMesh: THREE.Group<THREE.Object3DEventMap> | null;
  texture: THREE.Texture | null;

  objLoader: OBJLoader;
  textureLoader: THREE.TextureLoader;

  rubikCube: RubikCube;

  static getRubikCubeImpl(): RubikCube {
    return new RubikCube();
  }

  constructor() {
    this.props = null;
    this.cubeMesh = null;
    this.texture = null;

    this.objLoader = new OBJLoader().setPath(document.URL);
    this.textureLoader = new THREE.TextureLoader();

    this.rubikCube = CubePreview.getRubikCubeImpl();
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
    props.camera.position.z = 4;

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
    console.log("gameSize updated", gameSize);
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

    // Apply texture to mesh
    this.cubeMesh!.traverse((child) => {
      // Texturize mesh
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: this.texture!,
          color: 0xffffffff
        });
      }
    });

    // Add cube to scene
    this.rubikCube.spawnFullCube(this.props!.scene, this.cubeMesh!)
  }
}

export default CubePreview;