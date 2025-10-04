const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");
const validateToken = require("../middleWare/validateTokenHandler");
const isAdmin = require("../middleWare/isAdmin");
const { listUsers } = require("../controllers/adminUserController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

// Admin: list all users
router.get("/", validateToken, isAdmin, listUsers);

module.exports = router;
