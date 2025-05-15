import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MacroChart = ({ meals }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const past7 = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    const map = {};
    past7.forEach((date) => {
      map[date] = {
        date: date.slice(5),
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      };
    });

    meals.forEach((meal) => {
      const date = meal.meal_time?.slice(0, 10);
      if (map[date]) {
        map[date].calories += Number(meal.calories || 0);
        map[date].protein += Number(meal.protein || 0);
        map[date].carbs += Number(meal.carbs || 0);
        map[date].fats += Number(meal.fats || 0);
      }
    });

    setData(Object.values(map));
  }, [meals]);

  return (
    <div className="bg-white shadow p-6 rounded my-12">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Full Macro Intake This Week
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="calories" fill="#60A5FA" name="Calories" />
          <Bar dataKey="protein" fill="#34D399" name="Protein" />
          <Bar dataKey="carbs" fill="#FBBF24" name="Carbs" />
          <Bar dataKey="fats" fill="#F87171" name="Fats" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroChart;
