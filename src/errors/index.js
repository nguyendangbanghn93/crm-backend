const {
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
} = require("./handler");

const ERRORS = {
  UNKNOWN: {
    status: 200,
    success: false,
    result: null,
    message: "Unknown",
    code: 1000,
  },
  USERNAME_DUPLICATE: {
    status: 200,
    success: false,
    result: null,
    message: "Username duplicate",
    code: 1001,
  },
  EMAIL_DUPLICATE: {
    status: 200,
    success: false,
    result: null,
    message: "Email duplicate",
    code: 1002,
  },
  INVALID_TOKEN: {
    status: 403,
    success: false,
    result: null,
    message: "Invalid token",
    code: 1003,
  },
  UNAUTHORIZED: {
    status: 401,
    success: false,
    result: null,
    message: "Unauthorized",
    code: 1004,
  },
  DATA_VALIDATION_ERROR: {
    status: 200,
    success: false,
    result: null,
    message: "Data validation error",
    code: 1005,
  },
};
for (const key in ERRORS) {
  ERRORS[key].messageCode = key;
}
module.exports = {
  ERRORS,
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
};
