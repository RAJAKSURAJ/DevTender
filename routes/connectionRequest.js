const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).json({
          message: "Invalid request type " + status,
        });
      }
      if (fromUserId == toUserId) {
        return res.status(400).json({
          message: "Cannot send request to yourself",
        });
      }
      const isUserExit = await User.findById(toUserId);
      if (!isUserExit) {
        return res.status(400).json({ message: "user not found" });
      }
      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(404).json({
          message: "connection request already exits",
        });
      }
      const connection = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connection.save();
      res.json({
        message: "Connection Request Send Successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const { status, requestId } = req.params;
    const loggedUser = req.user._id;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(404).json({
        message: "Requested" + status + "not allowed",
      });
    }
    const connectionData = await connectionRequest.findOne({
      fromUserId: requestId,
      toUserId: loggedUser._id,
      status: "interested",
    });
    if (!connectionData) {
      return res.status(400).json({
        message: "Connection Request not found",
      });
    }
    connectionData.status = status;
    const data = await connectionData.save();
    res.json({
      message: "Connection " + status + " saved successfully",
      data: data,
    });
  }
);
module.exports = requestRouter;
