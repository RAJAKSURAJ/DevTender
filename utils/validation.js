const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("firstName is mandatory");
  } else if (!emailId) {
    throw new Error("Email required");
  } else if (!password) {
    throw new Error("Password required");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("firstname should in 4-50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "strong password required,  minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,"
    );
  }
};

const validateLogin = (req) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    throw new Error("Invalid credential");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid credential");
  }
};
const validateProfileEdit = (req) => {
  const allowedEdit = ["firstName", "lastName", "emailId", "skills"];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEdit.includes(field)
  );
  return isAllowed;
};
module.exports = { validateSignup, validateLogin, validateProfileEdit };
