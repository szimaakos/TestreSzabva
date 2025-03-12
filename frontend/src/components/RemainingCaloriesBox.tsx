import React, { useEffect, useState } from "react";
import "./RemainingCaloriesBox.css";

interface RemainingCaloriesBoxProps {
  recommended: number;
  consumed: number;
  weeklyRecommended?: number; 
  weeklyConsumed?: number;
  weeklyRemaining?: number;
}

const RemainingCaloriesBox: React.FC<RemainingCaloriesBoxProps> = ({
  recommended,
  consumed,
  weeklyRecommended,
  weeklyConsumed,
  weeklyRemaining
}) => {
  const [animateDaily, setAnimateDaily] = useState(false);
  const [animateWeekly, setAnimateWeekly] = useState(false);
  
  // Safely calculate values to prevent NaN or infinity
  const safeRecommended = recommended > 0 ? recommended : 1;
  const safeConsumed = isNaN(consumed) ? 0 : consumed;
  const remaining = Math.max(0, safeRecommended - safeConsumed);
  
  // Calculate percentages with safety checks
  const dailyPercentage = Math.min(100, Math.round((safeConsumed / safeRecommended) * 100)) || 0;
  
  const safeWeeklyRecommended = (weeklyRecommended && weeklyRecommended > 0) ? weeklyRecommended : 1;
  const safeWeeklyConsumed = (weeklyConsumed !== undefined && !isNaN(weeklyConsumed)) ? weeklyConsumed : 0;
  const weeklyPercentage = Math.min(100, Math.round((safeWeeklyConsumed / safeWeeklyRecommended) * 100)) || 0;

  // Determine color based on percentage of calories consumed
  const getColor = (percent: number) => {
    if (percent < 75) return "#4CAF50"; // Green
    if (percent < 90) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  };

  const dailyColor = getColor(dailyPercentage);
  const weeklyColor = getColor(weeklyPercentage);
  
  // Trigger animations after component mounts
  useEffect(() => {
    // Small delay to ensure CSS transitions work properly
    const timer1 = setTimeout(() => setAnimateDaily(true), 100);
    const timer2 = setTimeout(() => setAnimateWeekly(true), 300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="calories-boxes-container">
      <div className="calories-box daily-calories">
        <h2>Napi kalóriák</h2>
        <div className="calories-progress">
          <div className="progress-bar">
          <div
  className="progress-fill"
  style={{ 
    width: animateDaily ? `${dailyPercentage}%` : '0%', 
    '--main-color': dailyColor,
    '--main-color-light': `${dailyColor}99`  
  } as React.CSSProperties}
></div>

          </div>
          <div className="progress-text">
            <span>{dailyPercentage}%</span>
          </div>
        </div>
        
        <div className="calories-info">
          <div className="calories-item">
            <span className="info-label">Cél:</span>
            <span className="info-value">{safeRecommended.toLocaleString()} kcal</span>
          </div>
          <div className="calories-item">
            <span className="info-label">Elfogyasztva:</span>
            <span className="info-value">{safeConsumed.toLocaleString()} kcal</span>
          </div>
          <div className="calories-item">
            <span className="info-label">Hátralévő:</span>
            <span className="info-value">{remaining.toLocaleString()} kcal</span>
          </div>
        </div>
      </div>

      {(weeklyRecommended !== undefined && weeklyRemaining !== undefined) && (
        <div className="calories-box weekly-calories">
          <h2>Heti kalóriák</h2>
          <div className="calories-progress">
            <div className="progress-bar">
            <div
  className="progress-fill"
  style={{ 
    width: animateWeekly ? `${weeklyPercentage}%` : '0%', 
    '--main-color': weeklyColor,
    '--main-color-light': `${weeklyColor}99`
  } as React.CSSProperties}
></div>
            </div>
            <div className="progress-text">
              <span>{weeklyPercentage}%</span>
            </div>
          </div>
          
          <div className="calories-info">
            <div className="calories-item">
              <span className="info-label">Heti cél:</span>
              <span className="info-value">{safeWeeklyRecommended.toLocaleString()} kcal</span>
            </div>
            <div className="calories-item">
              <span className="info-label">Elfogyasztva:</span>
              <span className="info-value">{safeWeeklyConsumed.toLocaleString()} kcal</span>
            </div>
            <div className="calories-item">
              <span className="info-label">Hátralévő:</span>
              <span className="info-value">
                {(weeklyRemaining !== undefined ? weeklyRemaining : Math.max(0, safeWeeklyRecommended - safeWeeklyConsumed)).toLocaleString()} kcal
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemainingCaloriesBox;