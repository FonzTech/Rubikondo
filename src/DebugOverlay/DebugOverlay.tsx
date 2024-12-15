import * as React from 'react'
import {useDebugOverlay} from "./useDebugOverlay.tsx";

interface DebugOverlayInterface {
  childComponent: React.ReactNode
}

const DebugOverlay: React.FC<DebugOverlayInterface> = ({
  childComponent = null
}) => {
  const {
    debugData
  } = useDebugOverlay();

  return (
    <div className="debug-overlay" data-testid={"debug-overlay"}>
      <div
        className={"position-absolute left-0 top-0 z3 pt-1 ps-2"}>
        <div className={"fw-bold"}>DEBUG LOGS</div>
        <div className={"debug-data"}>
          {debugData.size > 0 ? (
            Array.from(debugData.entries()).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {value}
              </li>
            ))
          ) : (
            <p>This map is empty</p>
          )}
        </div>
      </div>
      {childComponent}
    </div>
  );
};

export default DebugOverlay;