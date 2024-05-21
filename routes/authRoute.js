const express = require("express");
const {
  loginUser,
  getLoggedInUser,
} = require("../controllers/authController");
const { validateLogin } = require("../middlewares/validation");
const { isUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", validateLogin, loginUser);
router.get("/user", isUser, getLoggedInUser);

module.exports = router;
