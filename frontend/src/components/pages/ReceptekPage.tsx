import React from "react";
import { FOODS, CATEGORIES, FOOD_CATEGORIES } from "../mockData";

/**
 * Egyszerű csatlakoztatás: 
 * - Egy food-hoz kikeressük a FOOD_CATEGORIES táblából a kapcsolt kategória ID-ket,
 * - Majd a CATEGORIES tömbben megnézzük, melyiknek egyezik az ID-je.
 */
const ReceptekPage: React.FC = () => {
  // Összeállítunk egy "foodsWithCategories" listát
  const foodsWithCategories = FOODS.map((food) => {
    // Megkeressük a kapcsolt category_id-ket
    const related = FOOD_CATEGORIES.filter((fc) => fc.food_id === food.food_id);
    // A kapcsolt Category objektumok
    const cats = related.map((rel) =>
      CATEGORIES.find((cat) => cat.category_id === rel.category_id)
    );
    return {
      ...food,
      categories: cats, // pl. [{category_id:1, name:"Gyümölcs"}, ...]
    };
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Receptek / Ételek listája</h1>
      <p>Itt egy minta a "Etelek" tábla + kategóriák megjelenítésére:</p>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Név</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Kalória</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Fehérje</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Szénhidrát</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Zsír</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Kategóriák</th>
          </tr>
        </thead>
        <tbody>
          {foodsWithCategories.map((food) => (
            <tr key={food.food_id}>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {food.name}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {food.calories}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {food.protein} g
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {food.carbs} g
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {food.fats} g
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {food.categories
                  ?.filter((c) => c != null)
                  .map((c) => c?.name)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceptekPage;
