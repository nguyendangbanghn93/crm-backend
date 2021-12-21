const jwt = require("jsonwebtoken");
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

