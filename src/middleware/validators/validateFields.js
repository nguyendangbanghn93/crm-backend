const Joi = require("joi");
const validateFields = {
  auth:{
    email: Joi.string().email().lowercase().trim().required().max(50),
    password: Joi.string().required().min(6).max(50),
    activeToken: Joi.string().email().lowercase().trim().required().max(50),
  }
}
module.exports = validateFields