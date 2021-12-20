const ERRORS = require("../errors");
const jwt = require("jsonwebtoken");
const {
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
} = require("../errors/handler");
const User = require("../models/user");
module.exports.register = async (req, res, next) => {
  try {
    const data = req.body;
    const user = new User(data);
    await user.save();
    return successCustomHandler(res, { user });
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};

const sendActiveEmail = async (req, user) => {
  // const activeToken = crypto.randomBytes(20).toString("hex");

  const activeToken = jwt.sign({ email: user.email }, user.email, {
    expiresIn: authConfig.activeTokenLife,
  });

  const smtpTrans = nodemailer.createTransport({
    service: authConfig.emailService,
    host: authConfig.emailHost,
    auth: {
      user: authConfig.emailUser,
      pass: authConfig.emailPass,
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

  if (!send) throw new Error(err.SEND_MAIL_ERROR.messageCode);
  return activeToken;
};
