import * as THREE from "three";
import {CanvasInterface, CanvasFrameStepProps} from "../CanvasInterface/CanvasInterface.tsx";

class CubePreview implements CanvasInterface {
  cube: THREE.Mesh | null;

  constructor() {
    this.cube = null;
  }

  getBoundingClientRect(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  };

  frameStep(props: CanvasFrameStepProps): void {
    // Create a geometry and material
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green cube
    this.cube = new THREE.Mesh(geometry, material);

    // Add the cube to the scene
    props.scene.add(this.cube!);
    props.camera.position.z = 2;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const dt = props.clock.getDelta();
      this.advanceFrame(dt);

      props.renderer.render(props.scene, props.camera);
    };
    animate();
  };

  advanceFrame(dt: number): void {
    this.cube!.rotation.x += 0.4 * dt;
    this.cube!.rotation.y += 0.4 * dt;
  }
}

export default CubePreview;