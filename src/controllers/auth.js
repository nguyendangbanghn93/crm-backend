const ERRORS = require("../errors");
const {
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
} = require("../errors/handler");
module.exports.register = async (req, res, next) => {

  try {
    console.log(a.qwe);
    throw new ErrorCustom(ERRORS.INVALID_TOKEN)
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
