const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const pool = require("../db");

//Post api/auth/register
router.post("/register", registerUser);

//Post /api/auth/login
router.post("/login", loginUser);

router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("Decoded user from token:", req.user); // Add this
    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error("ERROR in /me route:", err.message); // Log exact issue
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
