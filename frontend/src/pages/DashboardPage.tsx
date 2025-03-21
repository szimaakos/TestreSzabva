import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodSelectorPopup from "../components/FoodSelectorPopup";
import RemainingCaloriesBox from "../components/RemainingCaloriesBox";
import { HetiEtrend, Etel } from "../types/MealSlotTypes";
import QuantitySelectorModal from "../components/‎QuantitySelectorModal";
import WeeklyMenuTable from "../components/WeeklyMenuTable";
import "./DashboardPage.css";
import { useUser } from "../context/UserContext";

interface SelectedCell {
  day: string;
  mealType: string;
}

interface SelectedQuantityCell extends SelectedCell {
  foodIndex: number;
}

interface CaloriesData {
  dailyRecommended: number;
  dailyConsumed: number;
  weeklyRecommended: number;
  weeklyConsumed: number;
  dailyRemaining: number;
  weeklyRemaining: number;
}

const CALORIES_STORAGE_KEY = "caloriesData";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, caloriesConsumed, setCaloriesConsumed, refreshUserData } = useUser();
  const [weeklyMenus, setWeeklyMenus] = useState<HetiEtrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodPopupOpen, setFoodPopupOpen] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [quantityModalOpen, setQuantityModalOpen] = useState<boolean>(false);
  const [selectedQuantityCell, setSelectedQuantityCell] = useState<SelectedQuantityCell | null>(null);
  const [caloriesData, setCaloriesData] = useState<CaloriesData>(() => {
    // Inicializálás localStorage-ból, ha létezik
    const savedData = localStorage.getItem(CALORIES_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Error parsing saved calories data:", e);
      }
    }
    // Default érték, ha nincs elmentett adat
    return {
      dailyRecommended: 0,
      dailyConsumed: 0,
      weeklyRecommended: 0,
      weeklyConsumed: 0,
      dailyRemaining: 0,
      weeklyRemaining: 0
    };
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
  const dayMap: { [key: number]: string } = { 1: "Hétfő", 2: "Kedd", 3: "Szerda", 4: "Csütörtök", 5: "Péntek", 6: "Szombat", 0: "Vasárnap" };
  const todayDayName = dayMap[new Date().getDay()];
  const mealTypes = ["Reggeli", "Ebéd", "Snack", "Vacsora"];
  const userId = localStorage.getItem("userId") || "";

  // Követi az ablak méretét
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Kezdeti méret beállítása

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute recommended calories without default values
  const computeRecommendedCalories = (): number | null => {
    if (!user || !user.weight || !user.height || !user.age || !user.gender || !user.activityLevel) {
      return null; // Nincs elég adat a számításhoz
    }
    
    if (user.calorieGoal) {
      return Math.round(user.calorieGoal);
    }
    
    let bmr = 0;
    if (["férfi", "male"].includes(user.gender.toLowerCase())) {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else if (["nő", "female"].includes(user.gender.toLowerCase())) {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    } else {
      return null; // Ismeretlen nem
    }
    
    let multiplier: number;
    switch (user.activityLevel.toLowerCase()) {
      case "alacsony":
      case "sedentary":
        multiplier = 1.2;
        break;
      case "mérsékelt":
      case "light":
        multiplier = 1.55;
        break;
      case "magas":
      case "moderate":
        multiplier = 1.725;
        break;
      case "active":
      case "veryactive":
        multiplier = 1.9;
        break;
      default:
        return null; // Ismeretlen aktivitási szint
    }
    
    const maintenanceCalories = Math.round(bmr * multiplier);
    
    if (user.goalWeight && user.goalDate) {
      const currentDate = new Date();
      const targetDate = new Date(user.goalDate);
      const daysRemaining = Math.ceil((targetDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysRemaining > 0) {
        const weightDifference = user.weight - user.goalWeight;
        const totalCalorieDifference = weightDifference * 7700;
        const dailyCalorieAdjustment = totalCalorieDifference / daysRemaining;
        let recommended = Math.round(maintenanceCalories - dailyCalorieAdjustment);
        
        const minCalories = user.gender.toLowerCase().includes("férfi") ? 1500 : 1200;
        const maxCalories = maintenanceCalories + 1000;
        
        if (recommended < minCalories) recommended = minCalories;
        if (recommended > maxCalories) recommended = maxCalories;
        
        return recommended;
      }
    }
    
    return maintenanceCalories;
  };

  // Calculate calories data with null handling
  const calculateCaloriesData = (
    weeklyData: HetiEtrend[],
    todayDayName: string
  ): CaloriesData => {
    const recommended = computeRecommendedCalories();
    
    // Ha nincs elegendő adat, visszaadjuk a korábban mentett értékeket vagy alapértelmezetteket
    if (recommended === null) {
      const savedData = localStorage.getItem(CALORIES_STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.error("Error parsing saved calories data:", e);
        }
      }
      return caloriesData; // Használjuk a jelenlegi állapotot
    }
    
    const weeklyRecommended = recommended * 7;
    
    if (!weeklyData || weeklyData.length === 0) {
      return {
        dailyRecommended: recommended,
        dailyConsumed: 0,
        weeklyRecommended: weeklyRecommended,
        weeklyConsumed: 0,
        dailyRemaining: recommended,
        weeklyRemaining: weeklyRecommended
      };
    }
    
    let totalCalories = 0;
    let todayCalories = 0;
    
    weeklyData.forEach((slot: HetiEtrend) => {
      const mealFoods = slot.mealFoods || [];
      const slotCalories = mealFoods.reduce((sum, mf) => sum + (mf.totalCalories || 0), 0);
      
      totalCalories += slotCalories;
      
      if (slot.dayOfWeek.toLowerCase() === todayDayName.toLowerCase()) {
        todayCalories += slotCalories;
      }
    });
    
    const dailyRemaining = Math.max(0, recommended - todayCalories);
    const weeklyRemaining = Math.max(0, weeklyRecommended - totalCalories);
    
    return {
      dailyRecommended: recommended,
      dailyConsumed: todayCalories,
      weeklyRecommended: weeklyRecommended,
      weeklyConsumed: totalCalories,
      dailyRemaining: dailyRemaining,
      weeklyRemaining: weeklyRemaining
    };
  };

  // Mentsük el a kalória adatokat a localStorage-ba
  useEffect(() => {
    if (caloriesData.dailyRecommended > 0) {
      localStorage.setItem(CALORIES_STORAGE_KEY, JSON.stringify(caloriesData));
    }
  }, [caloriesData]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token || !userId) {
        navigate("/");
        return;
      }
      
      setLoading(true);
      
      try {
        // Várjuk meg a felhasználói adatok frissítését
        await refreshUserData();
        
        // Majd kérjük le a heti étrendet
        const weeklyResponse = await fetch(`http://localhost:5162/api/HetiEtrend/Felhasznalo/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (weeklyResponse.ok) {
          const data = await weeklyResponse.json();
          // Ensure data is always an array
          const weeklyData = Array.isArray(data) ? data : (data ? [data] : []);
          
          // Set weekly menus
          setWeeklyMenus(weeklyData);
          
          // Calculate calories data immediately after setting weekly menus
          const caloriesInfo = calculateCaloriesData(weeklyData, todayDayName);
          setCaloriesData(caloriesInfo);
          setCaloriesConsumed(caloriesInfo.weeklyConsumed);
        } else {
          console.error("Error loading weekly menu data:", weeklyResponse.status);
          // Use saved values on error if they exist
          const savedData = localStorage.getItem(CALORIES_STORAGE_KEY);
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              setCaloriesData(parsedData);
              setCaloriesConsumed(parsedData.weeklyConsumed);
            } catch (e) {
              console.error("Error parsing saved calories data:", e);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Use saved values on error if they exist
        const savedData = localStorage.getItem(CALORIES_STORAGE_KEY);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            setCaloriesData(parsedData);
            setCaloriesConsumed(parsedData.weeklyConsumed);
          } catch (e) {
            console.error("Error parsing saved calories data:", e);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, userId, todayDayName, setCaloriesConsumed, refreshUserData]);
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem(CALORIES_STORAGE_KEY); // Tisztítsuk a kalória adatokat kijelentkezéskor
    navigate("/");
  };

  const handleFoodClick = (day: string, mealType: string) => {
    setSelectedCell({ day, mealType });
    setFoodPopupOpen(true);
  };

  const handleFoodSelected = async (food: Etel) => {
    const token = localStorage.getItem("authToken");
    if (!token || !userId || !selectedCell) return;
  
    const newQuantity = 1;
    const additionalCalories = food.calories * newQuantity;
    
    const existingSlot = weeklyMenus.find(
      (slot) =>
        slot.dayOfWeek.toLowerCase() === selectedCell.day.toLowerCase() &&
        slot.mealTime.toLowerCase() === selectedCell.mealType.toLowerCase()
    );
    
    if (existingSlot) {
      const existingFoodIndex = existingSlot.mealFoods.findIndex(
        (mf) => mf.foodId === food.foodId
      );
      
      let updatedMealFoods;
      if (existingFoodIndex >= 0) {
        updatedMealFoods = existingSlot.mealFoods.map((mf, idx) => {
          if (idx === existingFoodIndex) {
            const newQty = mf.quantity + 1;
            return {
              ...mf,
              quantity: newQty,
              totalCalories: food.calories * newQty,
              etel: food,
            };
          }
          return mf;
        });
      } else {
        const newMealFood = {
          foodId: food.foodId,
          quantity: newQuantity,
          totalCalories: additionalCalories,
          etel: food,
        };
        updatedMealFoods = [...existingSlot.mealFoods, newMealFood];
      }
      
      const updatedSlotData = {
        PlanId: existingSlot.planId,
        UserId: existingSlot.userId,
        DayOfWeek: existingSlot.dayOfWeek,
        MealTime: existingSlot.mealTime,
        MealFoods: updatedMealFoods,
      };
  
      const response = await fetch(`http://localhost:5162/api/HetiEtrend/mealSlot/${existingSlot.planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSlotData),
      });
  
      if (response.ok) {
        const updatedMenus = weeklyMenus.map(slot =>
          slot.planId === existingSlot.planId ? { ...slot, mealFoods: updatedMealFoods } : slot
        );
        
        const newCaloriesInfo = calculateCaloriesData(updatedMenus, todayDayName);
        setWeeklyMenus(updatedMenus);
        setCaloriesData(newCaloriesInfo);
        setCaloriesConsumed(newCaloriesInfo.weeklyConsumed);
      } else {
        const errorText = await response.text();
        console.error("Error updating slot:", response.status, errorText);
      }
    } else {
      const newMealFood = {
        foodId: food.foodId,
        quantity: newQuantity,
        totalCalories: additionalCalories,
        etel: food,
      };
      const newSlotData = {
        UserId: userId,
        DayOfWeek: selectedCell.day,
        MealTime: selectedCell.mealType,
        MealFoods: [newMealFood],
      };
  
      const response = await fetch("http://localhost:5162/api/HetiEtrend/mealSlot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlotData),
      });
  
      if (response.ok) {
        const createdSlot = await response.json();
        const updatedMenus = [...weeklyMenus, createdSlot];
        const newCaloriesInfo = calculateCaloriesData(updatedMenus, todayDayName);
        setWeeklyMenus(updatedMenus);
        setCaloriesData(newCaloriesInfo);
        setCaloriesConsumed(newCaloriesInfo.weeklyConsumed);
      } else {
        const errorText = await response.text();
        console.error("Error creating new slot:", response.status, errorText);
      }
    }
    setFoodPopupOpen(false);
  };
  
  const handleDeleteFood = async (day: string, mealType: string, foodIndex: number) => {
    const slot = weeklyMenus.find(
      (m) =>
        m.dayOfWeek.toLowerCase() === day.toLowerCase() &&
        m.mealTime.toLowerCase() === mealType.toLowerCase()
    );
    if (!slot) return;

    const updatedMealFoods = slot.mealFoods.filter((_, idx) => idx !== foodIndex);

    const token = localStorage.getItem("authToken");
    if (!token) return;
    const updatedSlotData = {
      PlanId: slot.planId,
      UserId: slot.userId,
      DayOfWeek: slot.dayOfWeek,
      MealTime: slot.mealTime,
      MealFoods: updatedMealFoods,
    };

    const response = await fetch(`http://localhost:5162/api/HetiEtrend/mealSlot/${slot.planId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSlotData),
    });
    if (response.ok) {
      const updatedMenus = weeklyMenus.map(m => 
        m.planId === slot.planId ? { ...m, mealFoods: updatedMealFoods } : m
      );
      
      const newCaloriesInfo = calculateCaloriesData(updatedMenus, todayDayName);
      setWeeklyMenus(updatedMenus);
      setCaloriesData(newCaloriesInfo);
      setCaloriesConsumed(newCaloriesInfo.weeklyConsumed);
    } else {
      console.error("Error deleting food:", response.status);
    }
  };

  const handleChangeQuantity = (day: string, mealType: string, foodIndex: number) => {
    if (day.toLowerCase() !== todayDayName.toLowerCase()) return;
    setSelectedQuantityCell({ day, mealType, foodIndex });
    setQuantityModalOpen(true);
  };

  const handleQuantityConfirm = async (newQuantity: number) => {
    if (!selectedQuantityCell) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const slot = weeklyMenus.find(
      (slot) =>
        slot.dayOfWeek.toLowerCase() === selectedQuantityCell.day.toLowerCase() &&
        slot.mealTime.toLowerCase() === selectedQuantityCell.mealType.toLowerCase()
    );
    if (!slot) return;

    const foodIndex = selectedQuantityCell.foodIndex;
    const mealFoodToUpdate = slot.mealFoods[foodIndex];
    if (!mealFoodToUpdate) return;

    const perUnitCalories = mealFoodToUpdate.etel
      ? mealFoodToUpdate.etel.calories
      : (mealFoodToUpdate.quantity > 0 ? mealFoodToUpdate.totalCalories / mealFoodToUpdate.quantity : 0);
    const newMealFoodCalories = perUnitCalories * newQuantity;

    const updatedMealFoods = slot.mealFoods.map((mf, idx) =>
      idx === foodIndex ? { ...mf, quantity: newQuantity, totalCalories: newMealFoodCalories } : mf
    );

    const updatedSlotData = {
      PlanId: slot.planId,
      UserId: slot.userId,
      DayOfWeek: slot.dayOfWeek,
      MealTime: slot.mealTime,
      MealFoods: updatedMealFoods,
    };

    const response = await fetch(`http://localhost:5162/api/HetiEtrend/mealSlot/${slot.planId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSlotData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to update quantity:", response.status, errorBody);
      return;
    }

    const updatedMenus = weeklyMenus.map(s => 
      s.planId === slot.planId ? { ...s, mealFoods: updatedMealFoods } : s
    );
    
    const newCaloriesInfo = calculateCaloriesData(updatedMenus, todayDayName);
    
    setWeeklyMenus(updatedMenus);
    setCaloriesData(newCaloriesInfo);
    setCaloriesConsumed(newCaloriesInfo.weeklyConsumed);

    setSelectedQuantityCell(null);
    setQuantityModalOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (windowWidth <= 768) {
      setMenuOpen(false);
    }
  };

  const handleOverlayClick = () => {
    setMenuOpen(false);
  };

  if (loading || userLoading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div 
        className={`sidebar-overlay ${menuOpen && windowWidth <= 768 ? 'active' : ''}`} 
        onClick={handleOverlayClick}
      ></div>
      <aside className={`dashboard-sidebar ${menuOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 onClick={() => navigate("/dashboard")} className="logo animated-logo">TestreSzabva</h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handleMenuItemClick("/dashboard")}> 📊 Áttekintés</button>
          <button onClick={() => handleMenuItemClick("/progress")}> 📈 Haladás</button>
          <button onClick={() => handleMenuItemClick("/receptek")}> 🍽️ Receptek</button>
          <button onClick={() => handleMenuItemClick("/settings")}> ⚙️ Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>Kijelentkezés</button>
        </div>
      </aside>
      <div className="dashboard-content">
        <header className="content-header">
          <h1>Üdv, {user?.userName || 'Felhasználó'}!</h1>
          <p>Itt találod a napi és heti kalória céljaidat és a heti menüdet.</p>
        </header>
        <div className="top-info-section">
          <div className="remaining-calories-box">
            <RemainingCaloriesBox 
              recommended={caloriesData.dailyRecommended} 
              consumed={caloriesData.dailyConsumed} 
              weeklyRecommended={caloriesData.weeklyRecommended}
              weeklyConsumed={caloriesData.weeklyConsumed}
              weeklyRemaining={caloriesData.weeklyRemaining}
            />
          </div>
        </div>
        <section className="weekly-menu-section">
          <h2>Heti Menü</h2>
          <div className="weekly-menu-wrapper">
            <WeeklyMenuTable
              days={days}
              mealTypes={mealTypes}
              weeklyMenus={weeklyMenus}
              onAddFoodClick={handleFoodClick}
              onDeleteFood={handleDeleteFood}
              onChangeQuantity={handleChangeQuantity}
              currentDayName={todayDayName}
            />
          </div>
        </section>
      </div>
      {foodPopupOpen && selectedCell && (
          <FoodSelectorPopup
            mealType={selectedCell.mealType}
            onFoodSelect={handleFoodSelected}
            onClose={() => setFoodPopupOpen(false)}
          />
        )}
      {quantityModalOpen && selectedQuantityCell && (
        <QuantitySelectorModal
          initialQuantity={
            (() => {
              const slot = weeklyMenus.find(
                (m) =>
                  m.dayOfWeek.toLowerCase() === selectedQuantityCell.day.toLowerCase() &&
                  m.mealTime.toLowerCase() === selectedQuantityCell.mealType.toLowerCase()
              );
              return slot && slot.mealFoods && slot.mealFoods[selectedQuantityCell.foodIndex]
                ? slot.mealFoods[selectedQuantityCell.foodIndex].quantity
                : 1;
            })()
          }
          onConfirm={handleQuantityConfirm}
          onClose={() => setQuantityModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;