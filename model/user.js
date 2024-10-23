const mongoose = require("mongoose");
const validator = require("validator");
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

const UserModal = mongoose.model("User", userSchema);

module.exports = UserModal;
