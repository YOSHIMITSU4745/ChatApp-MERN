import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import MessageCard from "../../components/MessageCard";
import { useGetRoomByIdQuery } from "../../redux/api/roomApiSlice";
import Loader from "../../components/Loader";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../redux/api/messageApiSlice";
import RoomAccessGuard from "../../components/RoomAcessGuard";

const Room = () => {
  const { id } = useParams();
  const { userinfo } = useSelector((state) => state.auth);

  const { data: room, isLoading: isRoomLoading } = useGetRoomByIdQuery(id);
  const { data: messages = [], isLoading, refetch } = useGetMessagesQuery(id);

  const [postMessage] = useCreateMessageMutation();

  const [text, setText] = useState("");
  const [file , setfile] = useState(null);
  const fileinputref = useRef(null);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!text.trim() && !file) return;
    await postMessage({ roomid: id, sender: userinfo.id, content: text ,file });
    setText("");
    setfile(null);
    if(fileinputref.current) fileinputref.current.value = '';

    refetch();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <RoomAccessGuard room={room} isLoading={isRoomLoading} />
      <div className="max-w-4xl mx-auto h-[90vh] p-4 bg-teal-50 rounded-2xl shadow-lg border border-teal-300 flex flex-col">
        {/* 🔼 Room Info Header */}
        {isRoomLoading ? (
          <Loader />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-10 bg-teal-100 border border-teal-300 shadow-md rounded-xl mb-4 px-6 py-4"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left: Room Name & Title */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-teal-800">
                  {room?.name}
                </h1>
                <p className="text-md font-medium text-teal-700">
                  🎓 {room?.title?.name}
                </p>
              </div>

              {/* Right: Description Box */}
              <div className="bg-white border border-teal-300 rounded-lg px-4 py-2 max-w-md shadow-sm">
                <p className="text-sm text-gray-700 italic">
                  {room?.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 🔽 Messages Area */}
        <div className="flex-1 overflow-y-auto overflow-x space-y-3 px-2 mb-3">
          {isLoading || isRoomLoading ? (
            <Loader />
          ) : messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <MessageCard
                key={msg._id}
                _id={msg._id}
                username={msg.sender?.username || "Unknown"}
                content={msg.content}
                fileurl={msg.fileurl}         
                filetype={msg.filetype}
                time={new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                align={msg.sender._id === userinfo.id ? "right" : "left"}
                isAuthor={room.author._id === msg.sender._id}
                refetch={refetch}
              />
            ))
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* 🔽 Message Input */}
        <div className="flex items-center gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            id="file-upload"
            ref = {fileinputref}
            className="hidden"
            onChange={(e) => {
              const file = e.target?.files[0]?? null;
              setfile(file);
              if (file) {
                console.log("Selected file:", file);
              }
            }}
          />

          {/* + Icon Button */}
          <motion.label
            whileTap={{ scale: 0.95 }}
            htmlFor="file-upload"
            className="flex items-center justify-center w-10 h-10 bg-teal-100 border border-teal-300 rounded-full cursor-pointer hover:bg-teal-200 transition"
          >
            <span className="text-teal-700 text-2xl font-bold leading-none relative -top-1">+</span>
          </motion.label>

          {/* Text Input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 px-4 py-2 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            Send
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default Room;
