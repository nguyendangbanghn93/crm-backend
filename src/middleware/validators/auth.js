const Joi = require("joi");
const regex = require("./regex");
const validateFields = require("./validateFields");
const validatorMiddleware = require("./validatorHandler");
const validatorsAuth = {
  register: validatorMiddleware(
    Joi.object({
      email: validateFields.auth.email,
      password: validateFields.auth.password,
      passwordConfirmation: Joi.any().equal(Joi.ref("password")).required(),
    })
  ),

  login: validatorMiddleware(
    Joi.object({
      email: validateFields.auth.email,
      password: validateFields.auth.password,
    })
  ),

  active: validatorMiddleware(
    Joi.object({
      activeToken: validateFields.auth.activeToken,
    })
  ),

  forgotPassword: validatorMiddleware(
    Joi.object({
      email: validateFields.auth.email,
    })
  ),

  changePassword: validatorMiddleware(
    Joi.object({
      oldPassword: validateFields.auth.password,
      newPassword: validateFields.auth.password,
      newPasswordConfirmation: Joi.any()
        .equal(Joi.ref("newPassword"))
        .required(),
    })
  ),
};

module.exports = validatorsAuth;
