import '@testing-library/jest-dom';
import RubikCube from "./RubikCube.tsx";
import * as THREE from "three";
import {vi} from "vitest";

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

      const mock_getCubeMesh = vi.fn().mockReturnValue({
        position: new THREE.Vector3(),
        rotateOnAxis: vi.fn()
      });

      const mock_texture = vi.fn();

      // Actual test
      const rc = new RubikCube(3);
      rc.getCubeMesh = mock_getCubeMesh;
      rc.getNewGroup = vi.fn().mockImplementation(() => ({
        add: vi.fn(),
        rotateOnAxis: vi.fn()
      }));
      if (existentGroup) {
        rc.group = vi.fn();
      }
      rc.spawnFullCube(mock_Three_Scene, mock_texture, mock_Three_Cube);

      if (existentGroup) {
        expect(mock_Three_Scene_Remove).toHaveBeenCalledTimes(1);
      }

      expect(mock_Three_Scene_Add).toHaveBeenCalledTimes(1);
      expect(mock_getCubeMesh).toHaveBeenCalledTimes(54);
    });
  });

  it('game size change', () => {
    // Mocks
    const mock_spawnFullCube = vi.fn();

    const mock_Three_Scene = vi.fn();
    const mock_Three_Cube = vi.fn();
    const mock_Three_Texture = vi.fn();

    // First test
    const rc = new RubikCube(3);
    rc.spawnFullCube = mock_spawnFullCube;

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
      rotation: new THREE.Euler(1, 2, 3, "XYZ")
    };

    // First test
    expect(group.rotation.x).toBe(1);
    expect(group.rotation.y).toBe(2);
    expect(group.rotation.z).toBe(3);

    // Second test
    const rc = new RubikCube(3);
    rc.getCubeMesh = mock_getCubeMesh;
    rc.advanceFrame(1);
    rc.dragState.autoRotate = true;

    expect(group.rotation.x.toFixed(2)).toBe("1.00");
    expect(group.rotation.y.toFixed(2)).toBe("2.00");
    expect(group.rotation.z.toFixed(2)).toBe("3.00");

    // Second test
    rc.group = group;
    rc.advanceFrame(5);

    expect(group.rotation.x.toFixed(2)).toBe("0.03");
    expect(group.rotation.y.toFixed(2)).toBe("0.03");
    expect(group.rotation.z.toFixed(2).replace("-0.00", "0.00")).toBe("0.00");
  });
});