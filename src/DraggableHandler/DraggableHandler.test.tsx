import '@testing-library/jest-dom';
import DraggableHandler from "./DraggableHandler.tsx";
import * as React from "react";
import { vi, describe, it, expect } from 'vitest';

describe('draggable handler', () => {
  it('test events allowed', () => {
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

      onMovementEnd(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean {
        mock_onMovementEnd();
        return true;
      }
    })();

    draggableHandler.onMouseDown({ button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 1, clientY: 2 } as React.MouseEvent<HTMLElement>);
    draggableHandler.onMovementMove({ button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 3, clientY: 4 } as React.MouseEvent<Document>);
    draggableHandler.onMovementEnd({ button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 5, clientY: 6 } as React.MouseEvent<Document>);

    expect(mock_onMovementStart).toHaveBeenCalledTimes(1);
    expect(mock_onMovementMove).toHaveBeenCalledTimes(1);
    expect(mock_onMovementEnd).toHaveBeenCalledTimes(1);

    draggableHandler.onTouchStart({ touches: [ { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 1, clientY: 2 } ] } as React.TouchEvent<HTMLElement>);
    draggableHandler.onTouchMove({ touches: [ { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 3, clientY: 4 } ] } as React.TouchEvent<Document>);
    draggableHandler.onTouchEnd({ touches: [ { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 5, clientY: 6 } ] } as React.TouchEvent<Document>);

    expect(mock_onMovementStart).toHaveBeenCalledTimes(2);
    expect(mock_onMovementMove).toHaveBeenCalledTimes(2);
    expect(mock_onMovementEnd).toHaveBeenCalledTimes(2);
  });

  it('test events not allowed', () => {
    // Actual test
    const draggableHandler: DraggableHandler = new (class extends DraggableHandler {
      onMovementStart(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean {
        return false;
      }

      onMovementMove(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean {
        return false;
      }

      onMovementEnd(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean {
        return false;
      }
    })();

    draggableHandler.onMouseDown({ button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 1, clientY: 2 } as React.MouseEvent<HTMLElement>);
    draggableHandler.onMovementMove({ button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 3, clientY: 4 } as React.MouseEvent<Document>);
    draggableHandler.onMovementEnd({ button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 5, clientY: 6 } as React.MouseEvent<Document>);

    draggableHandler.onMouseDown({ button: DraggableHandler.MOUSE_BUTTON_RIGHT, clientX: 1, clientY: 2 } as React.MouseEvent<HTMLElement>);
    draggableHandler.onMovementMove({ button: DraggableHandler.MOUSE_BUTTON_RIGHT, clientX: 3, clientY: 4 } as React.MouseEvent<Document>);
    draggableHandler.onMovementEnd({ button: DraggableHandler.MOUSE_BUTTON_RIGHT, clientX: 5, clientY: 6 } as React.MouseEvent<Document>);

    draggableHandler.onTouchStart({ touches: [ { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 1, clientY: 2 } ] } as React.TouchEvent<HTMLElement>);
    draggableHandler.onTouchMove({ touches: [ { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 3, clientY: 4 } ] } as React.TouchEvent<Document>);
    draggableHandler.onTouchEnd({ touches: [ { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 5, clientY: 6 } ] } as React.TouchEvent<Document>);
  });
});