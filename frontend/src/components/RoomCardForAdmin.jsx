
import { useSelector } from "react-redux";
import {motion} from 'framer-motion'

const RoomCardForAdmin = ({ room ,fromadmin }) => {
  const { userinfo } = useSelector((state) => state.auth);

  
  const isauthor = room.author?._id === userinfo.id;


  


  const baseClasses =
    "rounded-xl shadow-md p-5  cursor-pointer";
  const cardClasses = isauthor
    ? "bg-yellow-50 border-yellow-500 shadow-xl"
    : "bg-teal-50 border-teal-500 shadow-xl";

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      
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

export default RoomCardForAdmin;
