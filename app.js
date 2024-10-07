const express = require("express");

const app = express();
const port = 8001;
app.get("/test", (req, res) => {
  res.send("Hello from server");
});

app.listen(port || 8000);
