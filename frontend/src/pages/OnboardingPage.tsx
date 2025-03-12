import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OnBoardingPage.css";

interface NumberStep {
  field: string;
  label: string;
  type: "number";
  placeholder?: string;
  value: number | undefined;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface SelectStep {
  field: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

interface DateStep {
  field: string;
  label: string;
  type: "date";
  placeholder?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

type Step = NumberStep | SelectStep | DateStep;

const OnBoardingPage: React.FC = () => {
  const navigate = useNavigate();

  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<number | undefined>(undefined);
  const [goalDate, setGoalDate] = useState<string>("");

  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Új: Betöltjük a felhasználói adatokat, ha elérhetők
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
    },
    {
      field: "height",
      label: "Magasság (cm)",
      type: "number",
      placeholder: "Pl. 170",
      value: height,
      setValue: setHeight,
    },
    {
      field: "age",
      label: "Kor (év)",
      type: "number",
      placeholder: "Pl. 30",
      value: age,
      setValue: setAge,
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
    },
    {
      field: "goalWeight",
      label: "Cél testsúly (kg)",
      type: "number",
      placeholder: "Pl. 65",
      value: goalWeight,
      setValue: setGoalWeight,
    },
    {
      field: "goalDate",
      label: "Céldátum",
      type: "date",
      placeholder: "Válassz egy dátumot",
      value: goalDate,
      setValue: setGoalDate,
    },
  ];

  const totalSteps = steps.length;

  const handleNext = () => {
    const currentData = steps[currentStep];
    if (currentData.type === "number") {
      if (currentData.value === undefined || currentData.value === 0) {
        setErrorMsg("Kérlek, töltsd ki a mezőt!");
        return;
      }
    } else if (currentData.type === "select") {
      if (currentData.value === "") {
        setErrorMsg("Kérlek, válassz egy értéket!");
        return;
      }
    } else if (currentData.type === "date") {
      if (currentData.value === "") {
        setErrorMsg("Kérlek, válassz egy dátumot!");
        return;
      }
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
    if (!weight || !height || !age || !gender || !activityLevel || !goalWeight || goalDate === "") {
      setErrorMsg("Kérlek, tölts ki minden mezőt!");
      return;
    }
    setErrorMsg("");

    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!userId || !token) {
      setErrorMsg("Nincs bejelentkezési információ (userId, authToken). Jelentkezz be újra!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weight,
          height,
          age,
          gender,
          activityLevel,
          goalWeight,
          goalDate,
          isProfileComplete: true,
        }),
      });
      if (response.ok) {
        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        setErrorMsg("Hiba történt: " + errorText);
      }
    } catch (err: any) {
      setErrorMsg("Hálózati hiba: " + err.message);
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
            onChange={(e) =>
              (step.setValue as React.Dispatch<React.SetStateAction<number | undefined>>)(
                Number(e.target.value)
              )
            }
          />
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
            onChange={(e) =>
              (step.setValue as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
            }
          />
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
          <button onClick={() => navigate("/")} className="onboarding-back">Vissza a kezdőlapra</button>
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