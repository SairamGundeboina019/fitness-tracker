import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        form
      );
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-green-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="bg-white p-10 rounded-2xl shadow-2xl w-full space-y-6"
        >
          <h2 className="text-4xl font-extrabold text-center text-green-700">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Enter your credentials to continue your fitness journey.
          </p>
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-xs text-gray-500 hover:text-gray-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded w-full font-semibold shadow-lg"
          >
            Login
          </motion.button>
          {message && (
            <motion.p
              className="text-center text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
          <p className="text-xs text-gray-500 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-green-600 hover:underline">
              Sign up
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
