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
    content: { type: String,  trim: true },
    fileurl :{type:String},
    filetype :{type:String},
    jitsiLink:{type:String},

  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
