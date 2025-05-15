import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MacroChart from "../components/MacroChart";
import HealthinessScoreBar from "../components/HealthinessScoreBar";
import WorkoutChart from "../components/WorkoutChart";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [editMealId, setEditMealId] = useState(null);
  const [editForm, setEditForm] = useState({
    meal_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [editWorkoutId, setEditWorkoutId] = useState(null);
  const [editWorkoutForm, setEditWorkoutForm] = useState({
    workout_name: "",
    type: "",
    duration_minutes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (err) {
        navigate("/login");
      }
    };

    const fetchMeals = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/meals`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMeals(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/workouts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWorkouts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    fetchMeals();
    fetchWorkouts();
  }, [navigate]);

  const totalCalories = meals.reduce(
    (sum, meal) => sum + Number(meal.calories),
    0
  );
  const totalWorkouts = workouts.length;
  const totalWorkoutMinutes = workouts.reduce(
    (sum, w) => sum + Number(w.duration_minutes),
    0
  );

  const handleMealDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/meals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMeals(meals.filter((meal) => meal.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleWorkoutDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/workouts/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setWorkouts(workouts.filter((workout) => workout.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMealEdit = (meal) => {
    setEditMealId(meal.id);
    setEditForm({
      meal_name: meal.meal_name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
    });
  };

  const handleWorkoutEdit = (workout) => {
    setEditWorkoutId(workout.id);
    setEditWorkoutForm({
      workout_name: workout.workout_name,
      type: workout.type,
      duration_minutes: workout.duration_minutes,
    });
  };

  const handleMealUpdate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/meals/${id}`,
        {
          meal_name: editForm.meal_name,
          calories: Number(editForm.calories),
          protein: Number(editForm.protein),
          carbs: Number(editForm.carbs),
          fats: Number(editForm.fats),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMeals(meals.map((m) => (m.id === id ? res.data : m)));
      setEditMealId(null);
    } catch (err) {
      console.error("Meal update failed:", err.response?.data || err.message);
      alert("Meal update failed. Check the console.");
    }
  };

  const handleWorkoutUpdate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/workouts/${id}`,
        {
          workout_name: editWorkoutForm.workout_name,
          type: editWorkoutForm.type,
          duration_minutes: Number(editWorkoutForm.duration_minutes),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkouts(workouts.map((w) => (w.id === id ? res.data : w)));
      setEditWorkoutId(null);
    } catch (err) {
      console.error(
        "Workout update failed:",
        err.response?.data || err.message
      );
      alert("Workout update failed. Check the console.");
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleWorkoutEditChange = (e) => {
    setEditWorkoutForm({
      ...editWorkoutForm,
      [e.target.name]: e.target.value,
    });
  };

  return <>{/* everything else stays untouched */}</>;
};

export default Dashboard;
