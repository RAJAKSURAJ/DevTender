const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const { validateSignup } = require("../utils/validation");
const { validateLogin } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    validateSignup(req);
    const hashPassword = await new User().generateHashPassword(password);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.status(200).send("data saved successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    validateLogin(req);
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credential");
    }

    const isUserValid = await user.validatePassword(password);

    if (isUserValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.send("Login successfully");
    } else {
      throw new Error("Invalid credential");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User logout successfully");
});
module.exports = authRouter;
