const jwt = require("jsonwebtoken");
const { ERRORS } = require("../../errors");
const { ErrorCustom, errorCustomHandler } = require("../../errors/handler");
const User = require("../../models/user");
module.exports.auth = async (res, req, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ErrorCustom(ERRORS.UNAUTHORIZED);
    const { userId } = await User.verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
module.exports.verifyRegister = async (req, res, next) => {
  try {
    const isUsernameExist = await User.count({
      $and: [{ username: req.body.username }, { username: { $exists: true } }],
    });
    if (isUsernameExist) throw new ErrorCustom(ERRORS.USERNAME_DUPLICATE);

    const isEmailExist = await User.count({
      $and: [{ email: req.body.email }, { email: { $exists: true } }],
    });
    if (isEmailExist) throw new ErrorCustom(ERRORS.EMAIL_DUPLICATE);

    // if() idFacebook

    // if() idGoogle

    next();
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
