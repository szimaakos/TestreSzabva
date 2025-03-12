import React from "react";
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
  const getMealSlotForDayAndType = (day: string, mealType: string) =>
    weeklyMenus.find(
      (slot) =>
        slot.dayOfWeek.toLowerCase() === day.toLowerCase() &&
        slot.mealTime.toLowerCase() === mealType.toLowerCase()
    );

  return (
    <table className="weekly-menu-table">
      <thead>
        <tr>
          <th>Étkezés</th>
          {days.map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mealTypes.map((mealType, rowIndex) => (
          <tr key={rowIndex}>
            <td>{mealType}</td>
            {days.map((day, colIndex) => {
              const slot = getMealSlotForDayAndType(day, mealType);
              const isToday = day.toLowerCase() === currentDayName.toLowerCase();
              return (
                <td key={colIndex}>
                  {slot && slot.mealFoods && slot.mealFoods.length > 0 ? (
                    <>
                      {slot.mealFoods.map((mf, i) => (
                        <div key={mf.id ?? `${mf.foodId}-${i}`} className="meal-item">
                          <div className="meal-info">
                            <span className="meal-name">{mf.etel?.name || "Ismeretlen étel"}</span>
                            <span className="meal-calories">{mf.totalCalories} kcal</span>
                            <span className="meal-quantity">Adag: {mf.quantity}</span>
                          </div>
                          <div className="meal-actions">
                            <button onClick={() => onChangeQuantity(day, mealType, i)} disabled={!isToday}>
                              Adag beállítása
                            </button>
                            <button onClick={() => onDeleteFood(day, mealType, i)} disabled={!isToday}>
                              Törlés
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="add-food-button" onClick={() => onAddFoodClick(day, mealType)} disabled={!isToday}>
                        Új étel hozzáadása
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="no-meal">Nincs étel</span>
                      <button className="add-food-button" onClick={() => onAddFoodClick(day, mealType)} disabled={!isToday}>
                        Étel hozzáadása
                      </button>
                    </>
                  )}
                  {!isToday && <div className="disabled-text">Csak a mai naphoz adhatsz hozzá!</div>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WeeklyMenuTable;