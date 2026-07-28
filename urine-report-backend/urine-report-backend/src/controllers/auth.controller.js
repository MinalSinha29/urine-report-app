const bcrypt = require("bcryptjs");
const doctorModel = require("../models/doctor.model");
const { signToken } = require("../utils/jwt");
const { ApiError } = require("../middleware/errorHandler");

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const doctor = await doctorModel.findByUsername(username);

  // Same generic message whether the username doesn't exist or the
  // password is wrong — don't leak which one was the problem.
  if (!doctor) {
    throw new ApiError(401, "Invalid username or password");
  }

  const passwordMatches = await bcrypt.compare(password, doctor.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid username or password");
  }

  const token = signToken({
    id: doctor.id,
    name: doctor.name,
    username: doctor.username,
  });

  res.json({
    token,
    doctor: {
      id: doctor.id,
      name: doctor.name,
      username: doctor.username,
      department: doctor.department,
    },
  });
}

async function me(req, res) {
  // req.doctor was attached by the requireAuth middleware after verifying
  // the JWT — this route just confirms the token is still valid and
  // returns fresh doctor details (e.g. after a page reload on the frontend).
  const doctor = await doctorModel.findById(req.doctor.id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res.json({ doctor });
}

module.exports = { login, me };
