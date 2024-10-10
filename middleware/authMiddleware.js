require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * authMiddleware
 *
 * Middleware that verifies the presence of a valid JWT authentication token
 * in the Authorization header of the request. If the token is valid, it
 * assigns the user object to the request object and calls next(). Otherwise,
 * it returns a 401 error with a message indicating that authorization is
 * denied.
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware to call in the stack
 */
function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(402).json({
      error: err.message,
    });
  }
}
module.exports = authMiddleware;
