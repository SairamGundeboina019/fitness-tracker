import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">
        <Link to="/">FitTrack</Link>
      </h1>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/add-meal">Add Meal</Link>
            <Link to="/add-workout">Add Workout</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
