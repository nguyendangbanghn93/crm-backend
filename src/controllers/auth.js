const jwt = require("jsonwebtoken");
const {
  ERRORS,
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
} = require("../errors");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const { authConfigs } = require("../configs/auth");
const conn = require("../db");
const { verifyJwt, randomString } = require("../utils");
const { Status } = require("../enum");
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
    console.log(user);
    await user.save({ new: true });
    successCustomHandler(res, { newPassword });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};

const sendMailForgotPassword = async (req) => {
  try {
    const newPassword = randomString(12);
    const smtpTrans = nodemailer.createTransport({
      service: authConfigs.emailService,
      host: authConfigs.emailHost,
      auth: {
        user: authConfigs.emailUser,
        pass: authConfigs.emailPass,
      },
    });
    const domain = req?.headers?.origin;
    const mailOptions = {
      to: req.body.email,
      from: "Admin",
      subject: "Active your email",
      text: `<div style="white-space: pre-wrap;">
      You have just submitted a password reset request. 
      The newly reissued password is: "<b>${newPassword}</b>".
      Visit the website <a href:"${domain}/login">${domain}/login</a> to login and change your password.
      </div>`,
    };
    const send = await smtpTrans.sendMail(mailOptions);
    if (!send) throw new ErrorCustom(ERRORS.SEND_MAIL_ERROR);
    return newPassword;
  } catch (error) {
    console.log(error);
    throw new ErrorCustom(ERRORS.SEND_MAIL_ERROR);
  }
};
const sendActiveEmail = async (req, user) => {
  try {
    const activeToken = jwt.sign(
      { id: user._id },
      authConfigs.activeTokenSecret,
      {
        expiresIn: authConfigs.activeTokenLife,
      }
    );

    const smtpTrans = nodemailer.createTransport({
      service: authConfigs.emailService,
      host: authConfigs.emailHost,
      auth: {
        user: authConfigs.emailUser,
        pass: authConfigs.emailPass,
      },
    });
    const domain = req?.headers?.origin;
    const mailOptions = {
      to: user.email,
      from: "Admin",
      subject: "Active your email",
      text:
        "You are receiving this because you (or someone else) have requested active your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        domain +
        "/active/" +
        activeToken +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };
    const send = await smtpTrans.sendMail(mailOptions);
    if (!send) throw new ErrorCustom(ERRORS.SEND_MAIL_ERROR);
    return activeToken;
  } catch (error) {
    throw new ErrorCustom(ERRORS.SEND_MAIL_ERROR);
  }
};
