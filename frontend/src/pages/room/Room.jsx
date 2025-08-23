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
  useLazyGetSignatureQuery,
  useSendFileToCloudinaryMutation,
} from "../../redux/api/messageApiSlice";
import RoomAccessGuard from "../../components/RoomAcessGuard";
import JitsiMeetingEmbed from "../../components/jitsiMeetingEmbed";
import { FiVideo } from "react-icons/fi";

const Room = () => {
  const { id } = useParams();
  const { userinfo } = useSelector((state) => state.auth);

  const { data: room, isLoading: isRoomLoading } = useGetRoomByIdQuery(id);
  const { data: messages = [], isLoading, refetch } = useGetMessagesQuery(id);
  const [getsignature] = useLazyGetSignatureQuery();
  const [postfiles] = useSendFileToCloudinaryMutation();
  const [postMessage] = useCreateMessageMutation();

  const [text, setText] = useState("");
  const [file, setfile] = useState(null);
  const fileinputref = useRef(null);
  const bottomRef = useRef(null); //snack to bottom

  const [activeMeetingfromchild, setActiveMeetingfromchild] = useState(null);

  const [activeMeeting, setActiveMeeting] = useState(null); //jitsi meeting
  // const [jitsiLink, setjitsilink] = useState(null);

  const startMeeting = async () => {
    try {
      const jitsiRoom = `room-${id}-${Date.now()}`; // unique meeting id
      const jl = `https://meet.jit.si/${jitsiRoom}`;

      // setjitsilink(jl);
      // send meeting link as a message

      sendMessage({jitsiLink:jl});
      // open iframe locally
      setActiveMeeting({ room: jitsiRoom });
    } catch (err) {
      console.error("Failed to start meeting", err);
    }
  };

  const sendMessage = async ({ jitsiLink: customLink } = {}) => {
    try {
      let fileurl = null;
      let filetype = null;
      if (!text.trim() && !file && !customLink) return;
      if (file) {
        const { timestamp, signature, api_key, cloud_name } =
          await getsignature().unwrap();
        const res = await postfiles({
          file,
          api_key,
          timestamp,
          signature,
          folder: "chat_files",
          cloudname: cloud_name,
        }).unwrap();

        fileurl = res.secure_url;
        filetype = file.type;
      }

      await postMessage({
        roomid: id,
        sender: userinfo.id,
        content: text,
        fileurl,
        filetype,
        jitsiLink: customLink || null,
      }).unwrap();
      setText("");
      setfile(null);
      if (fileinputref.current) fileinputref.current.value = "";
    } catch (err) {
      console.error("failed to send message", err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <RoomAccessGuard room={room} isLoading={isRoomLoading} />
      <div className="max-w-4xl mx-auto h-[90vh] p-4 bg-white rounded-2xl shadow-lg border border-gray-300 flex flex-col">
        {/* 🔼 Room Info Header */}
        {isRoomLoading ? (
          <Loader />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-10 bg-gray-100 border border-gray-300 shadow-sm rounded-xl mb-4 px-6 py-4"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left: Room Name & Title */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {room?.name}
                </h1>
                <p className="text-md font-medium text-gray-700">
                  🎓 {room?.title?.name}
                </p>
              </div>

              {/* Right: Description Box */}
              <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 max-w-md shadow-inner">
                <p className="text-sm text-gray-600 italic">
                  {room?.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 🔽 Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 px-2 mb-3">
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
                jitsilink={msg.jitsiLink}
                time={new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                align={msg.sender._id === userinfo.id ? "right" : "left"}
                isAuthor={room.author._id === msg.sender._id}
                refetch={refetch}
                onJoinMeeting={(roomName) =>
                  setActiveMeetingfromchild({ room: roomName })
                }
              />
            ))
          )}
          <div ref={bottomRef}></div>
        </div>

        {/*meeting joined by client*/}
        {activeMeetingfromchild && (
          <JitsiMeetingEmbed
            roomName={activeMeetingfromchild.room}
            userName={userinfo.username}
            onClose={() => setActiveMeetingfromchild(null)}
          />
        )}

        {/*meeting initiated by client */}
        {activeMeeting && (
          <JitsiMeetingEmbed
            roomName={activeMeeting.room}
            userName={userinfo.username}
            onClose={() => setActiveMeeting(null)}
          />
        )}

        {/* ✅ Attached File Indicator (compact pill) */}
        {file && (
          <div className="flex items-center gap-2 self-start mb-2 text-xs text-gray-800 bg-gray-200 border border-gray-300 px-3 py-1.5 rounded-full shadow-sm max-w-xs">
            <span className="truncate">{file.name}</span>
            <button
              onClick={() => {
                setfile(null);
                if (fileinputref.current) fileinputref.current.value = "";
              }}
              className="text-gray-500 hover:text-red-600 font-bold text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* 🔽 Message Input */}
        <div className="flex items-center gap-2 mt-3">
          {/* Hidden File Input */}
          <input
            type="file"
            id="file-upload"
            ref={fileinputref}
            className="hidden"
            onChange={(e) => {
              const file = e.target?.files[0] ?? null;
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
            className="flex items-center justify-center w-10 h-10 bg-gray-200 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-300 transition"
          >
            <span className="text-gray-700 text-2xl font-bold leading-none relative -top-1">
              +
            </span>
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {/* jitsi calling*/}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startMeeting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition"
          >
            <FiVideo /> Meet
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            Send
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default Room;
