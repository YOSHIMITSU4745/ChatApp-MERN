import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
