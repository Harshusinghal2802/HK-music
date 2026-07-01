const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser } = require("../controllers/userController");
const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
