import {CanvasBase, } from "../CanvasBase/CanvasBase.tsx";
import Utils from "../Utils/Utils.tsx";

class CubePreview extends CanvasBase {
  static readonly ASSET_BASE_PATH = Utils.getAssetBasePath();

  constructor() {
    super(CanvasBase.getRubikCubeImpl(), Utils.DEFAULT_GAME_SIZE);
    this.rubikCube.dragState.autoRotate = true;
  }

  gameSizeChange(gameSize: number) {
    // Call game size change on Rubik's Cube handler
    if (this.gameSize !== gameSize) {
      this.gameSize = gameSize;
      this.rubikCube.gameSizeChange(gameSize, this.props ? this.props!.scene : null, this.cubeMesh, this.texture);
    }

    // Move camera accordingly
    if (this.props && this.props!.camera) {
      this.setCameraPosition();
    }
  }

  advanceFrame(dt: number): void {
    this.rubikCube.advanceFrame(dt);
  }
}

export default CubePreview;