const express = require("express");
const { validateRole } = require("../middlewares/validation");
const { createRole, deleteRole } = require("../controllers/roleController");
const { isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.use(isAdmin);

router.post("/", validateRole, createRole);
router.delete("/:id", deleteRole);

module.exports = router;
