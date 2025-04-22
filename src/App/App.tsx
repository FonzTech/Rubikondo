import './App.css'
import {Routes, Route, BrowserRouter, HashRouter} from "react-router-dom";
import HomePage from "../HomePage/HomePage.tsx";
import PageNotFound from "../PageNotFound/PageNotFound.tsx";
import GamePage from "../GamePage/GamePage.tsx";
import Utils from "../Utils/Utils.tsx";
import {DebugOverlayProvider} from "../DebugOverlay/DebugOverlay.tsx";
import Utils_Hotfix from "../Utils/Utils_Hotfix.ts";

const getQueryString = (hash: string, search: string) => {
  const v = hash.split("?");
  if (v.length > 1) {
    return v[1];
  }
  return search;
};

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

  const rawParams = getQueryString(window.location.hash, window.location.search);
  const queryString = getUrlSearchParams(rawParams);
  const gameSize = getGameSize(queryString);

  Utils_Hotfix.GAME_SIZE = gameSize;

  const RouterComponent = Utils.HASH_ROUTER ? HashRouter : BrowserRouter;

  return (
    <DebugOverlayProvider>
      <RouterComponent>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={
            <GamePage
              gameSize={gameSize}
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
  getQueryString,
  getUrlSearchParams,
  getGameSize,
};