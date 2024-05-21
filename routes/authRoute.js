const express = require("express");
const { loginUser, getLoggedInUser } = require("../controllers/authController");
const { validateLogin } = require("../middlewares/validation");
const { isUser, decodeUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", validateLogin, loginUser);
router.get("/user", decodeUser, getLoggedInUser);

module.exports = router;
