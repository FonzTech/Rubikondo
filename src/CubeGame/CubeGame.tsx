import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";

class CubeGame extends CanvasBase {
  constructor(gameSize: number) {
    super(CanvasBase.getRubikCubeImpl(), gameSize);
  }

  getBoundingClientRect(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  }

  gameSizeChange(gameSize: number): void {
    // Move camera accordingly
    if (this.props && this.props!.camera) {
      this.setCameraPosition();
    }
  }

  advanceFrame(dt: number): void {
    this.rubikCube.advanceFrame(dt);
  }
}

export default CubeGame;