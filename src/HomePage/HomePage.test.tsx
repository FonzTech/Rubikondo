import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "./HomePage.tsx";
import CubePreview from "../CubePreview/CubePreview.tsx";
import {mock_CanvasGame_getRubikCubeImpl} from "../../vitest.setup.ts";

CubePreview.getRubikCubeImpl = mock_CanvasGame_getRubikCubeImpl;

test('renders home page', () => {
  render(<HomePage />);

  const homePage = screen.getByTestId("home-page");
  expect(homePage).toBeInTheDocument();

  const knob = screen.getByTestId("knob");
  expect(knob).toBeInTheDocument();

  const canvasPreview = screen.getByTestId("canvas-game");
  expect(canvasPreview).toBeInTheDocument();
});