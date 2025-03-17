import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import { useUser, Felhasznalo } from "../context/UserContext";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    updateUserData,
    refreshUserData,
  } = useUser();
  const [formData, setFormData] = useState<Felhasznalo | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    let newValue: any = value;
    if (["weight", "height", "age", "goalWeight", "calorieGoal"].includes(name)) {
      newValue = value === "" ? undefined : Number(value);
    }
    setFormData({ ...formData, [name]: newValue });

    // Ha a súlyt változtatják, frissítjük a progressRecords-t (mai napra)
    if (name === "weight") {
      const todayIso = new Date().toISOString().split("T")[0];
      const weightValue = newValue;
      if (!isNaN(weightValue)) {
        const storedRecordsJson = localStorage.getItem("progressRecords");
        let storedRecords = storedRecordsJson ? JSON.parse(storedRecordsJson) : [];
        const existingIndex = storedRecords.findIndex((r: any) =>
          new Date(r.date).toISOString().split("T")[0] === todayIso
        );
        const newRecord = {
          date: todayIso + "T00:00:00Z",
          weight: weightValue,
        };
        if (existingIndex !== -1) {
          storedRecords[existingIndex] = newRecord;
        } else {
          storedRecords.push(newRecord);
        }
        localStorage.setItem("progressRecords", JSON.stringify(storedRecords));
      }
    }
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
        await refreshUserData();
        setSuccessMessage("A beállítások sikeresen mentve!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("Hiba történt a beállítások mentése során.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Váratlan hiba történt a beállítások mentése során.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Responsive sidebar: követjük az ablakméretet, és állapot alapján megjelenítjük a sidebart
  const [menuOpen, setMenuOpen] = useState<boolean>(window.innerWidth > 768);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Kezdeti állapot beállítása
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleOverlayClick = () => {
    setMenuOpen(false);
  };

  if (userLoading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Hamburger menü mobil nézetben */}
      <div
        className={`hamburger-menu ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Overlay a mobil sidebar mögött */}
      <div
        className={`sidebar-overlay ${
          menuOpen && windowWidth <= 768 ? "active" : ""
        }`}
        onClick={handleOverlayClick}
      ></div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${menuOpen ? "open" : "closed"}`}>
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

      {/* Fő tartalom */}
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
