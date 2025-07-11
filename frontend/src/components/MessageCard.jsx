import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDeleteMessageMutation, useUpdateMessageMutation } from "../redux/api/messageApiSlice";

const MessageCard = ({ _id, username, content, time, align, isAuthor ,refetch}) => {
  const isRight = align === "right";
  // console.log('isAuthor', isAuthor)
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
      await updateMessage({id:_id,content:editText} );
      setEditing(false);
      setShowMenu(false);
      refetch();
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDelete = async()=>{
    try {
     
        await deletemessage(_id);
        refetch();
        
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative flex ${isRight ? "justify-end" : "justify-start"} px-2`}
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

          {isRight &&  (
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
            <p className="text-sm">{content}</p>
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
