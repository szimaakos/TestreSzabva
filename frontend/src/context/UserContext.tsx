import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

export interface UserContextType {
  user: Felhasznalo | null;
  loading: boolean;
  error: string | null;
  updateUserData: (userData: Partial<Felhasznalo>) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  caloriesConsumed: number;
  setCaloriesConsumed: (calories: number) => void;
}

// Próbáljuk meg a localStorage-ból beolvasni a mentett felhasználói adatokat
const initialUser: Felhasznalo | null = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData")!)
  : null;

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  updateUserData: async () => false,
  refreshUserData: async () => {},
  caloriesConsumed: 0,
  setCaloriesConsumed: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Felhasznalo | null>(initialUser);
  // Ha nincs elmentett adat, akkor loading true, egyébként rögtön renderelhetünk
  const [loading, setLoading] = useState<boolean>(initialUser ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState<number>(0);

  // Frissíti a felhasználói adatokat a backendről és elmenti a localStorage-be is
  const refreshUserData = useCallback(async () => {
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
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        setError("Hiba történt a felhasználói adatok lekérésekor.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Hiba történt a felhasználói adatok lekérésekor.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Csak akkor frissítünk, ha nincs elmentett adat
  useEffect(() => {
    if (!user) {
      refreshUserData();
    }
  }, [user, refreshUserData]);

  const updateUserData = useCallback(async (userData: Partial<Felhasznalo>): Promise<boolean> => {
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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        // Ha van már meglévő user, akkor összeolvasztjuk az új adatokkal
        const updatedUser = { ...user, ...userData } as Felhasznalo;
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
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
  }, [user]);
  

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error, 
      updateUserData, 
      refreshUserData,
      caloriesConsumed,
      setCaloriesConsumed
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
