const {
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
} = require("./handler");

const ERRORS = {
  UNKNOWN: {
    message: "Unknown",
  },
  USERNAME_DUPLICATE: {
    message: "Username duplicate",
  },
  EMAIL_DUPLICATE: {
    message: "Email duplicate",
  },
  INVALID_TOKEN: {
    status: 403,
    message: "Invalid token",
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Unauthorized",
  },
  DATA_VALIDATION_ERROR: {
    message: "Data validation error",
  },
  SEND_MAIL_ERROR: {
    message: "Send email error",
  },
  USER_NOT_FOUND: {
    message: "User not found",
  },
  ACCOUNT_HAS_BEEN_DELETED: {
    message: "Account has been deleted",
  },
  ACCOUNT_HAS_BEEN_ACTIVED: {
    message: "Account has been actived",
  },
  WRONG_LOGIN_INFORMATION: {
    message: "Wrong login information",
  },
  INCORRECT_PASSWORD: {
    message: "Incorrect password",
  },
  ACCOUNT_NOT_ACTIVED: {
    message: "Account not activated",
  },
  TOKEN_EXPIRES: {
    message: "Token expires",
  },
};

let code = 1000;
for (const key in ERRORS) {
  ERRORS[key].messageCode = key;
  ERRORS[key].code = code;
  ERRORS[key].status = ERRORS[key].status || 200;
  ERRORS[key].success = ERRORS[key].success || false;
  ERRORS[key].result = ERRORS[key].result || null;
  code++;
}
module.exports = {
  ERRORS,
  ErrorCustom,
  errorCustomHandler,
  successCustomHandler,
};
