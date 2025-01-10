const express = require("express");
const connectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../model/user");
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connectionData = await connectionRequest
      .find({
        toUserId: loggedUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "skills",
        "photoUrl",
        "about",
        "age",
      ]);
    if (!connectionData) {
      return res.status(404).json({
        message: "Connection Request Not Found",
      });
    }
    res.json({
      data: connectionData,
    });
  } catch (err) {
    res.status(400).send("Error : " + err);
  }
});

userRouter.get("/user/connection/accepted", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connectionData = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedUser._id, status: "accepted" },
          { toUserId: loggedUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "skills",
        "photoUrl",
        "about",
        "age",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "skills",
        "photoUrl",
        "about",
        "age",
      ]);
    if (!connectionData) {
      return res.status(404).json({
        message: "Connection Data Not Found",
      });
    }
    const data = connectionData.map((row) => {
      if (row.fromUserId.toString() === loggedUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error : " + err);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequestData = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
      })
      .select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionRequestData.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })
      .select("firstName lastName skills photoUrl age about")
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send("Error : " + err);
  }
});
module.exports = userRouter;
