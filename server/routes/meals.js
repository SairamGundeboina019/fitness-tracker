const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

// POST /api/meals – Add Meal
router.post("/", verifyToken, async (req, res) => {
  const { meal_name, calories, protein, carbs, fats } = req.body;
  try {
    const newMeal = await pool.query(
      `INSERT INTO meals (user_id, meal_name, calories, protein, carbs, fats)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, meal_name, calories, protein, carbs, fats]
    );
    res.json(newMeal.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/meals – View User Meals
router.get("/", verifyToken, async (req, res) => {
  try {
    const meals = await pool.query(
      `SELECT * FROM meals WHERE user_id = $1 ORDER BY meal_time DESC`,
      [req.user.id]
    );
    res.json(meals.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/meals/:id – Delete a Meal
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await pool.query(`DELETE FROM meals WHERE id = $1 AND user_id = $2`, [
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: "Meal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE Meal
router.put("/:id", verifyToken, async (req, res) => {
  const { meal_name, calories, protein, carbs, fats } = req.body;
  try {
    console.log("PUT /api/meals/:id hit with id:", req.params.id); // Debug log

    const result = await pool.query(
      `UPDATE meals SET meal_name = $1, calories = $2, protein = $3, carbs = $4, fats = $5
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [meal_name, calories, protein, carbs, fats, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update meal" });
  }
});

// GET /api/meals/weekly-summary
router.get("/weekly-summary", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        TO_CHAR(meal_time::date, 'YYYY-MM-DD') as date,
        SUM(calories) as total_calories
      FROM meals
      WHERE user_id = $1 AND meal_time >= NOW() - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date ASC
      `,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Weekly summary error:", err);
    res.status(500).json({ message: "Failed to get weekly calorie data" });
  }
});

module.exports = router;
