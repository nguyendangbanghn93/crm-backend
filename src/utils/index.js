const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { authConfigs } = require("../configs/auth");
const { ERRORS, ErrorCustom } = require("../errors");
module.exports.verifyJwt = async (token, secret) => {
  try {
    return await jwt.verify(token, secret);
  } catch (error) {
    console.log("error", error);
    if (error.message === "jwt expired")
      throw new ErrorCustom(ERRORS.TOKEN_EXPIRES);
    throw new ErrorCustom(ERRORS.INVALID_TOKEN);
  }
};

module.exports.randomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports.sendEmail = async (to, options) => {
  try {
    const smtpTrans = nodemailer.createTransport({
      service: authConfigs.emailService,
      host: authConfigs.emailHost,
      auth: {
        user: authConfigs.emailUser,
        pass: authConfigs.emailPass,
      },
    });
    const mailOptions = {
      to,
      from: "Admin",
      subject: "Email from CRM system",
      text: "Email from CRM system",
      ...options,
    };
    const send = await smtpTrans.sendMail(mailOptions);
    if (!send) throw new ErrorCustom(ERRORS.SEND_MAIL_ERROR);
    return true;
  } catch (error) {
    throw new ErrorCustom(ERRORS.SEND_MAIL_ERROR);
  }
};
