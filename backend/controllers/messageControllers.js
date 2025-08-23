import asyncHandler from "../middlewares/asynchHandler.js";
import { Message } from "../models/message.js";

import cloudinary from "cloudinary";
import crypto from "crypto";



const getSignature = asyncHandler(async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  const signature = cloudinary.v2.utils.api_sign_request(
    { timestamp, folder: "chat_files", use_filename: true },
    API_SECRET
  );
//   const stringToSign = `folder=chat_files&timestamp=${timestamp}`;

//   const expectedSig = crypto
//     .createHash("sha1")
//     .update(stringToSign + API_SECRET)
//     .digest("hex");

//   console.log("Expected Signature:", expectedSig);

  res.status(200).json({
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

const createMessage = asyncHandler(async (req, res) => {
  const { roomid, sender, content, fileurl, filetype ,jitsiLink} = req.body;

  if (!roomid || !sender || !(content || fileurl ||jitsiLink ))
    return res.status(400).json({ error: "Fields are empty!" });

  try {
    const newmsg = new Message({ roomid, sender, content, fileurl, filetype,jitsiLink });
    const created = await newmsg.save();

    if (!created) res.status(400).json({ error: "Cant create message!" });

    return res.status(201).json(created);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error in creating message!" });
  }
});

const getByRoomid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const msgs = await Message.find({ roomid: id }).populate(
      "sender",
      "username"
    );

    return res.json(msgs);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "INternal Server error at getting msgs!" });
  }
});

const updateMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  try {
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: "No Such Message found" });

    msg.content = content ? content : msg.content;
    const updatedMessage = await msg.save();
    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error during editing message" });
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const folder = process.env.CLOUDINARY_FOLDER_NAME;
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const deletedmsg = await Message.findByIdAndDelete(id);
    const fileurl = deletedmsg.fileurl;
    let result =null;
    if (fileurl) {
      const filename = fileurl.substring(fileurl.lastIndexOf("/") + 1).split('.')[0];
    
      const public_id = `${folder}/${filename}`;
    //   console.log('public_id', public_id);
      result = await cloudinary.v2.uploader.destroy(public_id);  //foldername/filename = publicid
    //   console.log("result", result);
    }
    if (!deletedmsg )
      return res.status(404).json({ error: "No such message found!" });

    if(result && result?.result!=='ok')
        return res.status(404).json({erro:"file not found in cloudinary"});


    return res.status(200).json(deletedmsg);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server Error while deleting message" });
  }
});

const getByUserid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ sender: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("roomid sender");

    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const getMessageCount = asyncHandler(async (req, res) => {
  try {
    const count = await Message.countDocuments();

    return res.status(200).json({ count });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
export {
  createMessage,
  getByRoomid,
  updateMessage,
  deleteMessage,
  getByUserid,
  getMessageCount,
  getSignature,
};
