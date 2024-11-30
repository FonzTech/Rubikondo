import '@testing-library/jest-dom';
import RubikCube from "./RubikCube.tsx";
import * as THREE from "three";
import {vi} from "vitest";
import {
  mock_RubikCube_advanceFrame,
  mock_RubikCube_gameSizeChange,
  mock_RubikCube_spawnFullCube
} from "../../vitest.setup.ts";

describe('cube preview logic', () => {
  [ true, false ].forEach((existentGroup) => {
    it(`spawn full cube with ${existentGroup}`, () => {
      // Mocks
      const mock_Three_Scene_Add = vi.fn();
      const mock_Three_Scene_Remove = vi.fn();

      const mock_Three_Scene = {
        add: mock_Three_Scene_Add,
        remove: mock_Three_Scene_Remove
      };

      const mock_Three_Cube = vi.fn();

      const mock_getCubeMesh = vi.fn().mockReturnValue({ position: new THREE.Vector3() });

      const mock_texture = vi.fn();

      // Actual test
      const rc = new RubikCube(3);
      rc.getCubeMesh = mock_getCubeMesh;
      rc.getNewGroup = vi.fn().mockImplementation(() => ({
        add: vi.fn()
      }));
      if (existentGroup) {
        rc.group = vi.fn();
      }
      rc.spawnFullCube(mock_Three_Scene, mock_texture, mock_Three_Cube);

      if (existentGroup) {
        expect(mock_Three_Scene_Remove).toHaveBeenCalledTimes(1);
      }

      expect(mock_Three_Scene_Add).toHaveBeenCalledTimes(1);
      expect(mock_getCubeMesh).toHaveBeenCalledTimes(27);
    });
  });

  it('game size change', () => {
    // Mocks
    const mock_spawnFullCube = vi.fn();

    const mock_Three_Scene = vi.fn();
    const mock_Three_Cube = vi.fn();;
    const mock_Three_Texture = vi.fn();

    // First test
    const rc = new RubikCube(3);
    rc.spawnFullCube = mock_spawnFullCube;
    rc.getNewGroup = vi.fn();

    expect(rc.gameSize).toBe(3);

    rc.gameSizeChange(4, null, null, null);
    expect(rc.gameSize).toBe(4);
    expect(mock_spawnFullCube).toHaveBeenCalledTimes(0);

    // Second test
    rc.gameSizeChange(5, mock_Three_Scene, mock_Three_Cube, mock_Three_Texture);
    expect(rc.gameSize).toBe(5);
    expect(mock_spawnFullCube).toHaveBeenCalledTimes(1);
  });

  it('advance frame', () => {
    // Mocks
    const mock_getCubeMesh = vi.fn();

    const group = {
      rotation: new THREE.Vector3(1, 2, 3)
    };

    // First test
    expect(group.rotation.x).toBe(1);
    expect(group.rotation.y).toBe(2);
    expect(group.rotation.z).toBe(3);

    // Second test
    const rc = new RubikCube(3);
    rc.getCubeMesh = mock_getCubeMesh;
    rc.advanceFrame(1);

    expect(group.rotation.x).toBe(1);
    expect(group.rotation.y).toBe(2);
    expect(group.rotation.z).toBe(3);

    // Second test
    rc.group = group;
    rc.advanceFrame(1);

    expect(group.rotation.x).toBe(1.4);
    expect(group.rotation.y).toBe(2.4);
    expect(group.rotation.z).toBe(3);
  });
});