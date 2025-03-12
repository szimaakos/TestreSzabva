import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import { useUser, Felhasznalo } from '../context/UserContext'
 
const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, error: userError, updateUserData, refreshUserData } = useUser();
  const [formData, setFormData] = useState<Felhasznalo | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    let newValue: any = value;
    if (["weight", "height", "age", "goalWeight", "calorieGoal"].includes(name)) {
      newValue = value === "" ? undefined : Number(value);
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    setError("");
    setSuccessMessage("");
    try {
      const success = await updateUserData(formData);
      if (success) {
        // Frissítsük a felhasználói adatokat a sikeres mentés után
        await refreshUserData();
        setSuccessMessage("Adatok sikeresen frissítve!");
        // Időzítő, hogy az üzenet 3 másodperc után eltűnjön
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(userError || "Hiba történt a felhasználói adatok frissítésekor.");
      }
    } catch (err) {
      console.error("Update user error:", err);
      setError("Hiba történt a felhasználói adatok frissítésekor.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (userLoading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 onClick={() => navigate("/")} className="logo animated-logo">
            TestreSzabva
          </h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>Áttekintés</button>
          <button onClick={() => navigate("/progress")}>Haladás</button>
          <button onClick={() => navigate("/receptek")}>Receptek</button>
          <button onClick={() => navigate("/settings")}>Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </div>
      </aside>

      <div className="dashboard-content">
        <div className="settings-container">
          <div className="settings-card">
            <h1>Profil beállítások</h1>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            {formData && (
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="userName">Felhasználónév:</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Súly (kg):</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight !== undefined ? formData.weight : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="height">Magasság (cm):</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height !== undefined ? formData.height : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Kor:</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age !== undefined ? formData.age : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Nem:</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                  >
                    <option value="">Válassz</option>
                    <option value="férfi">Férfi</option>
                    <option value="nő">Nő</option>
                    <option value="egyéb">Egyéb</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="activityLevel">Aktivitás szint:</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel || ""}
                    onChange={handleChange}
                  >
                    <option value="">Válassz</option>
                    <option value="sedentary">Sedentary (Alacsony)</option>
                    <option value="light">Light (Mérsékelt)</option>
                    <option value="moderate">Moderate (Magas)</option>
                    <option value="veryactive">Very Active (Nagyon aktív)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="goalWeight">Cél testsúly (kg):</label>
                  <input
                    type="number"
                    id="goalWeight"
                    name="goalWeight"
                    value={formData.goalWeight !== undefined ? formData.goalWeight : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="goalDate">Céldátum:</label>
                  <input
                    type="date"
                    id="goalDate"
                    name="goalDate"
                    value={formData.goalDate ? formData.goalDate.split("T")[0] : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="calorieGoal">Kalória cél:</label>
                  <input
                    type="number"
                    id="calorieGoal"
                    name="calorieGoal"
                    value={formData.calorieGoal !== undefined ? formData.calorieGoal : ""}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" disabled={saving}>
                  {saving ? "Mentés..." : "Mentés"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;