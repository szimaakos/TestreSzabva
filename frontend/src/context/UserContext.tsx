import React, { createContext, useContext, useState, useEffect } from "react";

export interface Felhasznalo {
  id: string;
  userName: string;
  email: string;
  isProfileComplete: boolean;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  goalWeight?: number;
  goalDate?: string;
  calorieGoal?: number;
}

interface UserContextType {
  user: Felhasznalo | null;
  loading: boolean;
  error: string | null;
  
  updateUserData: (userData: Felhasznalo) => Promise<boolean>;
  refreshUserData: () => Promise<void>; // Új függvény hozzáadása
  caloriesConsumed: number;
  
  setCaloriesConsumed: (calories: number) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  
  updateUserData: async () => false,
  refreshUserData: async () => {}, // Új függvény hozzáadása a kontextushoz
  caloriesConsumed: 0,
  setCaloriesConsumed: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Felhasznalo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState<number>(0);

  // Új függvény a felhasználói adatok frissítéséhez
  const refreshUserData = async () => {
    setLoading(true);
    setError(null);
    
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");
    
    if (!userId || !token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setError("Hiba történt a felhasználói adatok lekérésekor.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Hiba történt a felhasználói adatok lekérésekor.");
    } finally {
      setLoading(false);
    }
  };

  // Az eredeti userEffect loadUserData helyett most meghívjuk a refreshUserData-t
  useEffect(() => {
    refreshUserData();
  }, []);

  const updateUserData = async (userData: Felhasznalo): Promise<boolean> => {
    setError(null);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");
    
    if (!userId || !token) {
      setError("Nincs bejelentkezve!");
      return false;
    }
    
    try {
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        // Itt most NEM állítjuk be a user state-et, ezt a refreshUserData fogja megtenni
        return true;
      } else {
        const errorData = await response.text();
        setError(errorData || "Hiba történt a felhasználói adatok frissítésekor.");
        return false;
      }
    } catch (err) {
      console.error("Error updating user data:", err);
      setError("Hiba történt a felhasználói adatok frissítésekor.");
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error, 
      updateUserData, 
      refreshUserData,  // Az új függvény hozzáadása a Provider értékéhez
      caloriesConsumed,
      setCaloriesConsumed
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);