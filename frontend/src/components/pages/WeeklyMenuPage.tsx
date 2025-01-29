import React from "react";
import { useNavigate } from "react-router-dom";

type WeeklyMenuPageProps = {
  isLoggedIn: boolean;
};

const WeeklyMenuPage: React.FC<WeeklyMenuPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Menü összeállítása</h1>
      <p>Itt majd a Heti_Etrend tábla alapján állítjuk össze a menüt...</p>
      <button onClick={() => navigate("/")}>Vissza a főoldalra</button>
    </div>
  );
};

export default WeeklyMenuPage;
