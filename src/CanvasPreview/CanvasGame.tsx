import * as React from 'react'
import {useEffect, useRef} from "react";
import * as THREE from "three";
import { CanvasInterface } from "../CanvasInterface/CanvasInterface.tsx";

interface CanvasGameProps {
  addStyle: React.CSSProperties,
  canvasLogic: CanvasInterface | null
}

const CanvasGame: React.FC<CanvasGameProps> = ({
  addStyle = {},
  canvasLogic = null
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || canvasLogic === null) {
      return;
    }

    // Get bounding rect
    let rect = canvasLogic!.getBoundingClientRect(canvasRef.current!);

    // Create a clock to track time
    const clock = new THREE.Clock();

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha: true});

    // Setup
    renderer.setSize(rect.width, rect.height);
    canvasRef.current!.appendChild(renderer.domElement);

    // Handle game logic
    canvasLogic!.frameStep({clock, scene, camera, renderer});

    // Resize handler
    const handleResize = () => {
      // Make browser recalculate minimum possible height
      renderer.setSize(1, 1);
      let rect = canvasLogic!.getBoundingClientRect(canvasRef.current!); // This updates layout

      // Set correct size and aspect ratio
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      // Remove event listener on cleanup
      window.removeEventListener("resize", handleResize);

      // Remove canvas renderer
      if (!canvasRef.current) {
        return;
      }
      while (canvasRef.current!.firstChild) {
        canvasRef.current!.removeChild(canvasRef.current.firstChild);
      }
    };
  }, []);

  return (
    <div
      data-testid="canvas-game"
      ref={canvasRef}
      style={{
        ...addStyle
      }}
    ></div>
  );
};

export default CanvasGame;