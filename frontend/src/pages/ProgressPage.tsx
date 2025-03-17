import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./ProgressPage.css";
import { useUser } from '../context/UserContext';

interface ProgressRecord {
  date: string;
  weight: number;
}

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserData, refreshUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState<number | undefined>(undefined);
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [progressData, setProgressData] = useState<ProgressRecord[]>([]);
  const [weightHistory, setWeightHistory] = useState<ProgressRecord[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("2weeks");
  const [weightLogDate, setWeightLogDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Reszponzivitás: Sidebar állapotának és az ablakméret követése
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

  // Sidebar overlay bezárása kattintásra
  const handleOverlayClick = () => {
    setMenuOpen(false);
  };

  // Haladási adatok betöltése
  const loadProgressData = () => {
    try {
      const storedRecordsJson = localStorage.getItem("progressRecords");
      if (storedRecordsJson) {
        const records: ProgressRecord[] = JSON.parse(storedRecordsJson);
        // Rendezés dátum szerint
        records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setProgressData(records);
        setWeightHistory(records);
      } else {
        setProgressData([]);
        setWeightHistory([]);
      }
    } catch (error) {
      console.error("Hiba a haladási adatok betöltésekor:", error);
      setProgressData([]);
      setWeightHistory([]);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await refreshUserData(); // Felhasználói adatok frissítése
      loadProgressData();
      setLoading(false);
    };
    fetchAllData();
  }, [refreshUserData]);

  useEffect(() => {
    if (user && newWeight === undefined && user.weight !== undefined) {
      setNewWeight(user.weight);
    }
  }, [user, newWeight]);

  // Súlyadat frissítése
  const handleWeightUpdate = async () => {
    if (!user || newWeight === undefined) return;
    setUpdateStatus("Feldolgozás...");
    try {
      const weightValue = parseFloat(newWeight.toString());
      if (isNaN(weightValue)) {
        setUpdateStatus("Érvénytelen súlyérték!");
        return;
      }
      const dateString = weightLogDate + "T00:00:00Z";
      const newRecord: ProgressRecord = {
        date: dateString,
        weight: weightValue,
      };

      const storedRecordsJson = localStorage.getItem("progressRecords");
      let storedRecords: ProgressRecord[] = storedRecordsJson ? JSON.parse(storedRecordsJson) : [];
      const existingIndex = storedRecords.findIndex(r =>
        new Date(r.date).toISOString().split("T")[0] === weightLogDate
      );
      if (existingIndex !== -1) {
        storedRecords[existingIndex] = newRecord;
      } else {
        storedRecords.push(newRecord);
      }
      localStorage.setItem("progressRecords", JSON.stringify(storedRecords));
      
      // Ha a mai napról van szó, frissítsük a profil súlyát is
      const todayIso = new Date().toISOString().split("T")[0];
      if (weightLogDate === todayIso) {
        const updatedUser = { ...user, weight: weightValue };
        await updateUserData(updatedUser);
        await refreshUserData();
      }
      
      setUpdateStatus("Súlyadat sikeresen rögzítve!");
      loadProgressData();
      setTimeout(() => setUpdateStatus(""), 3000);
    } catch (error) {
      console.error("Hiba a súly frissítésekor:", error);
      setUpdateStatus("Hiba történt a frissítés során!");
      setTimeout(() => setUpdateStatus(""), 3000);
    }
  };

  // Dátumszűrés
  const filterDataByDateRange = (data: ProgressRecord[]) => {
    if (selectedDateRange === "all") return data;
    const today = new Date();
    let startDate = new Date();
    switch (selectedDateRange) {
      case "week":
        startDate.setDate(today.getDate() - 7);
        break;
      case "2weeks":
        startDate.setDate(today.getDate() - 14);
        break;
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(today.getMonth() - 6);
        break;
      default:
        return data;
    }
    return data.filter(record =>
      new Date(record.date) >= startDate && new Date(record.date) <= today
    );
  };

  const filteredData = filterDataByDateRange(progressData);

  // Súly diagram adatainak előállítása
  const getWeightChartData = () => {
    if (filteredData.length > 0) {
      const labels = filteredData.map(record =>
        new Date(record.date).toLocaleDateString("hu-HU", { month: "short", day: "numeric" })
      );
      const weightDataArr = filteredData.map(record => record.weight);
      return {
        labels,
        datasets: [
          {
            label: "Súly (kg)",
            data: weightDataArr,
            fill: false,
            borderColor: "#e30b5c",
            backgroundColor: "#e30b5c",
            tension: 0.3,
            segment: {
              borderColor: (ctx: any) => {
                return ctx.p0.parsed.y > ctx.p1.parsed.y ? "#22c55e" : "#ef4444";
              },
            },
          },
          {
            label: "Célsúly (kg)",
            data: user?.goalWeight ? Array(labels.length).fill(user.goalWeight) : [],
            fill: false,
            borderColor: "#4CAF50",
            backgroundColor: "#4CAF50",
            borderDash: [5, 5],
            tension: 0,
          },
        ],
      };
    } else if (user?.weight) {
      const todayLabel = new Date().toLocaleDateString("hu-HU", { month: "short", day: "numeric" });
      return {
        labels: [todayLabel],
        datasets: [
          {
            label: "Súly (kg)",
            data: [user.weight],
            fill: false,
            borderColor: "#e30b5c",
            backgroundColor: "#e30b5c",
            tension: 0.3,
          },
          {
            label: "Célsúly (kg)",
            data: user?.goalWeight ? [user.goalWeight] : [],
            fill: false,
            borderColor: "#4CAF50",
            backgroundColor: "#4CAF50",
            borderDash: [5, 5],
            tension: 0,
          },
        ],
      };
    }
    return { labels: [], datasets: [] };
  };

  const weightChartData = getWeightChartData();

  // Súlykülönbség és trend számítása
  const calculateWeightDifference = () => {
    if (weightHistory.length < 2) return { difference: 0, percentChange: 0, trend: "stable" };
    const oldest = weightHistory[0].weight;
    const newest = weightHistory[weightHistory.length - 1].weight;
    const difference = newest - oldest;
    const percentChange = (difference / oldest) * 100;
    
    let trend = "stable";
    if (difference < -0.5) trend = "decreasing";
    if (difference > 0.5) trend = "increasing";
    
    return { 
      difference, 
      percentChange,
      trend 
    };
  };

  // Célsúly elérés százalékos arányának számítása
  const calculateGoalProgress = () => {
    if (!user?.weight || !user?.goalWeight) return 0;
    const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : user.weight;
    const currentWeightVal = user.weight;
    const goalWeight = user.goalWeight;
    
    if (startWeight === goalWeight) return 100;
    
    if (goalWeight > startWeight) {
      if (currentWeightVal >= goalWeight) return 100;
      if (currentWeightVal <= startWeight) return 0;
      return Math.round(((currentWeightVal - startWeight) / (goalWeight - startWeight)) * 100);
    } else {
      if (currentWeightVal <= goalWeight) return 100;
      if (currentWeightVal >= startWeight) return 0;
      return Math.round(((startWeight - currentWeightVal) / (startWeight - goalWeight)) * 100);
    }
  };

  // Egyszerű BMI számítás
  const calculateBMI = () => {
    if (!user?.weight || !user?.height) return null;
    const weightKg = user.weight;
    const heightM = user.height / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  // Frissített BMI kategória meghatározása
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Alulsúlyos", color: "#FFB74D" };
    if (bmi < 25) return { category: "Normál", color: "#66BB6A" };
    if (bmi < 30) return { category: "Túlsúlyos", color: "#FFA726" };
    return { category: "Elhízott", color: "#EF5350" };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;
  const weightDiff = calculateWeightDifference();
  const goalProgress = calculateGoalProgress();

  const maxDate = new Date().toISOString().split("T")[0];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  return (
    <div className="dashboard-container fade-in">
      {/* Hamburger menü ikon mobil nézethez */}
      <div className={`hamburger-menu ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Overlay a mobil sidebar mögött */}
      <div 
        className={`sidebar-overlay ${menuOpen && windowWidth <= 768 ? "active" : ""}`}
        onClick={handleOverlayClick}
      ></div>

      {/* Sidebar: open/closed állapot alapján */}
      <aside className={`dashboard-sidebar ${menuOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
        <h2 onClick={() => navigate("/")} className="logo animated-logo">
            TestreSzabva
          </h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}> 📊 Áttekintés</button>
          <button onClick={() => navigate("/progress")}> 📈 Haladás
          </button>
          <button onClick={() => navigate("/receptek")}> 🍽️ Receptek</button>
          <button onClick={() => navigate("/settings")}> ⚙️ Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </div>
      </aside>

      <div className="dashboard-content progress-content">
        <header className="content-header">
          <h1>Haladás követése</h1>
          <p>
            Itt követheted nyomon a súlyod alakulását, valamint rögzíthetsz új súlyadatot.
          </p>
        </header>

        {/* Összefoglaló kártyák */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Jelenlegi súly</h3>
            <div className="card-value">{user?.weight} kg</div>
            {weightDiff.trend !== "stable" && (
              <div className={`trend-badge ${weightDiff.trend}`}>
                {weightDiff.difference > 0 ? "+" : ""}
                {weightDiff.difference.toFixed(1)} kg
                <span className="trend-arrow">
                  ({weightDiff.percentChange.toFixed(1)}%)
                  {weightDiff.trend === "increasing" ? " ↑" : " ↓"}
                </span>
              </div>
            )}
          </div>

          <div className="summary-card">
            <h3>Célsúly</h3>
            <div className="card-value">{user?.goalWeight} kg</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${goalProgress}%` }}></div>
            </div>
            <div className="progress-label">{goalProgress}% teljesítve</div>
          </div>

          {bmi && bmiInfo && (
            <div className="summary-card">
              <h3>BMI érték</h3>
              <div className="card-value">{bmi}</div>
              <div className="bmi-category" style={{ backgroundColor: bmiInfo.color }}>
                {bmiInfo.category}
              </div>
            </div>
          )}
        </div>

        {/* Időszakválasztó */}
        <div className="time-range-selector">
          <label>Időszak:</label>
          <select value={selectedDateRange} onChange={(e) => setSelectedDateRange(e.target.value)}>
            <option value="week">Elmúlt hét</option>
            <option value="2weeks">Elmúlt 2 hét</option>
            <option value="month">Elmúlt hónap</option>
            <option value="3months">Elmúlt 3 hónap</option>
            <option value="6months">Elmúlt 6 hónap</option>
            <option value="all">Összes adat</option>
          </select>
        </div>

        {/* Súlyváltozás diagram */}
        <section className="progress-section weight-progress">
          <h2>Súly Változás</h2>
          <div className="chart-container">
            {(filteredData.length > 0 || user?.weight) ? (
              <Line
                data={weightChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.parsed.y} kg`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      title: { display: true, text: "Súly (kg)" },
                      ticks: { precision: 1 },
                    },
                  },
                }}
              />
            ) : (
              <p>Nincs elérhető súlyadat.</p>
            )}
          </div>
        </section>

        {/* Súlyadat rögzítése */}
        <section className="weight-update-section">
          <h2>Súlyadat rögzítése</h2>
          <div className="weight-input-group">
            <input
              type="number"
              value={newWeight ?? ''}
              onChange={(e) =>
                setNewWeight(e.target.value ? parseFloat(e.target.value) : undefined)
              }
              placeholder="Írd be a súlyodat (kg)"
              step="0.1"
            />
            <input
              type="date"
              value={weightLogDate}
              onChange={(e) => setWeightLogDate(e.target.value)}
              max={maxDate}
            />
            <button onClick={handleWeightUpdate}>Rögzítés</button>
          </div>
          {updateStatus && <p className="update-status">{updateStatus}</p>}
          <p className="info-text">
            {weightLogDate === maxDate
              ? "A mai napra rögzített súly automatikusan frissíti az aktuális profil súlyodat is."
              : "Korábbi dátumra rögzített súly csak a haladási grafikonon jelenik meg."}
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProgressPage;
