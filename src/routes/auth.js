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
router.post(
  "/resend_email_active",
  validatorsAuth.resendEmailActive,
  authController.resendEmailActive
);
router.post("/active", authController.active); //resendEmailActive
router.post("/login", validatorsAuth.login, authController.login);
router.get("/get_my_info", auth, authController.getMyInfo);
router.post(
  "/forgot_password",
  validatorsAuth.forgotPassword,
  authController.forgotPassword
);
router.post(
  "/change_password",
  validatorsAuth.changePassword,
  auth,
  authController.changePassword
);

module.exports = router;
