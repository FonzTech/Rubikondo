import {render, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePage from "./GamePage.tsx";

describe('renders game page', () => {
  it('game size correct', () => {
    const renderResult = render(<GamePage gameSize={5} startNewGame={true} />);

    const page = renderResult.getByTestId("game-page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-game-size", "5");

    const game = within(page).getByTestId("canvas-game");
    expect(game).toBeInTheDocument();
  });

  it('game size incorrect', () => {
    expect(() => render(<GamePage gameSize={-2} startNewGame={false}/>)).toThrow();
    expect(() => render(<GamePage gameSize={-1} startNewGame={false}/>)).toThrow();
    expect(() => render(<GamePage gameSize={0} startNewGame={false}/>)).toThrow();
    expect(() => render(<GamePage gameSize={1} startNewGame={false}/>)).toThrow();

    expect(() => render(<GamePage gameSize={9} startNewGame={false}/>)).toThrow();
    expect(() => render(<GamePage gameSize={10} startNewGame={false}/>)).toThrow();
    expect(() => render(<GamePage gameSize={11} startNewGame={false}/>)).toThrow();
  });

  it('modal tutorial present', () => {
    const renderResult = render(<GamePage gameSize={5} startNewGame={true} />);

    const modalTutorial = renderResult.getByTestId("modal-tutorial");
    expect(modalTutorial).toBeInTheDocument();
  });

  it('modal tutorial absent', () => {
    const renderResult = render(<GamePage gameSize={5} startNewGame={false} />);

    const modalTutorial = renderResult.queryByTestId("modal-tutorial");
    expect(modalTutorial).not.toBeInTheDocument();
  });
});