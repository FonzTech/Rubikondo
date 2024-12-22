import {render, screen, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePage from "./GamePage.tsx";

describe('renders game page', () => {
  it('game size correct', () => {
    render(<GamePage gameSize={5}/>);

    const page = screen.getByTestId("game-page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-game-size", "5");

    const game = within(page).getByTestId("canvas-game");
    expect(game).toBeInTheDocument();
  });

  it('game size incorrect', () => {
    expect(() => render(<GamePage gameSize={-2}/>)).toThrow();
    expect(() => render(<GamePage gameSize={-1}/>)).toThrow();
    expect(() => render(<GamePage gameSize={0}/>)).toThrow();
    expect(() => render(<GamePage gameSize={1}/>)).toThrow();

    expect(() => render(<GamePage gameSize={9}/>)).toThrow();
    expect(() => render(<GamePage gameSize={10}/>)).toThrow();
    expect(() => render(<GamePage gameSize={11}/>)).toThrow();
  });
});