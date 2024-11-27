import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CanvasGame from "./CanvasGame.tsx";
import {CanvasUseEffectProps, CanvasInterface} from "../CanvasInterface/CanvasInterface.tsx";
import {
  mock_CanvasGame_getRubikCubeImpl,
  mock_Three_PerspectiveCamera_updateProjectionMatrix,
  mock_Three_WebGLRenderer_setSize
} from "../../vitest.setup.ts";
import CubePreview from "../CubePreview/CubePreview.tsx";

CubePreview.getRubikCubeImpl = mock_CanvasGame_getRubikCubeImpl;

class CanvasLogicTest implements CanvasInterface {
  framesStepped: number;
  mockedWidth: number;
  mockedHeight: number;

  constructor() {
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
}

test('renders canvas preview', () => {
  // Render component
  const canvasLogicTest = new CanvasLogicTest();
  canvasLogicTest.mockedWidth = 640;
  canvasLogicTest.mockedHeight = 480;

  render(<CanvasGame
    addStyle={{}}
    canvasLogicInstantiator={() => canvasLogicTest}
    gameSize={gameSize}
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