const express = require("express");
var cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const app = express();
const port = 8001;

app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/", profileRoute);
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
