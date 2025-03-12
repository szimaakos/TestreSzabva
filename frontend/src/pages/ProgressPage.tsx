import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./ProgressPage.css";
import { useUser } from "../context/UserContext";

interface ProgressRecord {
  date: string;      // ISO string vagy más formázott dátum
  weight: number;    // kg-ban
  calories: number;  // napi kalóriabevitel
}

interface WeightLogEntry {
  date: string;
  weight: number;
}

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, refreshUserData, updateUserData, caloriesConsumed } = useUser();
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState<number | undefined>(undefined);
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [progressData, setProgressData] = useState<ProgressRecord[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightLogEntry[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [weightLogDate, setWeightLogDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  
  // LocalStorage-ból betöltjük a progress adatokat
  const loadProgressData = useCallback(() => {
    const storedRecordsJson = localStorage.getItem("progressRecords");
    let records: ProgressRecord[] = [];
    if (storedRecordsJson) {
      try {
        records = JSON.parse(storedRecordsJson);
      } catch (error) {
        console.error("Hiba az adatok olvasása során:", error);
      }
    }
    records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setProgressData(records);
    const weightLog = records.map(r => ({
      date: r.date,
      weight: r.weight,
    }));
    setWeightHistory(weightLog);
  }, []);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadAllData = async () => {
      await refreshUserData();
      if (isMounted) {
        loadProgressData();
        setLoading(false);
      }
    };
    
    loadAllData();
    
    return () => {
      isMounted = false;
    };
  }, []); // Remove the dependencies to prevent infinite rerendering

  useEffect(() => {
    if (user && newWeight === undefined) {
      setNewWeight(user.weight);
    }
  }, [user, newWeight]);
  
  // Dátumszűrés a kiválasztott időtartam alapján
  const filterDataByDateRange = (data: ProgressRecord[]) => {
    if (selectedDateRange === "all") return data;
    const today = new Date();
    let startDate = new Date();
    switch (selectedDateRange) {
      case "week":
        startDate.setDate(today.getDate() - 7);
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

  // A diagramhoz adatok előállítása: scatter/line típusú diagram, ahol a segment callback határozza meg a vonal színét
  const getChartData = () => {
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
            tension: 0.3,
            // segment callback: ha a két pont közötti érték csökken, zöld, ha növekszik, piros
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

  const weightChartData = getChartData();

  // Súlykülönbség és trend számítása
  const calculateWeightDifference = () => {
    if (weightHistory.length < 2) return { difference: 0, trend: "stable" };
    const oldest = weightHistory[0].weight;
    const newest = weightHistory[weightHistory.length - 1].weight;
    const difference = newest - oldest;
    let trend = "stable";
    if (difference < -0.5) trend = "decreasing";
    if (difference > 0.5) trend = "increasing";
    return { difference, trend };
  };

  const calculateGoalProgress = () => {
    if (!user?.weight || !user?.goalWeight) return 0;
    const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : user.weight;
    const currentWeightVal = user.weight;
    const goalWeight = user.goalWeight;
    
    if ((startWeight > goalWeight && currentWeightVal <= goalWeight) || 
        (startWeight < goalWeight && currentWeightVal >= goalWeight)) {
      return 100;
    }
    
    if (startWeight > goalWeight && currentWeightVal > goalWeight) {
      const originalToLose = startWeight - goalWeight;
      const alreadyLost = startWeight - currentWeightVal;
      const progress = Math.min(99, Math.round((alreadyLost / originalToLose) * 100));
      
      if (currentWeightVal - goalWeight <= 1) {
        return Math.max(progress, 95);
      }
      else if (currentWeightVal - goalWeight <= 5) {
        return Math.max(progress, 80 + (5 - (currentWeightVal - goalWeight)) * 3);
      }
      
      return progress;
    } 
    else if (startWeight < goalWeight && currentWeightVal < goalWeight) {
      const originalToGain = goalWeight - startWeight;
      const alreadyGained = currentWeightVal - startWeight;
      const progress = Math.min(99, Math.round((alreadyGained / originalToGain) * 100));
      
      if (goalWeight - currentWeightVal <= 1) {
        return Math.max(progress, 95);
      }
      else if (goalWeight - currentWeightVal <= 5) {
        return Math.max(progress, 80 + (5 - (goalWeight - currentWeightVal)) * 3);
      }
      
      return progress;
    }
    
    return 100;
  };

  // Egyszerű BMI számítás
  const calculateBMI = () => {
    if (!user?.weight || !user?.height) return null;
    const weightKg = user.weight;
    const heightM = user.height / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  // Frissített BMI kategória számítás:
  // Underweight: < 18.5, Normál: 18.5 - 26, Túlsúlyos: 26 - 30, Elhízott: >= 30
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Alulsúlyos", color: "#FFB74D" };
    if (bmi < 26) return { category: "Normál", color: "#66BB6A" };
    if (bmi < 30) return { category: "Túlsúlyos", color: "#FFA726" };
    return { category: "Elhízott", color: "#EF5350" };
  };

 
  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;
  const weightDiff = calculateWeightDifference();
  const goalProgress = calculateGoalProgress();

  const handleWeightUpdate = async () => {
    if (!user || newWeight === undefined) return;
    setUpdateStatus("Feldolgozás...");
    try {
      const weightValue = parseFloat(newWeight.toString());
      if (isNaN(weightValue)) {
        setUpdateStatus("Érvénytelen súlyérték!");
        return;
      }
  
      // Ellenőrizzük, hogy a választott dátum érvényes-e (nem jövőbeli és nem régebbi 2 hétnél)
      const selectedDate = new Date(weightLogDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(today.getDate() - 14);
      twoWeeksAgo.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        setUpdateStatus("Jövőbeli dátumra nem rögzíthetsz súlyadatot!");
        setTimeout(() => setUpdateStatus(""), 3000);
        return;
      }
      
      if (selectedDate < twoWeeksAgo) {
        setUpdateStatus("Csak az elmúlt 2 hét adatait módosíthatod!");
        setTimeout(() => setUpdateStatus(""), 3000);
        return;
      }
  
      const dateString = weightLogDate + "T00:00:00Z";
      const newRecord: ProgressRecord = {
        date: dateString,
        weight: weightValue,
        calories: dateString.split("T")[0] === new Date().toISOString().split("T")[0] 
          ? caloriesConsumed  // A mai napra a UserContext-ből származó értéket használjuk
          : user.calorieGoal || 0, // Korábbi napokra a célt használjuk
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
  
      if (weightLogDate === new Date().toISOString().split("T")[0]) {
        const updatedUser = { ...user, weight: weightValue };
        await updateUserData(updatedUser);
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
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading || userLoading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }


  return (
    <div className="dashboard-container fade-in">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>TestreSzabva</h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>Áttekintés</button>
          <button onClick={() => navigate("/progress")} className="active">
            Haladás
          </button>
          <button onClick={() => navigate("/receptek")}>Receptek</button>
          <button onClick={() => navigate("/settings")}>Beállítások</button>
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
                  {weightDiff.trend === "increasing" ? "↑" : "↓"}
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
        value={newWeight}
        onChange={(e) => setNewWeight(parseFloat(e.target.value))}
        placeholder="Írd be a súlyodat (kg)"
        step="0.1"
      />
      <input
        type="date"
        value={weightLogDate}
        onChange={(e) => setWeightLogDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        min={(() => {
          const date = new Date();
          date.setDate(date.getDate() - 14);
          return date.toISOString().split("T")[0];
        })()}
      />
      <button onClick={handleWeightUpdate}>Rögzítés</button>
    </div>
    {updateStatus && <p className="update-status">{updateStatus}</p>}
    <p className="info-text">
      {weightLogDate === new Date().toISOString().split("T")[0]
        ? "A mai napra rögzített súly automatikusan frissíti az aktuális profil súlyodat is."
        : "Korábbi dátumra (max. 2 hét) rögzített súly csak a haladási grafikonon jelenik meg."}
    </p>
  </section>
      </div>
    </div>
  );
};

export default ProgressPage;