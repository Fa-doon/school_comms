const express = require("express");
const {
  createUser,
  getUserById,
  getStudents,
  getTeachers,
  updateUser,
  deleteUser,
  getUsersByRolename,
  getAllUsers,
} = require("../controllers/userController");
const { isAdmin } = require("../middlewares/authMiddleware");
const { validateNewUser } = require("../middlewares/validation");

const router = express.Router();

router.use(isAdmin);

router.post("/register", validateNewUser, createUser);

router.get("/students", getStudents);
router.get("/teachers", getTeachers);
router.get("/all-users", getAllUsers);
router.get("/:role_name", getUsersByRolename);
router.get("/get-user/:id", getUserById);
router.patch("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;
