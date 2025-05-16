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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    setEditWorkoutForm({ ...editWorkoutForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="px-8 pt-20 pb-8 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
      <p className="text-gray-700 mb-6">Email: {user?.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Meals Logged
          </h2>
          <p className="text-2xl font-bold text-blue-600">{meals.length}</p>
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Calories Tracked
          </h2>
          <p className="text-2xl font-bold text-red-600">
            {totalCalories} kcal
          </p>
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Workouts Completed
          </h2>
          <p className="text-2xl font-bold text-green-600">
            {totalWorkouts} ({totalWorkoutMinutes} min)
          </p>
        </div>
      </div>
      <HealthinessScoreBar meals={meals} workouts={workouts} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 my-12">
        <MacroChart meals={meals} />
        <WorkoutChart workouts={workouts} />
      </div>

      <div className="text-sm text-gray-500 mb-12">
        Future dashboard features: charts, weekly progress, goal tracking,
        calories burned, macro breakdowns, etc.
      </div>

      {/* MEALS LIST */}
      <div className="my-12">
        <h2 className="text-xl font-bold mb-4">My Meals</h2>
        {meals.length === 0 ? (
          <p className="text-gray-500">No meals logged yet.</p>
        ) : (
          <ul className="space-y-3">
            {meals.map((meal) => (
              <li key={meal.id} className="border p-4 rounded">
                {editMealId === meal.id ? (
                  <div className="space-y-2">
                    <input
                      name="meal_name"
                      value={editForm.meal_name}
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        name="calories"
                        value={editForm.calories}
                        onChange={handleEditChange}
                        placeholder="Calories"
                        className="border p-1"
                      />
                      <input
                        name="protein"
                        value={editForm.protein}
                        onChange={handleEditChange}
                        placeholder="Protein"
                        className="border p-1"
                      />
                      <input
                        name="carbs"
                        value={editForm.carbs}
                        onChange={handleEditChange}
                        placeholder="Carbs"
                        className="border p-1"
                      />
                      <input
                        name="fats"
                        value={editForm.fats}
                        onChange={handleEditChange}
                        placeholder="Fats"
                        className="border p-1"
                      />
                    </div>
                    <div className="space-x-2 mt-2">
                      <button
                        onClick={() => handleMealUpdate(meal.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditMealId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{meal.meal_name}</p>
                      <p className="text-sm text-gray-600">
                        Calories: {meal.calories} | Protein: {meal.protein}g |
                        Carbs: {meal.carbs}g | Fats: {meal.fats}g
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleMealEdit(meal)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMealDelete(meal.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* WORKOUTS LIST */}
      <div className="my-12">
        <h2 className="text-xl font-bold mb-4">My Workouts</h2>
        {workouts.length === 0 ? (
          <p className="text-gray-500">No workouts logged yet.</p>
        ) : (
          <ul className="space-y-3">
            {workouts.map((workout) => (
              <li
                key={workout.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                {editWorkoutId === workout.id ? (
                  <div className="space-y-2 w-full">
                    <input
                      name="workout_name"
                      value={editWorkoutForm.workout_name}
                      onChange={handleWorkoutEditChange}
                      className="border p-1 w-full"
                    />
                    <input
                      name="type"
                      value={editWorkoutForm.type}
                      onChange={handleWorkoutEditChange}
                      placeholder="Type"
                      className="border p-1 w-full"
                    />
                    <input
                      name="duration_minutes"
                      type="number"
                      value={editWorkoutForm.duration_minutes}
                      onChange={handleWorkoutEditChange}
                      placeholder="Duration"
                      className="border p-1 w-full"
                    />
                    <div className="space-x-2 mt-2">
                      <button
                        onClick={() => handleWorkoutUpdate(workout.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditWorkoutId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p className="font-bold">{workout.workout_name}</p>
                      <p className="text-sm text-gray-600">
                        Type: {workout.type} | Duration:{" "}
                        {workout.duration_minutes} min
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleWorkoutEdit(workout)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleWorkoutDelete(workout.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
