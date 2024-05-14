const express = require("express");
const { validateRole } = require("../middlewares/validation");
const {
  createRole,
  deleteRole,
  getAllRoles,
} = require("../controllers/roleController");
const { isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(isAdmin);

router.post("/", validateRole, createRole);
router.delete("/:id", deleteRole);
router.get("/", getAllRoles);

module.exports = router;
