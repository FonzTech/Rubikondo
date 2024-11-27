import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Knob from "./Knob.tsx";

test('renders knob with min height 300px', () => {
  render(<Knob minHeight="300px" />);

  const knob = screen.getByTestId("knob");
  expect(knob).toBeInTheDocument();
  expect(knob).toHaveStyle("minHeight: 300px");
});

test('renders and check for rotation via mouse movement', () => {
  const mock_rotateCallback = vi.fn();

  render(<Knob
    minHeight="300px"
    startingRotation={135}
    rotateCallback={mock_rotateCallback}
  />);

  const knob = screen.getByTestId("knob");
  expect(knob).toBeInTheDocument();
  expect(knob).toHaveStyle("transform: rotate(135.00deg)");

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

  // Test on document, but not on component
  fireEvent.mouseMove(document, { clientX: 156, clientY: 139 });
  fireEvent.mouseMove(document, { clientX: 139, clientY: 156 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(135.00deg)");

  // Rotate clockwise from right side
  fireEvent.mouseDown(knob, { clientX: 160, clientY: 140 });
  fireEvent.mouseMove(document, { clientX: 170, clientY: 150 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(151.59deg)");

  // Rotate clockwise from left side
  fireEvent.mouseDown(knob, { clientX: 120, clientY: 110 });
  fireEvent.mouseMove(document, { clientX: 119, clientY: 100 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(153.80deg)");

  // Rotate anti-clockwise from right side
  fireEvent.mouseDown(knob, { clientX: 155, clientY: 140 });
  fireEvent.mouseMove(document, { clientX: 156, clientY: 139 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(152.11deg)");

  // Rotate anti-clockwise from left side
  fireEvent.mouseDown(knob, { clientX: 110, clientY: 100 });
  fireEvent.mouseMove(document, { clientX: 105, clientY: 110 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(140.54deg)");

  // Test left boundary
  fireEvent.mouseDown(knob, { clientX: 110, clientY: 100 });
  fireEvent.mouseMove(document, { clientX: 105, clientY: 110 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(135.00deg)");

  // Test right boundary
  fireEvent.mouseDown(knob, { clientX: 120, clientY: 150 });
  fireEvent.mouseMove(document, { clientX: 131, clientY: 150 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(45.00deg)");

  // Test on document, but not on component
  fireEvent.mouseMove(document, { clientX: 156, clientY: 139 });
  fireEvent.mouseMove(document, { clientX: 139, clientY: 156 });
  fireEvent.mouseUp(document);
  expect(knob).toHaveStyle("transform: rotate(45.00deg)");

  // Expect rotate callback to be called
  expect(mock_rotateCallback).toHaveBeenCalledTimes(6);
});