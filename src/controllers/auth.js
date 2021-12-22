const jwt = require("jsonwebtoken");
const {
  ERRORS,
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
} = require("../errors");

const User = require("../models/user");
const { authConfigs } = require("../configs/auth");
const conn = require("../db");
const { verifyJwt, randomString, sendEmail } = require("../utils");
const { Status } = require("../enum");
const passport = require("passport");
module.exports.register = async (req, res) => {
  try {
    const session = await conn.startSession();
    await session.withTransaction(async () => {
      const user = new User(req.body);
      await user.save({ session });
      const activeToken = await sendActiveEmail(req, user);
      successCustomHandler(res, { user, activeToken });
    });
    session.endSession();
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
exports.resendEmailActive = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    User.isDeactive(user);
    const activeToken = await sendActiveEmail(req, user);
    return successCustomHandler(res, { activeToken });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
module.exports.active = async (req, res) => {
  try {
    const { activeToken } = req.body;
    const { id } = await verifyJwt(activeToken, authConfigs.activeTokenSecret);
    const user = await User.findById(id);
    User.isDeactive(user);
    user.status = Status.ACTIVE;
    user.save({ new: true });
    successCustomHandler(res, { user });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    const user = await User.findOne({ email });
    User.isActive(user);
    await user.comparePassword(password);
    const { token, refreshToken } = user.generateAuthToken();
    successCustomHandler(res, { user, token, refreshToken });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
module.exports.getMyInfo = async (req, res) => {
  try {
    successCustomHandler(res, { user: req.user });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    User.isActive(user);
    const newPassword = await sendMailForgotPassword(req);
    user.password = newPassword;
    await user.save();
    successCustomHandler(res, { newPassword });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
module.exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    await user.comparePassword(oldPassword);
    user.password = newPassword;
    await user.save({ new: true });
    successCustomHandler(res, { newPassword });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
module.exports.loginFacebook = async (req, res) => {
  try {
    passport.authenticate("facebook", { scope: "email" }).call(this, req, res);
  } catch (error) {
    res.redirect(`/views?error=${error.message}`);
  }
};
module.exports.loginFacebookCallback = async (req, res) => {
  passport
    .authenticate("facebook", async (err, data, info) => {
      try {
        if (err) throw new Error(err);
        if (data) {
          console.log(data);
          const user = new User(data);
        }
        res.redirect("/views");
      } catch (error) {
        return res.redirect(`/views?error=${error.message}`);
      }
    })
    .call(this, req, res);
};
const sendMailForgotPassword = async (req) => {
  sendEmail(req.body.email, {
    subject: "Forgot password",
    text: `<div style="white-space: pre-wrap;">
      You have just submitted a password reset request. 
      The newly reissued password is: "<b>${randomString(12)}</b>".
      Visit the website <a href:"${req?.headers?.origin}/login">${
      req?.headers?.origin
    }/login</a> to login and change your password.
      </div>`,
  });
  return newPassword;
};
const sendActiveEmail = async (req, user) => {
  const activeToken = jwt.sign(
    { id: user._id },
    authConfigs.activeTokenSecret,
    {
      expiresIn: authConfigs.activeTokenLife,
    }
  );
  sendEmail(user.email, {
    subject: "Active your email",
    text:
      "You are receiving this because you (or someone else) have requested active your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      req?.headers?.origin +
      "/active/" +
      activeToken +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  });
  return activeToken;
};
