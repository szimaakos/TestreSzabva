import React, { useState } from "react";
import "./WeeklyMenuTable.css";
import { HetiEtrend } from "../types/MealSlotTypes";

interface WeeklyMenuTableProps {
  days: string[];
  mealTypes: string[];
  weeklyMenus: HetiEtrend[];
  onAddFoodClick: (day: string, mealType: string) => void;
  onDeleteFood: (day: string, mealType: string, foodIndex: number) => void;
  onChangeQuantity: (day: string, mealType: string, foodIndex: number) => void;
  currentDayName: string;
}

const WeeklyMenuTable: React.FC<WeeklyMenuTableProps> = ({
  days,
  mealTypes,
  weeklyMenus,
  onAddFoodClick,
  onDeleteFood,
  onChangeQuantity,
  currentDayName,
}) => {
  // State a megjelenítési módhoz (normál vagy kompakt)
  const [isCompactView, setIsCompactView] = useState(false);
  
  // State a cellánként látható ételek számához
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});
  
  // Konstans az alapértelmezetten látható ételek számához
  const DEFAULT_VISIBLE_MEALS = 3;
  
  const getMealSlotForDayAndType = (day: string, mealType: string) =>
    weeklyMenus.find(
      (slot) =>
        slot.dayOfWeek.toLowerCase() === day.toLowerCase() &&
        slot.mealTime.toLowerCase() === mealType.toLowerCase()
    );

  // Kiszámoljuk a napi össz kalóriát
  const calculateDailyCalories = (day: string) => {
    let totalCalories = 0;
    mealTypes.forEach(mealType => {
      const slot = getMealSlotForDayAndType(day, mealType);
      if (slot && slot.mealFoods) {
        slot.mealFoods.forEach(food => {
          totalCalories += food.totalCalories || 0;
        });
      }
    });
    return totalCalories;
  };

  // Formázó függvény a kalória értékekhez
  const formatCalories = (calories: number) => {
    return calories.toLocaleString('hu-HU');
  };
  
  // Cellaazonosító generálása
  const getCellId = (day: string, mealType: string) => {
    return `${day}-${mealType}`.toLowerCase();
  };
  
  // Cella kinyitása/bezárása
  const toggleCellExpand = (day: string, mealType: string) => {
    const cellId = getCellId(day, mealType);
    setExpandedCells(prev => ({
      ...prev,
      [cellId]: !prev[cellId]
    }));
  };
  
  // Ellenőrizzük, hogy egy cella ki van-e nyitva
  const isCellExpanded = (day: string, mealType: string) => {
    const cellId = getCellId(day, mealType);
    return expandedCells[cellId] || false;
  };

  return (
    <div>
      <div className="weekly-menu-wrapper">
        <table className="weekly-menu-table">
          <thead>
            <tr>
              <th>Étkezés</th>
              {days.map((day, index) => {
                const isToday = day.toLowerCase() === currentDayName.toLowerCase();
                const dailyCalories = calculateDailyCalories(day);
                
                return (
                  <th 
                    key={index} 
                    className={`table-header-day ${isToday ? 'today-column' : ''}`}
                  >
                    {day}
                    {dailyCalories > 0 && (
                      <div>
                        
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((mealType, rowIndex) => (
              <tr key={rowIndex}>
                <td className="mealtype-cell">{mealType}</td>
                {days.map((day, colIndex) => {
                  const slot = getMealSlotForDayAndType(day, mealType);
                  const isToday = day.toLowerCase() === currentDayName.toLowerCase();
                  const hasMultipleMeals = slot && slot.mealFoods && slot.mealFoods.length > DEFAULT_VISIBLE_MEALS;
                  const cellExpanded = isCellExpanded(day, mealType);
                  
                  return (
                    <td 
                      key={colIndex} 
                      className={isToday ? 'active-day-column' : ''}
                    >
                      <div className={`cell-content ${isCompactView ? 'compact-view' : ''}`}>
                        {slot && slot.mealFoods && slot.mealFoods.length > 0 ? (
                          <>
                            {/* Étel számláló */}
                            <div className="meal-counter">
                              Ételek: <span className="meal-counter-badge">{slot.mealFoods.length}</span>
                            </div>
                            
                            {/* Ételek listája */}
                            {slot.mealFoods
                              .slice(0, cellExpanded ? slot.mealFoods.length : DEFAULT_VISIBLE_MEALS)
                              .map((mf, i) => (
                                <div key={mf.id ?? `${mf.foodId}-${i}`} className="meal-item">
                                  <div className="meal-info">
                                    <span className="meal-name">{mf.etel?.name || "Ismeretlen étel"}</span>
                                    <div className="meal-nutrition">
                                      <span 
                                        className="meal-quantity"
                                        onClick={() => isToday && onChangeQuantity(day, mealType, i)}
                                        style={{ cursor: isToday ? 'pointer' : 'default' }}
                                      >
                                        Adag: {mf.quantity}
                                      </span>
                                      <span className="meal-calories">{formatCalories(mf.totalCalories)} kcal</span>
                                    </div>
                                  </div>
                                  <div className="meal-actions">
                                    <button 
                                      onClick={() => onChangeQuantity(day, mealType, i)} 
                                      disabled={!isToday}
                                    >
                                      Adag beállítása
                                    </button>
                                    <button 
                                      onClick={() => onDeleteFood(day, mealType, i)} 
                                      disabled={!isToday}
                                    >
                                      Törlés
                                    </button>
                                  </div>
                                </div>
                              ))}
                            
                            {/* További ételek mutatása/elrejtése */}
                            {hasMultipleMeals && (
                              <div className="toggle-meals">
                                <button onClick={() => toggleCellExpand(day, mealType)}>
                                  {cellExpanded 
                                    ? `Kevesebb mutatása (${DEFAULT_VISIBLE_MEALS})`
                                    : `További ételek mutatása (${slot.mealFoods.length - DEFAULT_VISIBLE_MEALS})`
                                  }
                                </button>
                              </div>
                            )}
                            
                            <button 
                              className="add-food-button" 
                              onClick={() => onAddFoodClick(day, mealType)} 
                              disabled={!isToday}
                            >
                              Új étel hozzáadása
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="no-meal">Nincs étel</div>
                            <button 
                              className="add-food-button" 
                              onClick={() => onAddFoodClick(day, mealType)} 
                              disabled={!isToday}
                            >
                              Étel hozzáadása
                            </button>
                          </>
                        )}
                        {!isToday && <div className="disabled-text">Csak a mai naphoz adhatsz hozzá!</div>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyMenuTable;