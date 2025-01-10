const express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const connectionRoute = require("./routes/connectionRequest");
const userRoute = require("./routes/user");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const port = 8001;

app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", connectionRoute);
app.use("/", userRoute);
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
