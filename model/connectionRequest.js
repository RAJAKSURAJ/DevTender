const mongoose = require("mongoose");

const connnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
      },
      message: "{VALUE} is not supported",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ConnectionRequest", connnectionRequestSchema);
