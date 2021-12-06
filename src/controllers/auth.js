const ERRORS = require("../errors");
const {
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
} = require("../errors/handler");
module.exports.register = async (req, res, next) => {

  try {
    console.log(123);
    return successCustomHandler(res, req.body);
  } catch (error) {
    return errorCustomHandler(res, error);
  }
};
