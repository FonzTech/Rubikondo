import * as THREE from "three";
import {CanvasInterface, CanvasFrameStepProps} from "../CanvasInterface/CanvasInterface.tsx";

class CubePreview implements CanvasInterface {
  getBoundingClientRect(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  };

  frameStep(props: CanvasFrameStepProps): void {

    // Create a geometry and material
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green cube
    const cube = new THREE.Mesh(geometry, material);

    // Add the cube to the scene
    props.scene.add(cube);
    props.camera.position.z = 2;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Get delta time
      const dt = props.clock.getDelta();

      // Actual logic
      cube.rotation.x += 0.8 * dt;
      cube.rotation.y += 0.8 * dt;

      props.renderer.render(props.scene, props.camera);
    };
    animate();
  };
}

export default CubePreview;