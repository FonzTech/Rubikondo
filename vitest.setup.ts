// vitest.setup.ts

import { vi } from 'vitest';

// Mock the WebGLRenderer
export const mock_Three_WebGLRenderer_setSize = vi.fn();
export const mock_Three_PerspectiveCamera_updateProjectionMatrix = vi.fn();

vi.mock('three', async () => {
  // Import the original 'three' module without any mock
  const actualThree = await vi.importActual('three');

  return {
    ...actualThree, // Spread the actual Three.js module to keep everything else intact
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: mock_Three_WebGLRenderer_setSize,
      domElement: document.createElement('canvas') // Mock the canvas element
    })),
    PerspectiveCamera: vi.fn().mockImplementation(() => ({
      updateProjectionMatrix: mock_Three_PerspectiveCamera_updateProjectionMatrix
    }))
  };
});