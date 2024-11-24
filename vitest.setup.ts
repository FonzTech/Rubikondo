// vitest.setup.ts

import { vi } from 'vitest';
import {Vector3} from "three/src/math/Vector3";

// Mock the WebGLRenderer
export const mock_Three_WebGLRenderer_setSize = vi.fn();
export const mock_Three_WebGLRenderer_render = vi.fn();
export const mock_Three_PerspectiveCamera_updateProjectionMatrix = vi.fn();

vi.mock('three', async () => {
  // Import the original 'three' module without any mock
  const actualThree = await vi.importActual('three');

  return {
    ...actualThree, // Spread the actual Three.js module to keep everything else intact
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: mock_Three_WebGLRenderer_setSize,
      render: mock_Three_WebGLRenderer_render,
      domElement: document.createElement('canvas') // Mock the canvas element
    })),
    PerspectiveCamera: vi.fn().mockImplementation(() => ({
      updateProjectionMatrix: mock_Three_PerspectiveCamera_updateProjectionMatrix,
      position: new Vector3()
    }))
  };
});