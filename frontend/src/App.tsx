import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OnboardingPage from "./pages/OnboardingPage";
import ProgressPage from "./pages/ProgressPage";
import ReceptekPage from "./pages/ReceptekPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/receptek" element={<ReceptekPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;