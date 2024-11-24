// vitest.setup.ts

import { vi } from 'vitest';

// Mock the WebGLRenderer
vi.mock('three', async () => {
  // Import the original 'three' module without any mock
  const actualThree = await vi.importActual('three');

  return {
    ...actualThree, // Spread the actual Three.js module to keep everything else intact
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      render: vi.fn(),
      domElement: document.createElement('canvas'), // Mock the canvas element
    }))
  };
});