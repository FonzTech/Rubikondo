import {fireEvent, render} from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "./HomePage.tsx";
import {mock_CanvasBase_getRubikCubeImpl} from "../../vitest.setup.ts";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";
import DraggableHandler from "../DraggableHandler/DraggableHandler.tsx";
import { vi, test, expect } from 'vitest';

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

test('renders home page', () => {
  const renderResult = render(<HomePage />);

  const homePage = renderResult.getByTestId("home-page");
  expect(homePage).toBeInTheDocument();

  const knob = renderResult.getByTestId("knob");
  expect(knob).toBeInTheDocument();

  const canvasPreview = renderResult.getByTestId("canvas-game");
  expect(canvasPreview).toBeInTheDocument();

  // Rotate knob clockwise from right side
  const mockBoundingBox = {
    x: 80,
    y: 90,
    width: 100,
    height: 110,
  };  // xm = 130 - ym = 145
  knob.getBoundingClientRect = vi.fn(() => mockBoundingBox as DOMRect);
  expect(knob.getBoundingClientRect().x).toBe(80);
  expect(knob.getBoundingClientRect().y).toBe(90);
  expect(knob.getBoundingClientRect().width).toBe(100);
  expect(knob.getBoundingClientRect().height).toBe(110);

  fireEvent.mouseDown(knob, { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 160, clientY: 140 });
  fireEvent.mouseMove(document, { button: DraggableHandler.MOUSE_BUTTON_LEFT, clientX: 170, clientY: 80 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(135.00deg)");

  expect(homePage.getAttribute("data-game-size")).toBe("2");
});