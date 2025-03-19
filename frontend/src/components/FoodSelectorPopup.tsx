import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./FoodSelectorPopup.css";

interface Kategoria {
  categoryId: number;
  name: string;
}

interface EtelKategoria {
  kategoria: Kategoria;
}

export interface Etel {
  foodId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  etelKategoriak?: EtelKategoria[];
}

interface FoodSelectorPopupProps {
  onFoodSelect: (food: Etel) => void;
  onClose: () => void;
  mealType: string; // például "Ebéd"
}

// Modul-szintű cache: egyszer letöltjük az ételeket, majd ezt a változót használjuk.
let cachedFoods: Etel[] | null = null;

const useFoods = (): Etel[] => {
  const [foods, setFoods] = useState<Etel[]>([]);

  useEffect(() => {
    fetch("http://localhost:5162/api/Etel")
      .then(response => response.json())
      .then(data => {
        const foodList = data.$values || data;
        setFoods(foodList);
      })
      .catch(err => console.error("Hiba az ételek lekérésekor:", err));
  }, []);

  return foods;
};


const FoodSelectorPopup: React.FC<FoodSelectorPopupProps> = ({
  onFoodSelect,
  onClose,
  mealType,
}) => {
  const foods = useFoods();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState(mealType);

  const mealTypes = ["Reggeli", "Ebéd", "Snack", "Vacsora"];

  const filteredFoods = foods.filter(food => {
    const matchesSearch =
      searchTerm === "" ||
      food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !food.etelKategoriak ||
      food.etelKategoriak.length === 0 ||
      food.etelKategoriak.some(
        ek =>
          ek.kategoria &&
          ek.kategoria.name.toLowerCase() === selectedMealType.toLowerCase()
      );
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="close-icon" onClick={onClose}>
          <X />
        </div>
        <h3>{selectedMealType} Ételek</h3>
        <div className="meal-type-tabs">
          {mealTypes.map(meal => (
            <button
              key={meal}
              className={`meal-type-button ${meal === selectedMealType ? "active" : ""}`}
              onClick={() => setSelectedMealType(meal)}
            >
              {meal}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Keresés..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <ul className="food-list">
          {filteredFoods.map(food => (
            <li
              key={food.foodId}
              onClick={() => {
                onFoodSelect(food);
                onClose();
              }}
            >
              <div className="food-item">
                <span className="food-name">{food.name}</span>
                <div className="food-macros">
                  <span className="food-calories">{food.calories} kcal</span>
                  <span className="food-protein">P: {food.protein}g</span>
                  <span className="food-carbs">C: {food.carbs}g</span>
                  <span className="food-fats">F: {food.fats}g</span>
                </div>
                {food.etelKategoriak && food.etelKategoriak.length > 0 && (
                  <div className="food-categories">
                    {food.etelKategoriak.map((ek, idx) => (
                      <span key={idx} className="food-category">
                        {ek.kategoria.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
          {filteredFoods.length === 0 && (
            <li className="no-food">Nincs megjeleníthető étel</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FoodSelectorPopup;
