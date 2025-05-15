import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const AddWorkout = () => {
  const [form, setForm] = useState({
    workout_name: "",
    type: "",
    duration_minutes: "",
  });
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editData, setEditData] = useState(null);

  const fallbackImage = "/default-workout.jpg";

  useEffect(() => {
    fetchAllWorkouts();
  }, []);

  const fetchAllWorkouts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/workouts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWorkouts(res.data.reverse());
    } catch (err) {
      console.error("Error fetching workouts:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/workouts", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWorkouts([res.data, ...workouts]);
      setForm({ workout_name: "", type: "", duration_minutes: "" });
    } catch (err) {
      console.error("Error adding workout:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWorkouts(workouts.filter((w) => w.id !== id));
      setSelectedWorkout(null);
    } catch (err) {
      console.error("Error deleting workout:", err);
    }
  };

  const handleModalEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/workouts/${editData.id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setWorkouts(workouts.map((w) => (w.id === editData.id ? res.data : w)));
      setSelectedWorkout(null);
    } catch (err) {
      console.error("Error updating workout:", err);
    }
  };

  const groupByWeek = (items) => {
    const groups = {};
    items.forEach((item) => {
      const week = dayjs(item.workout_time)
        .startOf("week")
        .format("YYYY-[W]WW");
      if (!groups[week]) groups[week] = [];
      groups[week].push(item);
    });
    return groups;
  };

  const groupedWorkouts = groupByWeek(workouts);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-white border p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-green-600 mb-6">
            Log a New Workout
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="workout_name"
              placeholder="Workout Name"
              value={form.workout_name}
              onChange={handleChange}
              className="bg-gray-100 border px-4 py-2 w-full rounded"
              required
            />
            <input
              name="type"
              placeholder="Type (e.g. Cardio)"
              value={form.type}
              onChange={handleChange}
              className="bg-gray-100 border px-4 py-2 w-full rounded"
              required
            />
            <input
              name="duration_minutes"
              type="number"
              placeholder="Duration (min)"
              value={form.duration_minutes}
              onChange={handleChange}
              className="bg-gray-100 border px-4 py-2 w-full rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded font-semibold"
            >
              ➕ Add Workout
            </button>
          </form>
        </div>

        {/* Workout Cards */}
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-6">
            Your Workouts (Grouped by Week)
          </h2>
          {Object.keys(groupedWorkouts).map((weekKey) => (
            <div key={weekKey} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Week of{" "}
                {dayjs(groupedWorkouts[weekKey][0].workout_time)
                  .startOf("week")
                  .format("MMM D, YYYY")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groupedWorkouts[weekKey].map((w) => (
                  <div
                    key={w.id}
                    onClick={() => {
                      setSelectedWorkout(w);
                      setEditData(w);
                    }}
                    className="relative cursor-pointer rounded-xl bg-white border shadow-sm hover:shadow-md overflow-hidden"
                  >
                    <div
                      className="h-24 bg-cover bg-center"
                      style={{ backgroundImage: `url(${fallbackImage})` }}
                    ></div>
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                      {dayjs(w.workout_time).format("ddd D")}
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-bold text-gray-800 truncate">
                        {w.workout_name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        ⏱ {w.duration_minutes} minutes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <button
              onClick={() => setSelectedWorkout(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">
              Edit {editData.workout_name}
            </h2>
            <div className="space-y-3">
              <input
                name="workout_name"
                value={editData.workout_name}
                onChange={(e) =>
                  setEditData({ ...editData, workout_name: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
              <input
                name="type"
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
              <input
                name="duration_minutes"
                value={editData.duration_minutes}
                onChange={(e) =>
                  setEditData({ ...editData, duration_minutes: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
            </div>
            <div className="mt-5 flex justify-between">
              <button
                onClick={handleModalEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

export default AddWorkout;
