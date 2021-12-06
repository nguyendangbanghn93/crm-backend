const ERRORS = {
  UNKNOWN: {
    status: 500,
    success: false,
    result: null,
    message: "Unknown",
    code: 1000,
  },
  USERNAME_DUPLICATE: {
    status: 400,
    success: false,
    result: null,
    message: "Username duplicate",
    code: 1001,
  },
  EMAIL_DUPLICATE: {
    status: 400,
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
};
for (const key in ERRORS) {
  ERRORS[key].messageCode = key;
}
module.exports = ERRORS;
