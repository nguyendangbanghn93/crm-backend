const validatorMiddleware = require("./validatorHandler");
const validators = {
  validatorsAuth: require("./auth"),
};

for (const key in validators) {
  const element = validators[key];
  for (const key in element) {
    element[key] = validatorMiddleware(element[key]);
  }
}
module.exports = validators;
