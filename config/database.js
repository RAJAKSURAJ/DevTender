const mongoose = require("mongoose");

const url =
  "mongodb+srv://Surajrajak07:Surajrajak07@devtinder.37the.mongodb.net/devTinder";

const connectDb = async () => {
  await mongoose.connect(url);
};

module.exports = connectDb;
