const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const mealRoutes = require("./routes/meals");
const workoutRoutes = require("./routes/workouts");

const app = express();
const PORT = process.env.PORT || 10000;

// 🛡️ Proper CORS setup
app.use(
  cors({
    origin: "https://fitness-tracker-client.onrender.com",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
