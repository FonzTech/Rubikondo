import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "./HomePage.tsx";

test('renders home page', () => {
  render(<HomePage />);

  const homePage = screen.getByTestId("home-page");
  expect(homePage).toBeInTheDocument();

  const knob = screen.getByTestId("knob");
  expect(knob).toBeInTheDocument();

  const canvasPreview = screen.getByTestId("canvas-preview");
  expect(canvasPreview).toBeInTheDocument();
});