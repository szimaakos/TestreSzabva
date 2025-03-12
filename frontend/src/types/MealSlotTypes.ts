export interface Etel {
    foodId: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }
  
  export interface MealFood {
    id?: number; // opcionális, mert PUT/POST esetén nem mindig érkezik
    foodId: number;
    etel?: Etel; // opcionális, mert nem mindig érkezik
    quantity: number;
    totalCalories: number;
  }
  
  export interface HetiEtrend {
    planId: number;
    dayOfWeek: string;
    mealTime: string;
    userId: string;
    mealFoods: MealFood[];
  }
  