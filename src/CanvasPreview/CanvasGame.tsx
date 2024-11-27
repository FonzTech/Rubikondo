import * as React from 'react'
import {useEffect, useRef} from "react";
import * as THREE from "three";
import { CanvasInterface } from "../CanvasInterface/CanvasInterface.tsx";

interface CanvasGameProps {
  addStyle: React.CSSProperties,
  canvasLogicInstantiator: () => CanvasInterface,
  gameSize: number
}

const CanvasGame: React.FC<CanvasGameProps> = ({
  addStyle = {},
  canvasLogicInstantiator = null,
  gameSize = 3
}) => {
  // Enable cache for ThreeJs
  THREE.Cache.enabled = true;

  // Store component ref
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const canvasLogic = useRef<CanvasInterface | null>(null);

  // Use effect
  useEffect(() => {
    if (!canvasRef.current || canvasLogicInstantiator === null) {
      return;
    }

    // Instantiate canvas logic
    canvasLogic.current = canvasLogicInstantiator();

    // Get bounding rect
    let rect = canvasLogic.current!.getBoundingClientRect(canvasRef.current!);

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
    canvasLogic.current!.useEffectStep({clock, scene, camera, renderer, gameSize});

    // Resize handler
    const handleResize = () => {
      // Make browser recalculate minimum possible height
      renderer.setSize(1, 1);
      let rect = canvasLogic.current!.getBoundingClientRect(canvasRef.current!); // This updates layout

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

  useEffect(() => {
    if (canvasLogic === null) {
      return;
    }
    canvasLogic.current!.gameSizeChange(gameSize);
  }, [gameSize]);

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