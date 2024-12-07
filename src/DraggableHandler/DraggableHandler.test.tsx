import '@testing-library/jest-dom';
import {vi} from "vitest";
import DraggableHandler from "./DraggableHandler.tsx";
import * as React from "react";

describe('draggable handler', () => {
  it('test events', () => {
    // Mocks
    const mock_onMovementStart = vi.fn();
    const mock_onMovementMove = vi.fn();
    const mock_onMovementEnd = vi.fn();

    // Actual test
    const draggableHandler: DraggableHandler = new (class extends DraggableHandler {
      onMovementStart(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean {
        mock_onMovementStart();
        return true;
      }

      onMovementMove(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean {
        mock_onMovementMove();
        return true;
      }

      onMovementEnd(event: React.UIEvent<Document>): boolean {
        mock_onMovementEnd();
        return true;
      }
    })();

    draggableHandler.onMouseDown({ clientX: 1, clientY: 2 } as React.MouseEvent<HTMLElement>);
    draggableHandler.onMovementMove({ clientX: 3, clientY: 4 } as React.MouseEvent<Document>);
    draggableHandler.onMovementEnd({ clientX: 5, clientY: 6 } as React.MouseEvent<Document>);

    expect(mock_onMovementStart).toHaveBeenCalledTimes(1);
    expect(mock_onMovementMove).toHaveBeenCalledTimes(1);
    expect(mock_onMovementEnd).toHaveBeenCalledTimes(1);

    draggableHandler.onTouchStart({ touches: [ { clientX: 1, clientY: 2 } ] } as React.TouchEvent<HTMLElement>);
    draggableHandler.onTouchMove({ touches: [ { clientX: 3, clientY: 4 } ] } as React.TouchEvent<Document>);
    draggableHandler.onTouchEnd({ touches: [ { clientX: 5, clientY: 6 } ] } as React.TouchEvent<Document>);

    expect(mock_onMovementStart).toHaveBeenCalledTimes(2);
    expect(mock_onMovementMove).toHaveBeenCalledTimes(2);
    expect(mock_onMovementEnd).toHaveBeenCalledTimes(2);
  });
});