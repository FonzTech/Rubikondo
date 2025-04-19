import './App.css'
import {Routes, Route, BrowserRouter, HashRouter} from "react-router-dom";
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
  console.log("IS_DEBUG is", Utils.IS_DEBUG);
  console.log("VITE_APP_DEBUG is", import.meta.env.VITE_APP_DEBUG);
  console.log("VITE_APP_FIXED_CUBE is", import.meta.env.VITE_APP_FIXED_CUBE);
  const queryString = getUrlSearchParams(window.location.search);
  const size = getGameSize(queryString);

  const RouterComponent = Utils.HASH_ROUTER ? HashRouter : BrowserRouter;

  return (
    <DebugOverlayProvider>
      <RouterComponent>
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
      </RouterComponent>
    </DebugOverlayProvider>
  )
}

export default App;

// -- ONLY FOR TEST --

export const __TEST__ = {
  getUrlSearchParams,
  getGameSize,
};