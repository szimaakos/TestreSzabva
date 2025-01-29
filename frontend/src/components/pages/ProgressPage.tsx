import React from "react";
import { useNavigate } from "react-router-dom";

type ProgressPageProps = {
  isLoggedIn: boolean;
};

const ProgressPage: React.FC<ProgressPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Haladás követése</h1>
      <p>Itt lehet majd mérni a súlyt, kalóriákat, BMI-t stb.</p>
      <button onClick={() => navigate("/")}>Vissza a főoldalra</button>
    </div>
  );
};

export default ProgressPage;
