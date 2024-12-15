import { useState } from "react";

export const useDebugOverlay = () => {
  const [debugData, setDebugData] = useState<Map<string, string>>(new Map<string, string>());

  return { debugData, setDebugData };
};
