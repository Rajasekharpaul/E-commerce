const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// GET /api/users (admin only)
const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { password: 0 });
  res.json(users);
});

module.exports = { listUsers };


