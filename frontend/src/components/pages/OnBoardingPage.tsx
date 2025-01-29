import React from "react";
import { useNavigate } from "react-router-dom";

type OnboardingPageProps = {
  isLoggedIn: boolean;
};

const OnboardingPage: React.FC<OnboardingPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  // Példa: ha valaki közvetlen ide jön bejelentkezés nélkül, 
  // megtehetjük, hogy visszanavigáljuk a főoldalra, 
  // vagy hagyjuk, hogy a Home onClick-nél legyen a check.
  // Itt most feltételezzük, hogy a Home-ben már kezeljük a belépést.

  return (
    <div style={{ padding: "20px" }}>
      <h1>Kérdőív kitöltése</h1>
      <p>Itt lesz majd a lépések sorozata a felhasználónak...</p>
      <button onClick={() => navigate("/")}>Vissza a főoldalra</button>
    </div>
  );
};

export default OnboardingPage;
