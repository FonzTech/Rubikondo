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
import RubikInfo from "../Model/RubikInfo.tsx";
import {IsKeyPressedNullAction} from "../Hooks/useInputKeys.ts";

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

    const cp = new CubeGame(3, IsKeyPressedNullAction);
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
    const cp = new CubeGame(6, IsKeyPressedNullAction);
    cp.rubikCube.rubikInfos = new Map<string, RubikInfo>();
    cp.advanceFrame(1.5);
    expect(mock_RubikCube_advanceFrame).toHaveBeenCalledTimes(1);
  });

  it('asset loaded', () => {
    const cp = new CubeGame(6, IsKeyPressedNullAction);

    cp.assetLoaded();
    expect(mock_RubikCube_rotateInScreenSpace).toHaveBeenCalledTimes(1);
  });

  it('drag movement', () => {
    const cp = new CubeGame(6, IsKeyPressedNullAction);

    cp.onDragStart(new THREE.Vector2(100, 200));
    cp.onDragging(new THREE.Vector2(101, 202), new THREE.Vector2(1, 2));
    cp.onDragEnd(new THREE.Vector2(101, 202));
  });

  it('select cube row', () => {
    const cp = new CubeGame(6, IsKeyPressedNullAction);

    expect(cp.selectCubeRow(0, 1, 2)).toStrictEqual(new Set<string>([
      "Cube_0_0_2","Cube_0_1_2","Cube_0_2_2","Cube_0_3_2","Cube_0_4_2","Cube_0_5_2",
      "Cube_0_1_0","Cube_0_1_1","Cube_0_1_3","Cube_0_1_4","Cube_0_1_5","Cube_1_0_2",
      "Cube_1_1_2","Cube_1_2_2","Cube_1_3_2","Cube_1_4_2","Cube_1_5_2","Cube_2_0_2",
      "Cube_2_1_2","Cube_2_2_2","Cube_2_3_2","Cube_2_4_2","Cube_2_5_2","Cube_2_4_0",
      "Cube_2_4_1","Cube_2_4_3","Cube_2_4_4","Cube_2_4_5","Cube_3_0_2","Cube_3_1_2",
      "Cube_3_2_2","Cube_3_3_2","Cube_3_4_2","Cube_3_5_2","Cube_4_1_0","Cube_4_1_1",
      "Cube_4_1_2","Cube_4_1_3","Cube_4_1_4","Cube_4_1_5","Cube_5_1_0","Cube_5_1_1",
      "Cube_5_1_2","Cube_5_1_3","Cube_5_1_4","Cube_5_1_5",
    ]));

    expect(cp.selectCubeRow(1, 1, 2)).toStrictEqual(new Set<string>([
      "Cube_0_0_2","Cube_0_1_2","Cube_0_2_2","Cube_0_3_2","Cube_0_4_2","Cube_0_5_2",
      "Cube_1_0_2","Cube_1_1_2","Cube_1_2_2","Cube_1_3_2","Cube_1_4_2","Cube_1_5_2",
      "Cube_1_1_0","Cube_1_1_1","Cube_1_1_3","Cube_1_1_4","Cube_1_1_5","Cube_2_0_2",
      "Cube_2_1_2","Cube_2_2_2","Cube_2_3_2","Cube_2_4_2","Cube_2_5_2","Cube_3_0_2",
      "Cube_3_1_2","Cube_3_2_2","Cube_3_3_2","Cube_3_4_2","Cube_3_5_2","Cube_3_4_0",
      "Cube_3_4_1","Cube_3_4_3","Cube_3_4_4","Cube_3_4_5","Cube_4_0_4","Cube_4_1_4",
      "Cube_4_2_4","Cube_4_3_4","Cube_4_4_4","Cube_4_5_4","Cube_5_0_1","Cube_5_1_1",
      "Cube_5_2_1","Cube_5_3_1","Cube_5_4_1","Cube_5_5_1"
    ]));

    expect(cp.selectCubeRow(2, 1, 2)).toStrictEqual(new Set<string>([
      "Cube_0_0_2","Cube_0_1_2","Cube_0_2_2","Cube_0_3_2","Cube_0_4_2","Cube_0_5_2",
      "Cube_0_4_0","Cube_0_4_1","Cube_0_4_3","Cube_0_4_4","Cube_0_4_5","Cube_1_0_2",
      "Cube_1_1_2","Cube_1_2_2","Cube_1_3_2","Cube_1_4_2","Cube_1_5_2","Cube_2_0_2",
      "Cube_2_1_2","Cube_2_2_2","Cube_2_3_2","Cube_2_4_2","Cube_2_5_2","Cube_2_1_0",
      "Cube_2_1_1","Cube_2_1_3","Cube_2_1_4","Cube_2_1_5","Cube_3_0_2","Cube_3_1_2",
      "Cube_3_2_2","Cube_3_3_2","Cube_3_4_2","Cube_3_5_2","Cube_4_4_0","Cube_4_4_1",
      "Cube_4_4_2","Cube_4_4_3","Cube_4_4_4","Cube_4_4_5","Cube_5_4_0","Cube_5_4_1",
      "Cube_5_4_2","Cube_5_4_3","Cube_5_4_4","Cube_5_4_5"
    ]));

    expect(cp.selectCubeRow(3, 1, 2)).toStrictEqual(new Set<string>([
      "Cube_0_0_2","Cube_0_1_2","Cube_0_2_2","Cube_0_3_2","Cube_0_4_2","Cube_0_5_2",
      "Cube_1_0_2","Cube_1_1_2","Cube_1_2_2","Cube_1_3_2","Cube_1_4_2","Cube_1_5_2",
      "Cube_1_4_0","Cube_1_4_1","Cube_1_4_3","Cube_1_4_4","Cube_1_4_5","Cube_2_0_2",
      "Cube_2_1_2","Cube_2_2_2","Cube_2_3_2","Cube_2_4_2","Cube_2_5_2","Cube_3_0_2",
      "Cube_3_1_2","Cube_3_2_2","Cube_3_3_2","Cube_3_4_2","Cube_3_5_2","Cube_3_1_0",
      "Cube_3_1_1","Cube_3_1_3","Cube_3_1_4","Cube_3_1_5","Cube_4_0_1","Cube_4_1_1",
      "Cube_4_2_1","Cube_4_3_1","Cube_4_4_1","Cube_4_5_1","Cube_5_0_4","Cube_5_1_4",
      "Cube_5_2_4","Cube_5_3_4","Cube_5_4_4","Cube_5_5_4"
    ]));

    expect(cp.selectCubeRow(4, 1, 2)).toStrictEqual(new Set<string>([
      "Cube_0_1_0","Cube_0_1_1","Cube_0_1_2","Cube_0_1_3","Cube_0_1_4","Cube_0_1_5",
      "Cube_1_3_0","Cube_1_3_1","Cube_1_3_2","Cube_1_3_3","Cube_1_3_4","Cube_1_3_5",
      "Cube_2_4_0","Cube_2_4_1","Cube_2_4_2","Cube_2_4_3","Cube_2_4_4","Cube_2_4_5",
      "Cube_3_2_0","Cube_3_2_1","Cube_3_2_2","Cube_3_2_3","Cube_3_2_4","Cube_3_2_5",
      "Cube_4_1_0","Cube_4_1_1","Cube_4_1_2","Cube_4_1_3","Cube_4_1_4","Cube_4_1_5",
      "Cube_4_0_2","Cube_4_2_2","Cube_4_3_2","Cube_4_4_2","Cube_4_5_2","Cube_5_1_0",
      "Cube_5_1_1","Cube_5_1_2","Cube_5_1_3","Cube_5_1_4","Cube_5_1_5","Cube_5_0_3",
      "Cube_5_2_3","Cube_5_3_3","Cube_5_4_3","Cube_5_5_3"
    ]));

    expect(cp.selectCubeRow(5, 1, 2)).toStrictEqual(new Set<string>([
      "Cube_0_1_0","Cube_0_1_1","Cube_0_1_2","Cube_0_1_3","Cube_0_1_4","Cube_0_1_5",
      "Cube_1_2_0","Cube_1_2_1","Cube_1_2_2","Cube_1_2_3","Cube_1_2_4","Cube_1_2_5",
      "Cube_2_4_0","Cube_2_4_1","Cube_2_4_2","Cube_2_4_3","Cube_2_4_4","Cube_2_4_5",
      "Cube_3_3_0","Cube_3_3_1","Cube_3_3_2","Cube_3_3_3","Cube_3_3_4","Cube_3_3_5",
      "Cube_4_1_0","Cube_4_1_1","Cube_4_1_2","Cube_4_1_3","Cube_4_1_4","Cube_4_1_5",
      "Cube_4_0_3","Cube_4_2_3","Cube_4_3_3","Cube_4_4_3","Cube_4_5_3","Cube_5_1_0",
      "Cube_5_1_1","Cube_5_1_2","Cube_5_1_3","Cube_5_1_4","Cube_5_1_5","Cube_5_0_2",
      "Cube_5_2_2","Cube_5_3_2","Cube_5_4_2","Cube_5_5_2"
    ]));
  });

  it('gesture direction by angle', () => {
    const cp = new CubeGame(6, IsKeyPressedNullAction);

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
    const cp = new CubeGame(6, IsKeyPressedNullAction);

    expect(cp.computeGesture(new THREE.Vector2(1, 2))).toBe(false);
    expect(cp.selectingInfo.direction).toBe("up"); // default value

    cp.selectingInfo.start.set(100, 200);

    expect(cp.computeGesture(new THREE.Vector2(160, 200))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("right");

    expect(cp.computeGesture(new THREE.Vector2(-160, 200))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("left");

    expect(cp.computeGesture(new THREE.Vector2(100, -260))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("up");

    expect(cp.computeGesture(new THREE.Vector2(100, 260))).toBe(true);
    expect(cp.selectingInfo.direction).toBe("down");
  });
});