const { verifyToken } = require("../utils/jwt");
const { ApiError } = require("./errorHandler");

// Protects any route it's applied to. Expects `Authorization: Bearer <token>`.
// On success, attaches the decoded payload as req.doctor for downstream
// handlers to use (e.g. stamping doctor_name on a new report).
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Missing or malformed Authorization header");
  }

  try {
    const payload = verifyToken(token);
    req.doctor = payload;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
}

module.exports = { requireAuth };
