const ERRORS = require("../errors");
const jwt = require("jsonwebtoken");
module.exports.verifyJwt = async (token, secret) => {
  try {
    return await jwt.verify(token, secret);
  } catch (error) {
    throw new Error(ERRORS.INVALID_TOKEN);
  }
};
