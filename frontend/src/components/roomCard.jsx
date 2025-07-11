import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaLock, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoomMenu from "./RoomMenu";
import { useDeleteRoomMutation } from "../redux/api/roomApiSlice";
import Loader from "./Loader";
import { toast } from "react-toastify";

const RoomCard = ({ room ,fromadmin }) => {
  const { userinfo } = useSelector((state) => state.auth);

  const isPrivate = room.password && room.password.length > 0;
  const isauthor = room.author?._id === userinfo.id;
  const navigate = useNavigate();
  const [deleteRoom] = useDeleteRoomMutation();

  
  const handleEdit = (e) =>{
    e.stopPropagation();
   
    navigate(`/updateroom/${room._id}`);
  }

  const handleDelete = (e) =>{
    e.stopPropagation();
    
    deleteRoom(room._id);
    toast.success(`Room ${room?.name} deleted`)
    navigate(`/search?q=${encodeURIComponent(userinfo?.username)}`);
  }
  const baseClasses =
    "rounded-xl shadow-md p-5 transition-all duration-300 cursor-pointer";
  const cardClasses = isauthor
    ? "bg-yellow-50 border-transparent hover:border-yellow-500 hover:shadow-xl"
    : "bg-teal-50 border-transparent hover:border-teal-500 hover:shadow-xl";

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className={`${baseClasses} border-2 ${cardClasses}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-xl font-bold ${
            isauthor ? "text-yellow-800" : "text-teal-800"
          }`}
        >
          {room.name}
        </h3>
        <div className="flex items-center gap-2">
          {isPrivate && (
            <FaLock className="text-teal-600" title="Private Room" />
          )}
         <RoomMenu handleDelete={handleDelete} handleEdit={handleEdit} isAuthor={isauthor}/>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {room.description || "No description provided."}
      </p>

      <div className="text-sm text-gray-600 space-y-1 font-medium">
        <p>
          <span className={`${isauthor ? "text-yellow-600" : "text-teal-600"}`}>
            Author:
          </span>{" "}
          {room.author?.username || "Unknown"}
        </p>
        <p>
          <span className={`${isauthor ? "text-yellow-600" : "text-teal-600"}`}>
            Title:
          </span>{" "}
          {room.title?.name || "Untitled"}
        </p>
      </div>
     
    </motion.div>
  );
};

export default RoomCard;
