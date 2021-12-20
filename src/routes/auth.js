const express = require("express");
const authController = require("../controllers/auth");
const { auth, verifyRegister } = require("../middleware/auth");
const { validatorsAuth } = require("../middleware/validators");
const router = express.Router();

router.post(
  "/register",
  verifyRegister,
  validatorsAuth.register,
  authController.register
);
router.post("/login");
router.get("/info");
router.post("/active");
router.post("/forgot_password");
router.post("/change_password");
module.exports = router;
