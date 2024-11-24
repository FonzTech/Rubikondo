import '@testing-library/jest-dom';
import CubePreview from "./CubePreview.tsx";

describe('cube preview logic', () => {
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
});