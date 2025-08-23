import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMoreVertical, FiEdit2, FiTrash2, FiDownload } from "react-icons/fi";
import {
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} from "../redux/api/messageApiSlice";
// import JitsiMeetingEmbed from "./jitsiMeetingEmbed";

const MessageCard = ({
  _id,
  username,
  content,
  fileurl,
  filetype,
  jitsilink,
  time,
  align,
  isAuthor,
  refetch,
  onJoinMeeting
}) => {
  const isRight = align === "right";
  // console.log('isAuthor', isAuthor)
  // console.log('jitsilink', jitsilink);
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(content);


  const [updateMessage] = useUpdateMessageMutation();
  const [deletemessage] = useDeleteMessageMutation();
  const handleEdit = async () => {
    if (!editText.trim()) return;

    try {
      // console.log(editText);
      // console.log('_id', _id)
      await updateMessage({ id: _id, content: editText });
      setEditing(false);
      setShowMenu(false);
      refetch();
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletemessage(_id);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative flex ${
        isRight ? "justify-end" : "justify-start"
      } px-2`}
    >
      <div
        className={`relative max-w-xs break-words p-3 rounded-xl shadow-md ${
          isRight
            ? "bg-teal-600 text-white rounded-br-none"
            : "bg-white border border-teal-300 text-teal-800 rounded-bl-none"
        }`}
      >
        {/* Username + menu */}
        <p className="font-semibold text-sm mb-1 flex items-center justify-between">
          <span>
            {username}
            {isAuthor && (
              <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
                @Admin
              </span>
            )}
          </span>

          {isRight && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:text-teal-300 transition"
            >
              <FiMoreVertical />
            </button>
          )}
        </p>

        {/* Editable content */}
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full px-2 py-1 rounded-md text-black border focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="text-xs text-white hover:text-teal-200 font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* File attachments */}
            {fileurl && (
              <div className="mt-2">
                {filetype?.startsWith("image/") ? (
                  <a href={fileurl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={fileurl}
                      alt="attachment"
                      className="max-w-full rounded-lg border border-teal-200"
                    />
                  </a>
                ) : filetype?.startsWith("video/") ? (
                  <video
                    src={fileurl}
                    controls
                    className="max-w-full rounded-lg border border-teal-200"
                  />
                ) : filetype === "application/pdf" ? (
                  <a
                    href={fileurl.replace("/upload/", "/upload/fl_attachment/")}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2 bg-teal-700 
             text-white text-sm font-semibold rounded-full shadow-md 
             hover:bg-teal-800 transition-all duration-200"
                  >
                    <FiDownload className="w-5 h-5" />
                    {fileurl.slice(fileurl.lastIndexOf("/") + 1)}
                  </a>
                ) : filetype === "audio/mpeg" ? (
                  <div className="inline-block px-4 py-3 bg-teal-900 border border-teal-700 rounded-lg shadow-md mt-2 max-w-sm">
                    <span className="block text-sm font-semibold text-teal-100 mb-2 break-words">
                      {fileurl.slice(fileurl.lastIndexOf("/") + 1)}
                    </span>
                    <audio
                      controls
                      className="rounded-md max-w-full  text-teal-100 h-8"
                    >
                      <source src={fileurl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <a
                    href={fileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 
             bg-gray-200 text-gray-800 text-xs font-medium 
             rounded-md shadow-sm hover:bg-gray-300 transition"
                  >
                    📎 {fileurl.slice(fileurl.lastIndexOf("/") + 1)}
                  </a>
                )}
              </div>
            )}
            {/* jitsi vedio link */}
            {jitsilink && (
              <button
                onClick={() =>
                  onJoinMeeting(jitsilink.replace("https://meet.jit.si/", ""))
                }
                className="inline-flex items-center gap-2 px-5 py-2 bg-teal-700 
            text-white text-sm font-semibold rounded-full shadow-md 
            hover:bg-teal-800 transition-all duration-200"
              >
                🎥 Join Meeting
              </button>
            )}

            {/* Text message */}
            {content && <p className="text-sm">{content}</p>}

            <p className="text-right text-xs mt-1 opacity-70">{time}</p>
          </>
        )}

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute top-8 right-3 z-10 bg-white border border-teal-300 rounded-md shadow-md w-28 text-teal-800">
            <button
              onClick={() => {
                setEditing(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-teal-50 w-full text-left"
            >
              <FiEdit2 className="text-teal-700" /> <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <FiTrash2 className="text-red-600" /> <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageCard;
