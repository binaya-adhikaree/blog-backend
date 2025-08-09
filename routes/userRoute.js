const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  getAnyUserProfile,
  updateProfile,
} = require("../controller/userController");
const authenticateUser = require("../middlewares/authenticateUser");

router.put("/profile", authenticateUser, updateProfile);
router.get("/", authenticateUser, getUserProfile);
router.get("/:id", getAnyUserProfile);

module.exports = router;
