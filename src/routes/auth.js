const express = require("express");
const passport = require("passport");
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

// AUTH FACEBOOK
router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/views",
    failureRedirect: "/views",
  }),
  function (a, b, c) {
    console.log({ a, b, c });
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
