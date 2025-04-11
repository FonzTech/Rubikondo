import {describe, it, expect, vi} from "vitest";
import Utils from "./Utils.tsx";

describe('test some functions', () => {
  it('get components from cube key', () => {
    const v1 = Utils.getComponentsFromCubeKey("Cube_1_2_3");
    expect(v1.length).toBe(3);
    expect(v1[0]).toBe(1);
    expect(v1[1]).toBe(2);
    expect(v1[2]).toBe(3);

    const v2 = Utils.getComponentsFromCubeKey("Ciao_1_2");
    expect(v2.length).toBe(3);
    expect(isNaN(v2[0])).toBeTruthy();
    expect(v2[1]).toBe(1);
    expect(v2[2]).toBe(2);

    const v3 = Utils.getComponentsFromCubeKey("");
    expect(v3.length).toBe(1);

    const v4 = Utils.getComponentsFromCubeKey("Hello");
    expect(v4.length).toBe(1);
    expect(isNaN(v4[0])).toBeTruthy();
  });
});