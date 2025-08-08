const express = require("express");
const router = express.Router();

const { getUserProfile } = require("../controller/userController");
const authenticateUser = require("../middlewares/authenticateUser");

router.get("/user", authenticateUser, getUserProfile);

module.exports = router;
