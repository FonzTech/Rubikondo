import './App.css'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "../HomePage/HomePage.tsx";
import PageNotFound from "../PageNotFound/PageNotFound.tsx";
import GamePage from "../GamePage/GamePage.tsx";
import Utils from "../Utils/Utils.tsx";
import {DebugOverlayProvider} from "../DebugOverlay/DebugOverlay.tsx";

const getGameSize = (input: string) => {
  if (!input) {
    return Utils.DEFAULT_GAME_SIZE;
  }
  const urlSearchParams = new URLSearchParams(input);
  const value = urlSearchParams.get("size");
  return parseInt(value ?? "") || Utils.DEFAULT_GAME_SIZE;
};

function App() {
  const size = getGameSize(window.location.search);
  // TODO startNewGame -> true
  return (
    <DebugOverlayProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage gameSize={size} startNewGame={false} />} />
        </Routes>
      </BrowserRouter>
    </DebugOverlayProvider>
  )
}

export default App;

// -- ONLY FOR TEST --

export const __TEST__ = {
  getGameSize,
};