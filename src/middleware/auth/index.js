const jwt = require("jsonwebtoken");
const { Status } = require("../../enum");
const { ERRORS } = require("../../errors");
const { ErrorCustom, errorCustomHandler } = require("../../errors/handler");
const User = require("../../models/user");
module.exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ErrorCustom(ERRORS.UNAUTHORIZED);
    const { userId } = await User.verifyToken(token);
    req.userId = userId;
    const user = await User.findOne({
      _id: userId,
    });
    if (!user) throw new ErrorCustom(ERRORS.USER_NOT_FOUND);
    if (user.status === Status.DEACTIVE)
      throw new ErrorCustom(ERRORS.ACCOUNT_NOT_ACTIVED);
    if (user.status === Status.DELETE)
      throw new ErrorCustom(ERRORS.ACCOUNT_HAS_BEEN_DELETED);
    req.user = user;
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
