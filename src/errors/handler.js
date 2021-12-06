class MyError extends Error {
  constructor(obj) {
    super(obj);
    this.status = obj.status || 500;
    this.success = obj.success || false;
    this.data = obj.data || null;
    this.message = obj.message || "Unknown";
    this.customMessage = obj.customMessage || "";
    this.messageCode = obj.messageCode || "UNKNOWN";
    this.code = obj || 1000;
  }
}
const errorHandler = (res, error) => {
  console.log("____Lỗi_____\n", error);
  return res.status(error.status).json({
    success: error.success,
    data: error.data || error,
    message: error.message,
    customMessage: error.customMessage,
    messageCode: error.messageCode,
    code: error.code,
  });
};
module.exports = { MyError, errorHandler };
