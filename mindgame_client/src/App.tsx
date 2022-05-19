import "./App.css";
import Game from "./Game";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
