const { errorCustomHandler, ERRORS, ErrorCustom } = require("../../errors");
const validatorMiddleware = (validator) => {
  return async function (req, res, next) {
    try {
      const validated = await validator.validateAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      error.customMessage = "Data validation error";
      const err = new ErrorCustom(ERRORS.DATA_VALIDATION_ERROR);
      err.result = error;
      err.message = error.message;
      return errorCustomHandler(res, err);
    }
  };
};
module.exports = validatorMiddleware;
