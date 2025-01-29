// Példa: Etelek tábla
export const FOODS = [
    {
      food_id: 1,
      name: "Alma",
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fats: 0.2,
    },
    {
      food_id: 2,
      name: "Csirkemell",
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
    },
    {
      food_id: 3,
      name: "Zabpehely",
      calories: 389,
      protein: 16.9,
      carbs: 66,
      fats: 6.9,
    },
  ];
  
  // Kategoriak tábla
  export const CATEGORIES = [
    { category_id: 1, name: "Gyümölcs" },
    { category_id: 2, name: "Magas Fehérje" },
    { category_id: 3, name: "Alacsony Kalória" },
  ];
  
  // Kapcsolótábla (Etel_Kategoriak)
  export const FOOD_CATEGORIES = [
    // Alma -> Gyümölcs, Alacsony Kalória
    { food_id: 1, category_id: 1 },
    { food_id: 1, category_id: 3 },
    // Csirkemell -> Magas Fehérje
    { food_id: 2, category_id: 2 },
    // Zabpehely -> Magas Fehérje, Alacsony Kalória? (vagy nem?)
    { food_id: 3, category_id: 2 },
  ];
  
  // Heti_Etrend – most nem töltjük, csak illusztráció
  export const HETI_ETREND = [
    // plan_id, user_id, day_of_week, meal_time, food_id, quantity, total_calories
  ];
  