import {fireEvent, render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {DebugOverlayProvider, useDebugOverlay} from "./DebugOverlay.tsx";
import React, {act} from "react";
import {describe, expect, it} from "vitest";

const DebugOverlayTestComponent: React.FC = () => {
  const debugApi = useDebugOverlay();
  return (
    <button
      onClick={() => {
        const debugMap = new Map<string, string>();
        debugMap.set("test", "data");
        debugApi.setDebugMap(debugMap);
      }}
      type={"button"}
      data-testid={"debug-button"}>
      Hello
    </button>
  );
};

describe('Debug Overlay component', () => {
  it('renders the debug overlay component', async () => {
    const renderResult = render(<DebugOverlayProvider>
      <DebugOverlayTestComponent/>
    </DebugOverlayProvider>);

    const debugOverlay = renderResult.getByTestId("debug-overlay");
    expect(debugOverlay).toBeInTheDocument();

    const debugButton = renderResult.getByTestId("debug-button");
    expect(debugButton).toBeInTheDocument();

    await act(() => fireEvent.click(debugButton));

    await waitFor(async () => {
      const debugItem = await renderResult.findByTestId("debug-item-test");
      expect(debugItem).toBeInTheDocument();
    }, { timeout: 500, interval: 50 });
  });

  it('cannot work outside provider', async () => {
    expect(() => render(<DebugOverlayTestComponent/>)).toThrow("useDebugOverlay must be used within a DebugOverlayProvider");
  });
});