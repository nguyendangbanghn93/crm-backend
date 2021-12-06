const ERRORS = require("../errors");
const { MyError, errorHandler } = require("../errors/handler");
const db = require("../models");
const User = require("../models/user");
const ROLES = db.ROLES;
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findOne({ username: req.body.username });
    if (userByUsername) throw new MyError(ERRORS.USERNAME_DUPLICATE);
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) throw new MyError(ERRORS.EMAIL_DUPLICATE);
    next();
  } catch (error) {
    return errorHandler(res, error);
  }
};
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return errorHandler(res, {
          status: 400,
          customMessage: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
      }
    }
  }
  next();
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
module.exports = verifySignUp;
