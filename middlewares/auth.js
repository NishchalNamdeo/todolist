const jwt = require("jsonwebtoken");

// Middleware to check if the user is logged in using a cookie
exports.isLoggedin = (req, res, next) => {
  // Get the token from cookies (ensure 'cookie-parser' middleware is set up)
  const token = req.cookies.token;

  // Check if the token is not present
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info in req.id
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Invalid token.", error: error.message });
  }
};