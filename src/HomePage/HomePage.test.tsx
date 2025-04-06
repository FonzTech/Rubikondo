import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "./HomePage.tsx";
import {mock_CanvasBase_getRubikCubeImpl} from "../../vitest.setup.ts";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

test('renders home page', () => {
  const renderResult = render(<HomePage />);

  const homePage = renderResult.getByTestId("home-page");
  expect(homePage).toBeInTheDocument();

  const knob = renderResult.getByTestId("knob");
  expect(knob).toBeInTheDocument();

  const canvasPreview = renderResult.getByTestId("canvas-game");
  expect(canvasPreview).toBeInTheDocument();
});