class ErrorCustom extends Error {
  constructor(obj={}) {
    super(obj);
    this.status = obj.status || 500;
    this.success = obj.success || false;
    this.result = obj.result || null;
    this.message = obj.message || "Unknown";
    this.customMessage = obj.customMessage || "";
    this.messageCode = obj.messageCode || "UNKNOWN";
    this.code = obj.code || 1000;
  }
}
const errorCustomHandler = (res, error) => {
  console.log("____Lỗi_____\n", error);
  return res.status(error.status|| 500).json({
    success: error.success|| false,
    message: error.message|| "Unknown",
    customMessage: error.customMessage|| "",
    messageCode: error.messageCode|| "UNKNOWN",
    code: error.code|| 1000,
    ...error
  });
};
const successCustomHandler = (
  res,
  result,
  { status, message, customMessage, messageCode, code } = {}
) => {
  return res.status(status||200).json({
    success: true,
    result:result||{},
    message:message||"Success",
    customMessage:customMessage||"",
    messageCode:messageCode||"SUCCESS",
    code:code||200,
  });
};
module.exports = { ErrorCustom, errorCustomHandler, successCustomHandler };
