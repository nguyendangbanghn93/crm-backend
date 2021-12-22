const express = require("express");
const authController = require("../controllers/auth");
const { auth, verifyRegister } = require("../middleware/auth");
const { validatorsAuth } = require("../middleware/validators");
const router = express.Router();
const passport = require("passport");

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
router.post("/active", authController.active);
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

// AUTH FACEBOOK
router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/view",
    failureRedirect: "/login",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});


module.exports = router;
