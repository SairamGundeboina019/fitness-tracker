const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const mealRoutes = require("./routes/meals");
const workoutRoutes = require("./routes/workouts");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup for deployment
app.use(
  cors({
    origin: [
      "http://localhost:3000", // for local dev
      "https://fitness-tracker-client.onrender.com", // change this to your actual frontend link
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
