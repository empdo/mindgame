import "./App.css";
import Lobbies from "./Lobbies";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/game/:id" element={<Lobbies />} />
      </Routes>
    </div>
  );
}

export default App;
