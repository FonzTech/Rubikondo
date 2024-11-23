import './App.css'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "../HomePage/HomePage.tsx";
import PageNotFound from "../PageNotFound/PageNotFound.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App;