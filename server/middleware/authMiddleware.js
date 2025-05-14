const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // should be second part of "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // <-- we depend on this in the /me route!
    next();
  } catch (err) {
    console.error("Token verify error:", err.message);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
