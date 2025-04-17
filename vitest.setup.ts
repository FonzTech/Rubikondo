// vitest.setup.ts

import { vi } from 'vitest';
import * as THREE from "three";

// Globals
export const mock_Global_requestAnimationFrame = vi.fn();

global.requestAnimationFrame = mock_Global_requestAnimationFrame;

// RubikCube
export const mock_RubikCube_spawnFullCube = vi.fn();
export const mock_RubikCube_advanceFrame = vi.fn();
export const mock_RubikCube_gameSizeChange = vi.fn();
export const mock_RubikCube_rotateInScreenSpace = vi.fn();

export const mock_CanvasBase_getRubikCubeImpl = vi.fn().mockImplementation(() => ({
  spawnFullCube: mock_RubikCube_spawnFullCube,
  advanceFrame: mock_RubikCube_advanceFrame,
  gameSizeChange: mock_RubikCube_gameSizeChange,
  rotateInScreenSpace: mock_RubikCube_rotateInScreenSpace,
  getNewGroup: vi.fn(),
  dragState: {
    autoRotate: null
  },
  rotation: new THREE.Quaternion(),
  onDragStart: vi.fn(),
  onDragging: vi.fn(),
  onDragEnd: vi.fn(),
  materials: new Map<string, any>()
}));

// USE LIKE THIS -> CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

// WebGLRenderer
export const mock_Three_WebGLRenderer_setSize = vi.fn();
export const mock_Three_WebGLRenderer_render = vi.fn();

// Perspective camera
export const mock_Three_PerspectiveCamera_updateProjectionMatrix = vi.fn();

// Scene
export const mock_Three_Scene_add = vi.fn();
export const mock_Three_Scene_remove = vi.fn();

// ThreeJs Mock
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
      position: new THREE.Vector3(),
      aspect: 1.0
    })),
    Scene: vi.fn().mockImplementation(() => ({
      add: mock_Three_Scene_add,
      remove: mock_Three_Scene_remove
    }))
  };
});

// This will run before each test
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllTimers();
  vi.clearAllMocks();
});