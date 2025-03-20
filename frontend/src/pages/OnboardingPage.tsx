import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OnBoardingPage.css";
import {useUser} from "../context/UserContext"
import { Felhasznalo } from "../context/UserContext";

interface NumberStep {
  field: string;
  label: string;
  type: "number";
  placeholder?: string;
  value: number | undefined;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  min?: number;
  max?: number;
  errorMessage?: string;
}

interface SelectStep {
  field: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage?: string;
}

interface DateStep {
  field: string;
  label: string;
  type: "date";
  placeholder?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  min?: string;
  max?: string;
  errorMessage?: string;
}

type Step = NumberStep | SelectStep | DateStep;

const OnBoardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserData, refreshUserData } = useUser();

  // Állapotok (weight, height, age, gender, activityLevel, goalWeight, goalDate) – marad ugyanaz
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<number | undefined>(undefined);
  const [goalDate, setGoalDate] = useState<string>("");

  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Minimális és maximális értékek
  const MIN_WEIGHT = 30;
  const MAX_WEIGHT = 300;
  const MIN_HEIGHT = 100;
  const MAX_HEIGHT = 250;
  const MIN_AGE = 13;
  const MAX_AGE = 110;
  const MIN_GOAL_WEIGHT = 30;
  const MAX_GOAL_WEIGHT = 300;

  // Mai dátum és minimális dátum beállítása (legfeljebb 2 év a múltban)
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 2);
  const minDateStr = minDate.toISOString().split('T')[0];
  
  // Maximális céldátum (maximum 5 év a jövőben)
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Betöltjük a felhasználói adatokat, ha elérhetők
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setWeight(data.weight ?? undefined);
          setHeight(data.height ?? undefined);
          setAge(data.age ?? undefined);
          setGender(data.gender ?? "");
          setActivityLevel(data.activityLevel ?? "");
          setGoalWeight(data.goalWeight ?? undefined);
          // Ha a dátum ISO formátumú (YYYY-MM-DDT...), akkor substring segítségével kinyerjük a dátumot
          setGoalDate(data.goalDate ? data.goalDate.substring(0, 10) : "");
        } else {
          console.error("Hiba a felhasználói adatok lekérésekor:", response.status);
        }
      } catch (error) {
        console.error("Hiba a felhasználói adatok betöltésekor:", error);
      }
    };

    fetchUserData();
  }, []);

  const steps: Step[] = [
    {
      field: "weight",
      label: "Súly (kg)",
      type: "number",
      placeholder: "Pl. 70",
      value: weight,
      setValue: setWeight,
      min: MIN_WEIGHT,
      max: MAX_WEIGHT,
      errorMessage: `A súlynak ${MIN_WEIGHT} és ${MAX_WEIGHT} kg között kell lennie.`,
    },
    {
      field: "height",
      label: "Magasság (cm)",
      type: "number",
      placeholder: "Pl. 170",
      value: height,
      setValue: setHeight,
      min: MIN_HEIGHT,
      max: MAX_HEIGHT,
      errorMessage: `A magasságnak ${MIN_HEIGHT} és ${MAX_HEIGHT} cm között kell lennie.`,
    },
    {
      field: "age",
      label: "Kor (év)",
      type: "number",
      placeholder: "Pl. 30",
      value: age,
      setValue: setAge,
      min: MIN_AGE,
      max: MAX_AGE,
      errorMessage: `Az életkornak ${MIN_AGE} és ${MAX_AGE} év között kell lennie.`,
    },
    {
      field: "gender",
      label: "Nem",
      type: "select",
      options: [
        { value: "", label: "Válassz..." },
        { value: "Male", label: "Férfi" },
        { value: "Female", label: "Nő" },
      ],
      value: gender,
      setValue: setGender,
      errorMessage: "Kérlek, válassz nemet!",
    },
    {
      field: "activityLevel",
      label: "Aktivitási szint",
      type: "select",
      options: [
        { value: "", label: "Válassz..." },
        { value: "Sedentary", label: "Ülő" },
        { value: "Light", label: "Enyhén aktív" },
        { value: "Moderate", label: "Közepesen aktív" },
        { value: "Active", label: "Aktív" },
        { value: "VeryActive", label: "Nagyon aktív" },
      ],
      value: activityLevel,
      setValue: setActivityLevel,
      errorMessage: "Kérlek, válassz aktivitási szintet!",
    },
    {
      field: "goalWeight",
      label: "Cél testsúly (kg)",
      type: "number",
      placeholder: "Pl. 65",
      value: goalWeight,
      setValue: setGoalWeight,
      min: MIN_GOAL_WEIGHT,
      max: MAX_GOAL_WEIGHT,
      errorMessage: `A cél testsúlynak ${MIN_GOAL_WEIGHT} és ${MAX_GOAL_WEIGHT} kg között kell lennie.`,
    },
    {
      field: "goalDate",
      label: "Céldátum",
      type: "date",
      placeholder: "Válassz egy dátumot",
      value: goalDate,
      setValue: setGoalDate,
      min: today.toISOString().split('T')[0], // Mai naptól kezdve a jövőben
      max: maxDateStr,
      errorMessage: `A céldátumnak a mai és ${maxDate.getFullYear()}.${maxDate.getMonth() + 1}.${maxDate.getDate()} között kell lennie.`,
    },
  ];

  const totalSteps = steps.length;

  // Validálja az adott lépésben lévő adatot
  const validateCurrentStep = (): boolean => {
    const currentData = steps[currentStep];
    if (currentData.type === "number") {
      if (currentData.value === undefined || currentData.value === 0) {
        setErrorMsg("Kérlek, töltsd ki a mezőt!");
        return false;
      }
      
      // Szám értékhatárok ellenőrzése
      if (currentData.min !== undefined && currentData.value < currentData.min) {
        setErrorMsg(currentData.errorMessage || `Az érték nem lehet kisebb, mint ${currentData.min}!`);
        return false;
      }
      
      if (currentData.max !== undefined && currentData.value > currentData.max) {
        setErrorMsg(currentData.errorMessage || `Az érték nem lehet nagyobb, mint ${currentData.max}!`);
        return false;
      }
    } else if (currentData.type === "select") {
      if (currentData.value === "") {
        setErrorMsg(currentData.errorMessage || "Kérlek, válassz egy értéket!");
        return false;
      }
    } else if (currentData.type === "date") {
      if (currentData.value === "") {
        setErrorMsg(currentData.errorMessage || "Kérlek, válassz egy dátumot!");
        return false;
      }

      const selectedDate = new Date(currentData.value);
      
      // Dátum értékhatárok ellenőrzése
      if (currentData.field === "goalDate") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          setErrorMsg("A céldátum nem lehet a múltban!");
          return false;
        }
        
        if (currentData.max) {
          const maxDate = new Date(currentData.max);
          if (selectedDate > maxDate) {
            setErrorMsg(currentData.errorMessage || `A dátum nem lehet később, mint ${currentData.max}!`);
            return false;
          }
        }
      }
    }

    // Speciális ellenőrzések
    if (currentData.field === "goalWeight" && weight !== undefined && goalWeight !== undefined) {
      const weightDiff = Math.abs(goalWeight - weight);
      if (weightDiff > weight * 0.5) {
        setErrorMsg(`A célsúly nem térhet el több mint 50%-kal a jelenlegi súlytól (${weight} kg).`);
        return false;
      }
    }

    return true;
  };

  const validateAllSteps = (): boolean => {
    // Ellenőrizzük az összes mezőt
    if (!weight || !height || !age || !gender || !activityLevel || !goalWeight || goalDate === "") {
      setErrorMsg("Kérlek, tölts ki minden mezőt!");
      return false;
    }

    // Ellenőrizzük a BMI-t (túl alacsony vagy magas lehet irreális)
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      if (bmi < 13) {
        setErrorMsg("A megadott súly és magasság kombinációja irreálisan alacsony BMI-t eredményez!");
        return false;
      }
      if (bmi > 60) {
        setErrorMsg("A megadott súly és magasság kombinációja irreálisan magas BMI-t eredményez!");
        return false;
      }
    }

    // Ellenőrizzük a céldátumot
    const goalDateObj = new Date(goalDate);
    const today = new Date();
    
    // Minimális célidő ellenőrzése (legalább 1 hónap)
    const minGoalDate = new Date(today);
    minGoalDate.setMonth(today.getMonth() + 1);
    
    if (goalDateObj < minGoalDate && Math.abs(goalWeight! - weight!) > 5) {
      setErrorMsg("A céldátumnak legalább egy hónappal a jövőben kell lennie jelentős súlyváltozás esetén!");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setErrorMsg("");
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setErrorMsg("");
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      return;
    }
    
    setErrorMsg("");
  
    // Feltételezzük, hogy a user nem null, mert az onboarding után már be kell legyen jelentkezve
    const currentUser = JSON.parse(localStorage.getItem("userData") || "{}") as Felhasznalo;
    
    const updatedData: Felhasznalo = {
      ...currentUser,
      weight,
      height,
      age,
      gender,
      activityLevel,
      goalWeight,
      goalDate,
      isProfileComplete: true,
    };
  
    const success = await updateUserData(updatedData);
    
    if (success) {
      localStorage.removeItem("caloriesData");
      await refreshUserData();
      navigate("/dashboard");
    } else {
      setErrorMsg("Hiba történt a profil frissítésekor.");
    }
  };
  
  

  const renderCurrentStep = () => {
    const step = steps[currentStep];
    if (step.type === "number") {
      return (
        <div className="form-group">
          <label htmlFor={step.field}>{step.label}</label>
          <input
            type="number"
            id={step.field}
            placeholder={step.placeholder}
            value={step.value ?? ""}
            min={step.min}
            max={step.max}
            onChange={(e) =>
              (step.setValue as React.Dispatch<React.SetStateAction<number | undefined>>)(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          />
          <small className="field-hint">
            {step.min !== undefined && step.max !== undefined
              ? `Érvényes értékek: ${step.min} - ${step.max}`
              : ""}
          </small>
        </div>
      );
    } else if (step.type === "select") {
      return (
        <div className="form-group">
          <label htmlFor={step.field}>{step.label}</label>
          <select
            id={step.field}
            value={step.value}
            onChange={(e) =>
              (step.setValue as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
            }
          >
            {step.options!.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (step.type === "date") {
      return (
        <div className="form-group">
          <label htmlFor={step.field}>{step.label}</label>
          <input
            type="date"
            id={step.field}
            placeholder={step.placeholder}
            value={step.value}
            min={step.min}
            max={step.max}
            onChange={(e) =>
              (step.setValue as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
            }
          />
          <small className="field-hint">
            {step.field === "goalDate" ? "Válassz egy jövőbeli dátumot (max. 5 éven belül)" : ""}
          </small>
        </div>
      );
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h2>Onboarding – Személyre szabás</h2>
        <p className="onboarding-intro">
          Kérjük, add meg az adataidat lépésről lépésre!
        </p>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className="step-indicator">
          Lépés {currentStep + 1} / {totalSteps}
        </p>
        <div className="onboarding-form">{renderCurrentStep()}</div>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        <div className="button-group">
          <button onClick={() => navigate("/")} className="onboarding-back">
            Vissza a kezdőlapra
          </button>
          {currentStep > 0 && (
            <button className="onboarding-submit" onClick={handleBack}>
              Vissza
            </button>
          )}
          <button className="onboarding-submit" onClick={handleNext}>
            {currentStep === totalSteps - 1 ? "Mentés" : "Következő"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;