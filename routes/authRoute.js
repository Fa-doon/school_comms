const express = require("express");
const { loginUser } = require("../controllers/authController");
const { validateLogin } = require("../middlewares/validation");

const router = express.Router();

router.post("/login", validateLogin, loginUser);

module.exports = router;
