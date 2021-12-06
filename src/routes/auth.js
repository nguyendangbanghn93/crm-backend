const express = require("express");
const authController = require("../controllers/auth");
const { auth, verifyRegister } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", verifyRegister, authController.register);

module.exports = router;
