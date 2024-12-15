import DebugOverlay from "./DebugOverlay.tsx";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Debug Overlay component', () => {
  it('renders the debug overlay component', () => {
    render(<DebugOverlay
      childComponent={<span data-testid={"debug-hello"}>Hello</span>}
    />);

    const debugOverlay = screen.getByTestId("debug-overlay");
    expect(debugOverlay).toBeInTheDocument();

    const debugHello = screen.getByTestId("debug-hello");
    expect(debugHello).toBeInTheDocument();
  });
});