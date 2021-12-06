const jwt = require("jsonwebtoken");
const ERRORS = require("../../errors");
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
    const userByUsername = await User.findOne({ username: req.body.username });
    if (userByUsername) throw new MyError(ERRORS.USERNAME_DUPLICATE);
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) throw new ErrorCustom(ERRORS.EMAIL_DUPLICATE);
    next();
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
