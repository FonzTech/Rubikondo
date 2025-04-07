import * as React from 'react'
import {createContext, useContext, useEffect, useRef, useState} from "react";

type DebugOverlayAPI = {
  debugMap: Map<string, string>;
  setDebugMap: (input: Map<string, string>) => void;
}

const DebugOverlayContext = createContext<DebugOverlayAPI | undefined>(undefined);

export const DebugOverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [debugMap, setDebugMap] = useState<Map<string, string>>(new Map<string, string>());
  const debugMapRef = useRef<DebugOverlayAPI>({debugMap, setDebugMap});

  useEffect(() => {
    debugMapRef.current.debugMap = debugMap;
  }, [debugMap]);

  return (
    <DebugOverlayContext.Provider value={debugMapRef.current}>
      <div className="debug-overlay" data-testid={"debug-overlay"}>
        <div
          className={"position-absolute left-0 top-0 z3 pt-1 ps-2"}>
          <div className={"fw-bold"}>DEBUG LOGS</div>
          <div className={"debug-data"}>
            {debugMap.size > 0 ? (
              Array.from(debugMap.entries()).map(([key, value]) => (
                <li key={key} data-testid={`debug-item-${key}`}>
                  <strong>{key}</strong>: {value}
                </li>
              ))
            ) : (
              <p>This map is empty</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </DebugOverlayContext.Provider>
  );
};

export const useDebugOverlay = () => {
  const api = useContext(DebugOverlayContext);
  if (!api) {
    throw new Error('useDebugOverlay must be used within a DebugOverlayProvider');
  }
  return api;
};