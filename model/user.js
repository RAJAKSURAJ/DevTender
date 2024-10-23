const mongoose = require("mongoose");
const validator = require("validator");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      // minLength: 6,
      // maxLength: 12,
      // validate(value) {
      //   if (!validator.isStrongPassword(value)) {
      //     throw new Error("Strong password required ");
      //   }
      // },
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      validate: {
        validator: function (value) {
          return ["male", "female", "other"].includes(value);
        },
        message: (props) => `${props.value} is not valid gender`,
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photourl");
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DEV@Tinder$07", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.generateHashPassword = async function () {
  const password = this;
  const hashPassword = bcrypt.hash(password, 10);
  return hashPassword;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const hashPassword = user.password;
  const isValidUser = bcrypt.compare(userInputPassword, hashPassword);
  return isValidUser;
};
module.exports = mongoose.model("User", userSchema);
