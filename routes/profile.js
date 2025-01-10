const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateProfileEdit } = require("../utils/validation");
const User = require("../model/user");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEdit(req);
    if (validateProfileEdit) {
      const loggedUser = req.user;
      Object.keys(req.body).forEach((key) => {
        loggedUser[key] = req.body[key];
      });
      console.log(loggedUser);
      await loggedUser.save();
      res.send(loggedUser);
    } else {
      throw new Error("Invalid edit field");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/resetpassword", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    if (!req.body.password) {
      return res.status(400).send("Error: Password is required.");
    }

    const hashPassword = await new User().generateHashPassword(
      req.body.password
    );

    const update = await User.findByIdAndUpdate(loggedUser, {
      password: hashPassword,
    });

    if (!update) {
      throw new Error("Failed to update password.");
    }

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = profileRouter;
