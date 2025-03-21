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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Minimális és maximális értékek (az OnboardingPage alapján)
  const MIN_WEIGHT = 30;
  const MAX_WEIGHT = 300;
  const MIN_HEIGHT = 100;
  const MAX_HEIGHT = 250;
  const MIN_AGE = 13;
  const MAX_AGE = 110;
  const MIN_GOAL_WEIGHT = 30;
  const MAX_GOAL_WEIGHT = 300;

  // Mai dátum és maximális céldátum (maximum 5 év a jövőben)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  // Validációs függvények
  const validateEmail = (email: string): string => {
    if (!email) return "Az email cím megadása kötelező";
    
    // Email formátum ellenőrzése
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Érvénytelen email formátum";
    }
    
    // Email tartomány ellenőrzése
    const domain = email.split('@')[1];
    if (!domain) return "Érvénytelen email cím";
    
    return "";
  };

  const validateUserName = (userName: string): string => {
    if (!userName) return "A felhasználónév megadása kötelező";
    if (userName.length < 3) return "A felhasználónév legalább 3 karakter hosszú legyen";
    if (userName.length > 30) return "A felhasználónév maximum 30 karakter lehet";
    
    // Csak betű, szám és néhány speciális karakter engedélyezett
    const userNameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!userNameRegex.test(userName)) {
      return "A felhasználónév csak betűket, számokat és _ . - karaktereket tartalmazhat";
    }
    
    return "";
  };

  const validateNumber = (name: string, value: number | undefined): string => {
    if (value === undefined) return "";
    
    switch (name) {
      case "weight":
        if (value < MIN_WEIGHT) return `A súly nem lehet kisebb, mint ${MIN_WEIGHT} kg`;
        if (value > MAX_WEIGHT) return `A súly nem lehet nagyobb, mint ${MAX_WEIGHT} kg`;
        break;
      case "height":
        if (value < MIN_HEIGHT) return `A magasság nem lehet kisebb, mint ${MIN_HEIGHT} cm`;
        if (value > MAX_HEIGHT) return `A magasság nem lehet nagyobb, mint ${MAX_HEIGHT} cm`;
        break;
      case "age":
        if (value < MIN_AGE) return `Az életkor nem lehet kisebb, mint ${MIN_AGE} év`;
        if (value > MAX_AGE) return `Az életkor nem lehet nagyobb, mint ${MAX_AGE} év`;
        break;
      case "goalWeight":
        if (value < MIN_GOAL_WEIGHT) return `A célsúly nem lehet kisebb, mint ${MIN_GOAL_WEIGHT} kg`;
        if (value > MAX_GOAL_WEIGHT) return `A célsúly nem lehet nagyobb, mint ${MAX_GOAL_WEIGHT} kg`;
        
        // Ellenőrizzük, hogy a célsúly ne térjen el több mint 50%-kal a jelenlegi súlytól
        if (formData?.weight) {
          const weightDiff = Math.abs(value - formData.weight);
          if (weightDiff > formData.weight * 0.5) {
            return `A célsúly nem térhet el több mint 50%-kal a jelenlegi súlytól (${formData.weight} kg)`;
          }
        }
        break;
      default:
        break;
    }
    
    return "";
  };

  const validateDate = (name: string, value: string): string => {
    if (!value) return "";
    
    if (name === "goalDate") {
      const selectedDate = new Date(value);
      
      if (selectedDate < today) {
        return "A céldátum nem lehet a múltban";
      }
      
      if (selectedDate > maxDate) {
        return `A céldátum nem lehet később, mint ${maxDateStr}`;
      }
      
      // Ha jelentős súlyváltozást tervez, legalább 1 hónapos célidő szükséges
      if (formData?.weight && formData?.goalWeight) {
        const weightDiff = Math.abs(formData.weight - formData.goalWeight);
        if (weightDiff > 5) {
          const minGoalDate = new Date(today);
          minGoalDate.setMonth(today.getMonth() + 1);
          
          if (selectedDate < minGoalDate) {
            return "A céldátumnak legalább egy hónappal a jövőben kell lennie jelentős súlyváltozás esetén";
          }
        }
      }
    }
    
    return "";
  };

  const validateBMI = (): string => {
    if (formData?.weight && formData?.height) {
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      
      if (bmi < 13) {
        return "A megadott súly és magasság kombinációja irreálisan alacsony BMI-t eredményez";
      }
      if (bmi > 60) {
        return "A megadott súly és magasság kombinációja irreálisan magas BMI-t eredményez";
      }
    }
    
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    let newValue: any = value;
    
    if (["weight", "height", "age", "goalWeight", "calorieGoal"].includes(name)) {
      newValue = value === "" ? undefined : Number(value);
    }
    
    // Beállítjuk az új értéket
    setFormData({ ...formData, [name]: newValue });
    
    // Validáljuk az adott mezőt és frissítjük a hibákat
    let errorMessage = "";
    
    if (name === "email") {
      errorMessage = validateEmail(value);
    } else if (name === "userName") {
      errorMessage = validateUserName(value);
    } else if (["weight", "height", "age", "goalWeight"].includes(name)) {
      errorMessage = validateNumber(name, newValue);
    } else if (name === "goalDate") {
      errorMessage = validateDate(name, value);
    }
    
    setFieldErrors({
      ...fieldErrors,
      [name]: errorMessage
    });

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

  const validateAllFields = (): boolean => {
    let isValid = true;
    const errors: Record<string, string> = {};
    
    // Ellenőrizzük az összes kötelező mezőt
    if (formData) {
      if (!formData.userName) {
        errors.userName = "A felhasználónév megadása kötelező";
        isValid = false;
      } else {
        const userNameError = validateUserName(formData.userName);
        if (userNameError) {
          errors.userName = userNameError;
          isValid = false;
        }
      }
      
      if (!formData.email) {
        errors.email = "Az email cím megadása kötelező";
        isValid = false;
      } else {
        const emailError = validateEmail(formData.email);
        if (emailError) {
          errors.email = emailError;
          isValid = false;
        }
      }
      
      // A nem kötelező, de kitöltött numerikus mezők ellenőrzése
      ["weight", "height", "age", "goalWeight"].forEach(field => {
        const value = formData[field as keyof Felhasznalo] as number | undefined;
        if (value !== undefined) {
          const fieldError = validateNumber(field, value);
          if (fieldError) {
            errors[field] = fieldError;
            isValid = false;
          }
        }
      });
      
      // Céldátum ellenőrzése, ha kitöltött
      if (formData.goalDate) {
        const dateError = validateDate("goalDate", formData.goalDate);
        if (dateError) {
          errors.goalDate = dateError;
          isValid = false;
        }
      }
      
      // BMI ellenőrzése, ha súly és magasság is meg van adva
      if (formData.weight !== undefined && formData.height !== undefined) {
        const bmiError = validateBMI();
        if (bmiError) {
          errors.bmi = bmiError;
          isValid = false;
        }
      }
    } else {
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    if (!validateAllFields()) {
      setError("Kérlek javítsd a hibákat a folytatáshoz");
      return;
    }
    
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
          <h2 onClick={() => navigate("/dashboard")} className="logo animated-logo">
            TestreSzabva
          </h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}> 📊 Áttekintés</button>
          <button onClick={() => navigate("/progress")}> 📈 Haladás</button>
          <button onClick={() => navigate("/receptek")}> 🍽️ Receptek</button>
          <button onClick={() => navigate("/settings")}> ⚙️ Beállítások</button>
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
            {fieldErrors.bmi && <div className="error">{fieldErrors.bmi}</div>}
            
            {formData && (
              <form onSubmit={handleSubmit} className="settings-form">
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
                  {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
                  <small className="field-hint">Érvényes email cím formátumban (pl. nev@domain.com)</small>
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
                  {fieldErrors.weight && <div className="field-error">{fieldErrors.weight}</div>}
                  <small className="field-hint">Érvényes értékek: {MIN_WEIGHT} - {MAX_WEIGHT} kg</small>
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
                  {fieldErrors.height && <div className="field-error">{fieldErrors.height}</div>}
                  <small className="field-hint">Érvényes értékek: {MIN_HEIGHT} - {MAX_HEIGHT} cm</small>
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
                  {fieldErrors.age && <div className="field-error">{fieldErrors.age}</div>}
                  <small className="field-hint">Érvényes értékek: {MIN_AGE} - {MAX_AGE} év</small>
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
                  {fieldErrors.goalWeight && <div className="field-error">{fieldErrors.goalWeight}</div>}
                  <small className="field-hint">Érvényes értékek: {MIN_GOAL_WEIGHT} - {MAX_GOAL_WEIGHT} kg</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="goalDate">Céldátum:</label>
                  <input
                    type="date"
                    id="goalDate"
                    name="goalDate"
                    min={todayStr}
                    max={maxDateStr}
                    value={formData.goalDate ? formData.goalDate.split("T")[0] : ""}
                    onChange={handleChange}
                  />
                  {fieldErrors.goalDate && <div className="field-error">{fieldErrors.goalDate}</div>}
                  <small className="field-hint">Válassz egy jövőbeli dátumot (max. 5 éven belül)</small>
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