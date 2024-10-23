const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const { validateLogin } = require("./utils/validation");
const connectDb = require("./config/database");
const User = require("./model/user");
const { validateSignup } = require("./utils/validation");
const { userAuth } = require("./middleware/auth");
const app = express();
const port = 8001;

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    validateSignup(req);
    const hashPassword = await password.generateHashPassword();
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});

    if (data.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.send(data);
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).send("Something went wrong");
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });
    if (!user) {
      res.status(400).send("User not found");
    }
    res.send(user);

    // if (data.length === 0) {
    //   res.status(400).send("User not found");
    // } else {
    //   res.send(data);
    // }
  } catch (err) {
    console.log("err", err);
    res.status(400).send("Something went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findOneAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const Allowed_Update = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];

    const isUpdate = Object.keys(data).every((item) =>
      Allowed_Update.includes(item)
    );
    console.log("isUpdate", isUpdate);
    if (!isUpdate) {
      throw new Error("Update not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findOneAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    console.log("user", user);
    if (!user) {
      res.status(400).send("user not found");
    }
    res.send("User data updated successfully");
  } catch (err) {
    console.log("err", err);
    res.status(400).send(err.message ?? "Something went wrong");
  }
});
connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log("server is listening on port", port);
    });
  })
  .catch((err) => {
    console.log("Error while connecting databse", err);
  });
