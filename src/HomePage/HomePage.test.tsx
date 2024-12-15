import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "./HomePage.tsx";
import {mock_CanvasBase_getRubikCubeImpl} from "../../vitest.setup.ts";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

test('renders home page', () => {
  render(<HomePage />);

  const homePage = screen.getByTestId("home-page");
  expect(homePage).toBeInTheDocument();

  const knob = screen.getByTestId("knob");
  expect(knob).toBeInTheDocument();

  const canvasPreview = screen.getByTestId("canvas-game");
  expect(canvasPreview).toBeInTheDocument();
});