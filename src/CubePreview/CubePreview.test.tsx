import '@testing-library/jest-dom';
import CubePreview from "./CubePreview.tsx";
import {CanvasUseEffectProps} from "../CanvasInterface/CanvasInterface.tsx";
import {
  mock_CanvasGame_getRubikCubeImpl,
  mock_Global_requestAnimationFrame,
  mock_RubikCube_advanceFrame,
  mock_RubikCube_gameSizeChange,
  mock_RubikCube_spawnFullCube,
  mock_Three_Scene_add,
  mock_Three_WebGLRenderer_render
} from "../../vitest.setup.ts";
import * as THREE from "three";
import {vi} from "vitest";

CubePreview.getRubikCubeImpl = mock_CanvasGame_getRubikCubeImpl;

describe('cube preview logic', () => {
  it('game size camera distance', () => {
    const cp = new CubePreview();

    cp.gameSize = 0;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("0.40");

    cp.gameSize = 1;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("1.70");

    cp.gameSize = 2;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("3.00");

    cp.gameSize = 3;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("4.30");

    cp.gameSize = 4;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("5.60");

    cp.gameSize = 5;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("6.90");

    cp.gameSize = 6;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("8.20");

    cp.gameSize = 7;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("9.50");

    cp.gameSize = 8;
    expect(cp.getCameraDistanceForGameSize().toFixed(2)).toBe("10.80");
  });

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

  it('should not add mesh to scene', () => {
    const scene = vi.fn();

    const cp = new CubePreview();
    cp.props = {scene: scene} as CanvasUseEffectProps;

    cp.assetLoaded();

    expect(mock_Three_Scene_add).toHaveBeenCalledTimes(0);

    expect(cp.texture).toBeNull();
    expect(cp.cubeMesh).toBeNull();
  });

  it('should add mesh to scene', () => {
    const scene = new THREE.Scene();
    const texture = vi.fn();

    const cubeMeshTraverse = vi.fn();

    const cubeMesh = vi.fn();
    cubeMesh.traverse = cubeMeshTraverse;

    const cp = new CubePreview();
    cp.props = {scene: scene} as CanvasUseEffectProps;
    cp.cubeMesh = cubeMesh;
    cp.texture = texture;

    cp.assetLoaded();

    expect(cubeMeshTraverse).toHaveBeenCalledTimes(1);

    /*
    expect(mock_Three_Scene_add).toHaveBeenCalledWith(cubeMesh);
    expect(mock_Three_Scene_add).toHaveBeenCalledTimes(1);
     */
    expect(mock_RubikCube_spawnFullCube).toHaveBeenCalledTimes(1);

    expect(cp.texture).not.toBeNull();
    expect(cp.cubeMesh).not.toBeNull();
  });

  it('should not call asset loaded callback', () => {
    const scene = new THREE.Scene();

    const cubeMesh = vi.fn();

    const cp = new CubePreview();
    cp.props = {scene: scene} as CanvasUseEffectProps;

    cp.meshLoaded(cubeMesh);

    expect(cp.texture).toBeNull();
    expect(cp.cubeMesh).not.toBeNull();
    expect(mock_Three_Scene_add).toHaveBeenCalledTimes(0);

    expect(cp.texture).toBeNull();
    expect(cp.cubeMesh).not.toBeNull();
  });

  it('should call asset loaded callback', () => {
    const scene = new THREE.Scene();
    const texture = vi.fn();

    const cubeMeshTraverse = vi.fn();

    const cubeMesh = vi.fn();
    cubeMesh.traverse = cubeMeshTraverse;

    const cp = new CubePreview();
    cp.props = {scene: scene} as CanvasUseEffectProps;
    cp.cubeMesh = cubeMesh;

    cp.textureLoaded(texture);

    expect(cubeMeshTraverse).toHaveBeenCalledTimes(1);

    /*
    expect(mock_Three_Scene_add).toHaveBeenCalledWith(cubeMesh);
    expect(mock_Three_Scene_add).toHaveBeenCalledTimes(1);
     */
    expect(mock_RubikCube_spawnFullCube).toHaveBeenCalledTimes(1);

    expect(cp.texture).not.toBeNull();
    expect(cp.cubeMesh).not.toBeNull();
  });

  it('should advance frame', () => {
    const cubeMesh = vi.fn();
    cubeMesh.rotation = new THREE.Euler();

    const cp = new CubePreview();
    cp.cubeMesh = cubeMesh;

    expect(cp.cubeMesh!.rotation.x).toBe(0);
    expect(cp.cubeMesh!.rotation.y).toBe(0);

    cp.advanceFrame(1);

    /*
    expect(cp.cubeMesh!.rotation.x).toBe(0.4);
    expect(cp.cubeMesh!.rotation.y).toBe(0.4);
     */

    expect(mock_RubikCube_advanceFrame).toHaveBeenCalledTimes(1);
  });

  test('use effect step', () => {
    const mock_Clock_getDelta = vi.fn();

    const clock = vi.fn();
    clock.getDelta = mock_Clock_getDelta;

    const scene = vi.fn();
    scene.add = mock_Three_Scene_add;

    const camera = vi.fn();
    camera.position = new THREE.Vector3();

    const renderer = vi.fn();
    renderer.render = mock_Three_WebGLRenderer_render;

    const mock_advanceFrame = vi.fn();

    const cp = new CubePreview();
    cp.advanceFrame = mock_advanceFrame;
    cp.cubeMesh = vi.fn();

    expect(cp.props).toBeNull();

    cp.useEffectStep({
      clock: clock,
      scene: scene,
      camera: camera,
      renderer: renderer,
    } as CanvasUseEffectProps);

    expect(cp.props).not.toBeNull();
    expect(cp.props!.clock).not.toBeNull();
    expect(cp.props!.scene).not.toBeNull();
    expect(cp.props!.camera).not.toBeNull();
    expect(cp.props!.renderer).not.toBeNull();

    expect(mock_advanceFrame).toHaveBeenCalledTimes(1);

    expect(mock_Global_requestAnimationFrame).toHaveBeenCalledTimes(1);

    expect(mock_Clock_getDelta).toHaveBeenCalledTimes(1);

    expect(mock_Three_WebGLRenderer_render).toHaveBeenCalledWith(scene, camera);
    expect(mock_Three_WebGLRenderer_render).toHaveBeenCalledTimes(1);
  });

  test('game size change without camera', () => {
    const mock_getCameraDistanceForGameSize = vi.fn();

    const cp = new CubePreview();
    cp.getCameraDistanceForGameSize = mock_getCameraDistanceForGameSize;
    cp.gameSizeChange(3);

    expect(cp.gameSize).toBe(3);
    expect(mock_RubikCube_gameSizeChange).toHaveBeenCalledTimes(1);
    expect(mock_getCameraDistanceForGameSize).toHaveBeenCalledTimes(0);
  });

  test('game size change with camera', () => {
    const mock_getCameraDistanceForGameSize = vi.fn().mockReturnValue(10);

    const cp = new CubePreview();
    cp.getCameraDistanceForGameSize = mock_getCameraDistanceForGameSize;
    cp.props = {
      clock: vi.fn(),
      scene: vi.fn(),
      camera: new THREE.Camera(),
      render: vi.fn(),
      gameSize: 1
    };
    cp.gameSizeChange(3);

    expect(cp.gameSize).toBe(3);
    expect(cp.props!.camera.position.z).toBe(10);
    expect(mock_RubikCube_gameSizeChange).toHaveBeenCalledTimes(1);
    expect(mock_getCameraDistanceForGameSize).toHaveBeenCalledTimes(1);
  });
});