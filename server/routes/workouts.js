const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

// ADD Workout
router.post("/", verifyToken, async (req, res) => {
  const { workout_name, type, duration_minutes } = req.body;
  try {
    const newWorkout = await pool.query(
      `INSERT INTO workouts (user_id, workout_name, type, duration_minutes)
        VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, workout_name, type, duration_minutes]
    );
    res.json(newWorkout.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET Workouts
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM workouts WHERE user_id = $1 ORDER BY workout_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE Workout
router.put("/:id", verifyToken, async (req, res) => {
  const { workout_name, type, duration_minutes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE workouts
        SET workout_name = $1, type = $2, duration_minutes = $3
        WHERE id = $4 AND user_id = $5
        RETURNING *`,
      [workout_name, type, duration_minutes, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Workout not found or not authorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update workout" });
  }
});

// DELETE Workout
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await pool.query(`DELETE FROM workouts WHERE id = $1 AND user_id = $2`, [
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: "Workout deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/workouts/weekly-summary
router.get("/weekly-summary", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT 
          TO_CHAR(workout_time, 'YYYY-MM-DD') as date,
          SUM(duration_minutes) as total_duration
        FROM workouts
        WHERE user_id = $1 AND workout_time >= NOW() - INTERVAL '7 days'
        GROUP BY date
        ORDER BY date ASC
      `,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Weekly workout summary error:", err);
    res.status(500).json({ message: "Failed to get workout data" });
  }
});

module.exports = router;
