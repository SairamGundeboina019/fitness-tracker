import React, { useEffect, useState } from "react";

const HealthinessScoreBar = ({ meals, workouts }) => {
  const [todayScore, setTodayScore] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    let calories = 0,
      protein = 0,
      fats = 0,
      mealsCount = 0,
      workoutMinutes = 0;

    meals.forEach((meal) => {
      const date = meal.meal_time?.slice(0, 10);
      if (date === today) {
        calories += Number(meal.calories || 0);
        protein += Number(meal.protein || 0);
        fats += Number(meal.fats || 0);
        mealsCount += 1;
      }
    });

    workouts.forEach((workout) => {
      const date = workout.workout_date?.slice(0, 10);
      if (date === today) {
        workoutMinutes += Number(workout.duration_minutes || 0);
      }
    });

    let score = 0;
    if (mealsCount > 0) score += 20;
    if (calories >= 1500 && calories <= 2500) score += 20;
    if (protein >= 60) score += 20;
    if (fats <= 80) score += 15;
    if (workoutMinutes >= 30) score += 25;

    let feedback = "Keep improving!";
    if (score >= 85) feedback = "Excellent health day! 💪";
    else if (score >= 65) feedback = "Good day overall 👍";
    else if (score >= 45) feedback = "Mixed habits. Room to improve.";
    else feedback = "Unhealthy day ⚠️";

    setTodayScore({
      date: today.slice(5),
      score,
      feedback,
    });
  }, [meals, workouts]);

  if (!todayScore) return null;

  const gradient =
    todayScore.score >= 85
      ? "from-green-400 via-blue-400 to-green-500"
      : todayScore.score >= 65
      ? "from-yellow-300 via-orange-300 to-yellow-400"
      : "from-red-300 via-pink-300 to-red-400";

  return (
    <div className="bg-white shadow p-6 rounded my-12">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Today’s Healthiness Score
      </h2>

      <div className="flex justify-between mb-1 text-sm text-gray-600">
        <span>{todayScore.date}</span>
        <span>{todayScore.score}/100</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient}`}
          style={{ width: `${todayScore.score}%` }}
        ></div>
      </div>

      <p className="text-xs text-gray-500 mt-2 italic">{todayScore.feedback}</p>
    </div>
  );
};

export default HealthinessScoreBar;
