import './App.css'
import { Routes, Route, } from "react-router-dom";
import HomePage from "./HomePage/HomePage.tsx";
import PageNotFound from "./PageNotFound/PageNotFound.tsx";

function App() {
  return (
    <Routes>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App;