import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import OnboardingPage from "./components/pages/OnBoardingPage";
import WeeklyMenuPage from "./components/pages/WeeklyMenuPage";
import ProgressPage from "./components/pages/ProgressPage";
import ReceptekPage from "./components/pages/ReceptekPage";

function App() {
  // Egyszerű példa egy globális bejelentkezett állapotra
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route path="/onboarding" element={<OnboardingPage isLoggedIn={isLoggedIn} />} />
      <Route path="/weekly-menu" element={<WeeklyMenuPage isLoggedIn={isLoggedIn} />} />
      <Route path="/progress" element={<ProgressPage isLoggedIn={isLoggedIn} />} />
      <Route path="/receptek" element={<ReceptekPage />} />

      {/* Esetleg 404-es oldal, ha nem talált: */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
