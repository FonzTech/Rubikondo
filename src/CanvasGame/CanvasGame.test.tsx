import {fireEvent, render, waitFor} from '@testing-library/react';
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
import {expect} from "vitest";
import DraggableHandler from "../DraggableHandler/DraggableHandler.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

class CanvasLogicTest extends CanvasBase {
  framesStepped: number;
  mockedWidth: number;
  mockedHeight: number;

  onDragStartCalled: number;
  onDraggingCalled: number;
  onDragEndCalled: number;

  constructor() {
    super(vi.fn() as RubikCube, 3);

    this.framesStepped = 0;
    this.mockedWidth = -1;
    this.mockedHeight = -1;

    this.onDragStartCalled = 0;
    this.onDraggingCalled = 0;
    this.onDragEndCalled = 0;
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

  onDragStart(point: THREE.Vector2) {
    ++this.onDragStartCalled;
  }

  onDragging(point: THREE.Vector2, delta: THREE.Vector2) {
    ++this.onDraggingCalled;
  }

  onDragEnd(point: THREE.Vector2) {
    ++this.onDragEndCalled;
  }
}

describe('renders canvas preview', () => {
  test('renders canvas preview', async () => {
    // Render component
    const canvasLogicTest = new CanvasLogicTest();
    canvasLogicTest.mockedWidth = 640;
    canvasLogicTest.mockedHeight = 480;

    const renderResult = render(<CanvasGame
      addStyle={{}}
      canvasLogicInstantiator={() => canvasLogicTest}
      gameSize={3}
    />);

    // Basic test
    expect(canvasLogicTest.framesStepped).toBe(1);

    // Test canvas
    const canvas = renderResult.getByTestId("canvas-game");
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

    // Frames stepped
    await waitFor(async () => {
      const canvasGl = await renderResult.findByTestId("canvas-gl");
      expect(canvasGl).toBeInTheDocument();
    }, { timeout: 500, interval: 50 });

    // Check drag callbacks
    expect(canvasLogicTest.onDragStartCalled).toBe(0);
    expect(canvasLogicTest.onDraggingCalled).toBe(0);
    expect(canvasLogicTest.onDragEndCalled).toBe(0);
  });

  test('test draggable handlers', async () => {
    // Render component
    const canvasLogicTest = new CanvasLogicTest();
    canvasLogicTest.mockedWidth = 640;
    canvasLogicTest.mockedHeight = 480;

    const renderResult = render(<CanvasGame
      addStyle={{}}
      canvasLogicInstantiator={() => canvasLogicTest}
      gameSize={3}
    />);

    // Wait for canvas to render
    await waitFor(async () => {
      const canvasGl = await renderResult.findByTestId("canvas-gl");
      expect(canvasGl).toBeInTheDocument();
    }, { timeout: 500, interval: 50 });

    // Basic test
    const canvas = renderResult.getByTestId("canvas-game");
    expect(canvas).toBeInTheDocument();

    // Test full motion
    fireEvent.mouseDown(canvas, { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 40, clientY: 50 });
    fireEvent.mouseMove(document, { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 50, clientY: 60 });
    fireEvent.mouseUp(document, { button: DraggableHandler.MOUSE_BUTTON_LEFT });

    // Check drag callbacks
    expect(canvasLogicTest.onDragStartCalled).toBe(1);
    expect(canvasLogicTest.onDraggingCalled).toBe(1);
    expect(canvasLogicTest.onDragEndCalled).toBe(1);

    // Test not-coherent motion
    // No mouse down event on canvas!!
    fireEvent.mouseMove(document, { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 50, clientY: 60 });
    fireEvent.mouseUp(document, { button: DraggableHandler.MOUSE_BUTTON_LEFT });

    // Check drag callbacks. Call count must not change!
    expect(canvasLogicTest.onDragStartCalled).toBe(1);
    expect(canvasLogicTest.onDraggingCalled).toBe(1);
    expect(canvasLogicTest.onDragEndCalled).toBe(1);

    // Test full motion, but for a different mouse button
    fireEvent.mouseDown(canvas, { button: DraggableHandler.MOUSE_BUTTON_RIGHT, clientX: 40, clientY: 50 });
    fireEvent.mouseMove(document, { button: DraggableHandler.MOUSE_BUTTON_RIGHT, clientX: 50, clientY: 60 });
    fireEvent.mouseUp(document, { button: DraggableHandler.MOUSE_BUTTON_RIGHT });

    // Check drag callbacks
    expect(canvasLogicTest.onDragStartCalled).toBe(1);
    expect(canvasLogicTest.onDraggingCalled).toBe(1);
    expect(canvasLogicTest.onDragEndCalled).toBe(1);
  });
});