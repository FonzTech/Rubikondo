import DebugOverlay from "./DebugOverlay.tsx";
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Debug Overlay component', () => {
  it('renders the debug overlay component', () => {
    const renderResult = render(<DebugOverlay
      childComponent={<span data-testid={"debug-hello"}>Hello</span>}
    />);

    const debugOverlay = renderResult.getByTestId("debug-overlay");
    expect(debugOverlay).toBeInTheDocument();

    const debugHello = renderResult.getByTestId("debug-hello");
    expect(debugHello).toBeInTheDocument();
  });
});