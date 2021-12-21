const Joi = require("joi");
const regex = require("./regex");
const validateFields = require("./validateFields");

const validatorsAuth = {
  register: Joi.object({
    email: validateFields.auth.email,
    password: validateFields.auth.password,
    passwordConfirmation: Joi.any().equal(Joi.ref("password")).required(),
  }),

  resendEmailActive: Joi.object({
    email: validateFields.auth.email,
  }),

  login: Joi.object({
    email: validateFields.auth.email,
    password: validateFields.auth.password,
  }),

  active: Joi.object({
    activeToken: validateFields.auth.activeToken,
  }),

  forgotPassword: Joi.object({
    email: validateFields.auth.email,
  }),

  changePassword: Joi.object({
    oldPassword: validateFields.auth.password,
    newPassword: validateFields.auth.password,
    newPasswordConfirmation: Joi.any().equal(Joi.ref("newPassword")).required(),
  }),
};
module.exports = validatorsAuth;
