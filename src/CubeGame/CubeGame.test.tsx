import '@testing-library/jest-dom';
import {
  mock_CanvasBase_getRubikCubeImpl,
  mock_RubikCube_advanceFrame,
  mock_RubikCube_rotateInScreenSpace
} from "../../vitest.setup.ts";
import * as THREE from "three";
import {CanvasBase, CanvasUseEffectProps} from "../CanvasBase/CanvasBase.tsx";
import CubePreview from "../CubePreview/CubePreview.tsx";
import CubeGame from "./CubeGame.tsx";
import {RubikInfo, Utils} from "../Utils/Utils.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

describe('cube game implementation', () => {
  it('should return element bounding client rect', () => {
    const cp = new CubePreview();
    const element = {
      getBoundingClientRect: () => ({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        left: 5,
        top: 6,
        right: 7,
        bottom: 8
      } as DOMRect)
    } as HTMLElement;

    const rect = cp.getBoundingClientRect(element);
    expect(rect.x).toBe(1);
    expect(rect.y).toBe(2);
    expect(rect.width).toBe(3);
    expect(rect.height).toBe(4);
    expect(rect.left).toBe(5);
    expect(rect.top).toBe(6);
    expect(rect.right).toBe(7);
    expect(rect.bottom).toBe(8);
  });

  it('game size change', () => {
    const mock_setCameraPosition = vi.fn();

    const cp = new CubeGame();
    cp.setCameraPosition = mock_setCameraPosition;

    cp.gameSizeChange(1);
    expect(mock_setCameraPosition).toHaveBeenCalledTimes(0);

    cp.props = {} as CanvasUseEffectProps;
    cp.gameSizeChange(2);
    expect(mock_setCameraPosition).toHaveBeenCalledTimes(0);

    cp.props!.camera = vi.fn();
    cp.gameSizeChange(3);
    expect(mock_setCameraPosition).toHaveBeenCalledTimes(1);
  });

  it('advance frame', () => {
    const cp = new CubeGame(6);
    cp.rubikCube.rubikInfos = new Map<string, RubikInfo>();
    cp.advanceFrame(1.5);
    expect(mock_RubikCube_advanceFrame).toHaveBeenCalledTimes(1);
  });

  it('asset loaded', () => {
    const cp = new CubeGame(6);

    cp.assetLoaded();
    expect(mock_RubikCube_rotateInScreenSpace).toHaveBeenCalledTimes(1);
  });

  it('drag movement', () => {
    const cp = new CubeGame(6);

    cp.onDragStart(new THREE.Vector2(100, 200));
    cp.onDragging(new THREE.Vector2(101, 202), new THREE.Vector2(1, 2));
    cp.onDragEnd(new THREE.Vector2(101, 202));
  });

  it('select cube row', () => {
    const cp = new CubeGame(6);
    const result = cp.selectCubeRow(1, 2, 3);

    expect(result).toStrictEqual(new Set<string>([
      Utils.getCubeKeyForGame(1, 0, 3),
      Utils.getCubeKeyForGame(1, 1, 3),
      Utils.getCubeKeyForGame(1, 2, 3),

      Utils.getCubeKeyForGame(1, 2, 0),
      Utils.getCubeKeyForGame(1, 2, 1),
      Utils.getCubeKeyForGame(1, 2, 2)
    ]));
  });

  it('gesture direction by angle', () => {
    const cp = new CubeGame(6);

    expect(cp.getGestureDirectionByAngle(0)).toBe("right");
    expect(cp.getGestureDirectionByAngle(0.001)).toBe("right");
    expect(cp.getGestureDirectionByAngle(0.785398)).toBe("right");

    expect(cp.getGestureDirectionByAngle(0.785399)).toBe("up");
    expect(cp.getGestureDirectionByAngle(2.35619)).toBe("up");

    expect(cp.getGestureDirectionByAngle(2.35620)).toBe("left");
    expect(cp.getGestureDirectionByAngle(3.92699)).toBe("left");

    expect(cp.getGestureDirectionByAngle(3.927)).toBe("down");
    expect(cp.getGestureDirectionByAngle(5.49699)).toBe("down");

    expect(cp.getGestureDirectionByAngle(5.4978)).toBe("right");
    expect(cp.getGestureDirectionByAngle(6.28319)).toBe("right");
  });

  it('compute gesture', () => {
    const cp = new CubeGame(6);

    expect(cp.computeGesture(new THREE.Vector2(1, 2))).toBe(false);
    expect(cp.selectingInfo.direction).toBe(null);

    cp.selectingInfo.start.set(100, 200);

    expect(cp.computeGesture(new THREE.Vector2(130, 200))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("right");

    expect(cp.computeGesture(new THREE.Vector2(-130, 200))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("left");

    expect(cp.computeGesture(new THREE.Vector2(100, -230))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("up");

    expect(cp.computeGesture(new THREE.Vector2(100, 230))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("down");
  });
});