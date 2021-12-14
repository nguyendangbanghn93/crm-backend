class ErrorCustom extends Error {
  constructor(obj) {
    super(obj);
    this.status = obj.status || 500;
    this.success = obj.success || false;
    this.result = obj.result || null;
    this.message = obj.message || "Unknown";
    this.customMessage = obj.customMessage || "";
    this.messageCode = obj.messageCode || "UNKNOWN";
    this.code = obj || 1000;
  }
}
const errorCustomHandler = (res, error) => {
  console.log("____Lỗi_____\n", error);
  return res.status(error.status).json({
    success: error.success,
    result: error.result || error,
    message: error.message,
    customMessage: error.customMessage,
    messageCode: error.messageCode,
    code: error.code,
  });
};
const successCustomHandler = (
  res,
  result,
  { status = 200, message, customMessage, messageCode, code } = {}
) => {
  return res.status(status).json({
    success: true,
    result,
    message,
    customMessage,
    messageCode,
    code,
  });
};
module.exports = { ErrorCustom, errorCustomHandler, successCustomHandler };
