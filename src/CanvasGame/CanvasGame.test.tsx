import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CanvasGame from "./CanvasGame.tsx";
import {CanvasUseEffectProps, CanvasBase} from "../CanvasBase/CanvasBase.tsx";
import {
  mock_CanvasBase_getRubikCubeImpl,
  mock_Three_PerspectiveCamera_updateProjectionMatrix,
  mock_Three_WebGLRenderer_setSize
} from "../../vitest.setup.ts";
import * as THREE from "three";
import RubikCube from "../RubikCube/RubikCube.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

class CanvasLogicTest extends CanvasBase {
  framesStepped: number;
  mockedWidth: number;
  mockedHeight: number;

  constructor() {
    super(vi.fn() as RubikCube, 3);

    this.framesStepped = 0;
    this.mockedWidth = -1;
    this.mockedHeight = -1;
  }

  getBoundingClientRect(_: HTMLElement): DOMRect {
    return {x: 0, y: 0, width: this.mockedWidth, height: this.mockedHeight} as DOMRect;
  };

  useEffectStep(props: CanvasUseEffectProps): void {
    ++this.framesStepped;

    expect(props).not.toBeNull()
    expect(props.clock).not.toBeNull()
    expect(props.camera).not.toBeNull()
    expect(props.renderer).not.toBeNull()
    expect(props.scene).not.toBeNull()
  };

  gameSizeChange(_: number) {}

  onDragStart(point: THREE.Vector2) {}

  onDragging(point: THREE.Vector2, delta: THREE.Vector2) {}

  onDragEnd(point: THREE.Vector2) {}
}

test('renders canvas preview', () => {
  // Render component
  const canvasLogicTest = new CanvasLogicTest();
  canvasLogicTest.mockedWidth = 640;
  canvasLogicTest.mockedHeight = 480;

  render(<CanvasGame
    addStyle={{}}
    canvasLogicInstantiator={() => canvasLogicTest}
    gameSize={3}
  />);

  // Basic test
  expect(canvasLogicTest.framesStepped).toBe(1);

  // Test canvas
  const canvas = screen.getByTestId("canvas-game");
  expect(canvas).toBeInTheDocument();
  expect(mock_Three_WebGLRenderer_setSize).toHaveBeenCalledWith(640, 480);

  // Trigger window resize
  canvasLogicTest.mockedWidth = 1920;
  canvasLogicTest.mockedHeight = 1080;
  window.dispatchEvent(new Event("resize"));

  expect(mock_Three_WebGLRenderer_setSize).toHaveBeenCalledWith(1, 1);
  expect(mock_Three_WebGLRenderer_setSize).toHaveBeenCalledWith(1920, 1080);
  expect(mock_Three_PerspectiveCamera_updateProjectionMatrix).toHaveBeenCalled();

  expect(mock_Three_WebGLRenderer_setSize).toHaveBeenCalledTimes(3);
  expect(mock_Three_PerspectiveCamera_updateProjectionMatrix).toHaveBeenCalledTimes(1);

  // Frames stepped
  expect(canvasLogicTest.framesStepped).toBe(1);
});