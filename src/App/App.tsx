import './App.css'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "../HomePage/HomePage.tsx";
import PageNotFound from "../PageNotFound/PageNotFound.tsx";
import GamePage from "../GamePage/GamePage.tsx";
import Utils from "../Utils/Utils.tsx";
import {DebugOverlayProvider} from "../DebugOverlay/DebugOverlay.tsx";

const getUrlSearchParams = (input: string) => {
  return new URLSearchParams(input);
};

const getGameSize = (queryString: URLSearchParams) => {
  const value = queryString.get("size");
  return parseInt(value ?? "") || Utils.DEFAULT_GAME_SIZE;
};

function App() {
  const queryString = getUrlSearchParams(window.location.search);
  const size = getGameSize(queryString);
  return (
    <DebugOverlayProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={
            <GamePage
              gameSize={size}
              startNewGame={!queryString.has("no_welcome_screen")}
            />
          } />
        </Routes>
      </BrowserRouter>
    </DebugOverlayProvider>
  )
}

export default App;

// -- ONLY FOR TEST --

export const __TEST__ = {
  getUrlSearchParams,
  getGameSize,
};