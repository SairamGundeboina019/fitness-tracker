import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const AddMeal = () => {
  const [form, setForm] = useState({
    meal_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [lastMeal, setLastMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    getLastMeal();
    fetchAllMeals();
  }, []);

  const getLastMeal = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = res.data;
      if (data.length > 0) setLastMeal(data[data.length - 1]);
    } catch (err) {
      console.error("Error fetching last meal:", err);
    }
  };

  const fetchAllMeals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMeals(res.data.reverse());
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  const handleUseLastMeal = () => {
    if (lastMeal) setForm({ ...lastMeal });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/meals", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMeals([res.data, ...meals]);
      setForm({
        meal_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
      });
    } catch (err) {
      console.error("Error adding meal:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/meals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMeals(meals.filter((meal) => meal.id !== id));
      setSelectedMeal(null);
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  const handleModalEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/meals/${editData.id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMeals(meals.map((m) => (m.id === editData.id ? res.data : m)));
      setSelectedMeal(null);
    } catch (err) {
      console.error("Error updating meal:", err);
    }
  };

  const getInsight = (meal) => {
    if (!meal) return "";
    if (meal.protein > 30) return "💪 High-protein meal!";
    if (meal.calories > 800) return "🔥 High-calorie intake.";
    if (meal.fats > 60) return "⚠️ High in fats.";
    return "✅ Balanced meal.";
  };

  const fallbackImage = "/default-meal.jpg";

  const groupByWeek = (meals) => {
    const groups = {};
    meals.forEach((meal) => {
      const week = dayjs(meal.meal_time).startOf("week").format("YYYY-[W]WW");
      if (!groups[week]) groups[week] = [];
      groups[week].push(meal);
    });
    return groups;
  };

  const groupedMeals = groupByWeek(meals);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white border p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            Log a New Meal
          </h1>
          {lastMeal && (
            <button
              onClick={handleUseLastMeal}
              className="mb-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
            >
              Use Last Meal: {lastMeal.meal_name}
            </button>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="meal_name"
              placeholder="Meal Name"
              value={form.meal_name}
              onChange={handleChange}
              className="bg-gray-100 border px-4 py-2 w-full rounded"
              required
            />
            <input
              name="calories"
              type="number"
              placeholder="Calories"
              value={form.calories}
              onChange={handleChange}
              className="bg-gray-100 border px-4 py-2 w-full rounded"
              required
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                name="protein"
                type="number"
                placeholder="Protein"
                value={form.protein}
                onChange={handleChange}
                className="bg-gray-100 border px-2 py-2 rounded"
              />
              <input
                name="carbs"
                type="number"
                placeholder="Carbs"
                value={form.carbs}
                onChange={handleChange}
                className="bg-gray-100 border px-2 py-2 rounded"
              />
              <input
                name="fats"
                type="number"
                placeholder="Fats"
                value={form.fats}
                onChange={handleChange}
                className="bg-gray-100 border px-2 py-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
            >
              ➕ Add Meal
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Your Meals (Grouped by Week)
          </h2>
          {Object.keys(groupedMeals).map((weekKey) => (
            <div key={weekKey} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Week of{" "}
                {dayjs(groupedMeals[weekKey][0].meal_time)
                  .startOf("week")
                  .format("MMM D, YYYY")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groupedMeals[weekKey].map((meal) => (
                  <div
                    key={meal.id}
                    onClick={() => {
                      setSelectedMeal(meal);
                      setEditData(meal);
                    }}
                    className="relative cursor-pointer rounded-xl bg-white border shadow-sm hover:shadow-md overflow-hidden"
                  >
                    <div
                      className="bg-gray-100 h-24"
                      style={{
                        backgroundImage: `url(${fallbackImage})`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow">
                      {dayjs(meal.meal_time).format("ddd D")}
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-bold text-gray-800 truncate">
                        {meal.meal_name}
                      </h4>
                      <div className="text-xs text-gray-600">
                        <p>🔥 {meal.calories} cal</p>
                        <p>🍗 {meal.protein}g protein</p>
                        <p>🍞 {meal.carbs}g carbs</p>
                        <p>🧈 {meal.fats}g fats</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <button
              onClick={() => setSelectedMeal(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">
              Edit {editData.meal_name}
            </h2>
            <div className="space-y-3">
              <input
                name="meal_name"
                value={editData.meal_name}
                onChange={(e) =>
                  setEditData({ ...editData, meal_name: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
              <input
                name="calories"
                value={editData.calories}
                onChange={(e) =>
                  setEditData({ ...editData, calories: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
              <input
                name="protein"
                value={editData.protein}
                onChange={(e) =>
                  setEditData({ ...editData, protein: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
              <input
                name="carbs"
                value={editData.carbs}
                onChange={(e) =>
                  setEditData({ ...editData, carbs: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
              <input
                name="fats"
                value={editData.fats}
                onChange={(e) =>
                  setEditData({ ...editData, fats: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
            </div>
            <p className="mt-3 text-sm italic text-blue-500">
              {getInsight(editData)}
            </p>
            <div className="mt-5 flex justify-between">
              <button
                onClick={handleModalEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => handleDelete(editData.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMeal;
