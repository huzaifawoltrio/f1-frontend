import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import IntroPage from "./pages/IntroPage";
import LandingPage from "./pages/LandingPage";
import ReadyGo from "./pages/ReadyGo";
import GamePage from "./pages/GamePage";
import FinalScore from "./pages/FinalScore";
import Globe from "./components/globe";
import CarPage from "./pages/CarPage";

const App = () => {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/getReady" element={<ReadyGo />} />
          <Route path="/playgame" element={<GamePage />} />
          <Route path="/finalscore" element={<FinalScore />} />
          <Route path="/globe" element={<Globe />} />
          <Route path="/carpage" element={<CarPage />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
};

export default App;
