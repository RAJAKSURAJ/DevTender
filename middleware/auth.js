const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (token) {
      const decodedData = await jwt.verify(token, "DEV@Tinder$07");
      const { _id } = decodedData;
      const user = await User.findOne({ _id });
      if (!user) {
        throw new Error("user not found");
      }
      req.user = user;
      next();
    } else {
      throw new Error("Invalid token please login");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};
module.exports = { userAuth };
