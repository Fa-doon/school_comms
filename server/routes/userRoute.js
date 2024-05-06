const express = require("express");
const {
  createUser,
  getUserById,
  getStudents,
  getTeachers,
  updateUser,
  deleteUser,
  createRole,
} = require("../controllers/userController");
const { isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(isAdmin);

router.post("/register", createUser);
router.post("/role", createRole);

router.get("/students", getStudents);
router.get("/teachers", getTeachers);
// router.get("/all-users", allUsers);
router.get("/:id", getUserById);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;
