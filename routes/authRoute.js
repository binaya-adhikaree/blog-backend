const express = require("express");
const router = express.Router();

const { handleLogin, handleRegister } = require("../controller/authController");

router.post("/auth/register", handleRegister);
router.post("/auth/login", handleLogin);

module.exports = router;
