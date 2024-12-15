import './App.css'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "../HomePage/HomePage.tsx";
import PageNotFound from "../PageNotFound/PageNotFound.tsx";
import GamePage from "../GamePage/GamePage.tsx";
import Utils from "../Utils/Utils.tsx";

function App() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  let size: number;
  try {
    const value = urlSearchParams.get("size");
    if (value != null) {
      size = parseInt(value);
    } else {
      size = 3;
    }
  } catch (err) {
    console.error(`Could not parse game size. Defaulting to ${Utils.DEFAULT_GAME_SIZE}`, err);
    size = Utils.DEFAULT_GAME_SIZE;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage gameSize={size} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;