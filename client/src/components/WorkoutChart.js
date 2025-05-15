import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const WorkoutChart = ({ workouts }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/workouts/weekly-summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const today = new Date();
        const past7 = [...Array(7)].map((_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().slice(0, 10);
        });

        const workoutMap = {};
        res.data.forEach((row) => {
          workoutMap[row.date] = Number(row.total_duration);
        });

        const formatted = past7.map((date) => ({
          date: date.slice(5),
          minutes: workoutMap[date] || 0,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Workout chart error:", err);
      }
    };

    fetchWorkouts();
  }, [workouts]); // ✅ RUNS EVERY TIME workouts state changes

  return (
    <div className="bg-white shadow p-6 rounded my-12">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Workout Duration This Week
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit=" min" />
          <Tooltip />
          <Bar dataKey="minutes" fill="#34D399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutChart;
