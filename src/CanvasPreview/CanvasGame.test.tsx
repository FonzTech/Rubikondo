import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CanvasGame from "./CanvasGame.tsx";
import {CanvasFrameStepProps, CanvasInterface} from "../CanvasInterface/CanvasInterface.tsx";

class CanvasLogicTest implements CanvasInterface {
  frameStep(props: CanvasFrameStepProps): void {
    console.log("called loll", props !== null);
  };
}

test('renders canvas preview', () => {
  render(<CanvasGame
    addStyle={{}}
    canvasLogic={new CanvasLogicTest()}
  />);

  const homePage = screen.getByTestId("canvas-game");
  expect(homePage).toBeInTheDocument();
});