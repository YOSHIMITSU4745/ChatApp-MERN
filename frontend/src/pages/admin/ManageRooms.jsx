import React, { useState } from "react";
import {
  useDeleteRoomMutation,
  useGetRoomsQuery,
} from "../../redux/api/roomApiSlice";

import { toast } from "react-toastify";
import RoomCardForAdmin from "../../components/RoomCardForAdmin";
import {motion} from 'framer-motion';
import { useNavigate } from "react-router";

const ManageRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: rooms = [] } = useGetRoomsQuery();
  const [deleteRoom] = useDeleteRoomMutation();
  const navigate = useNavigate();

  const handleSearch = () => {
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.author.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id);
        toast.success("Room deleted");
      } catch (err) {
        toast.error("Error deleting room");
      }
    }
  };

  const filteredRooms = handleSearch();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 text-center"
      >
        <h2 className="text-3xl font-bold text-teal-700 mb-1">
          📂 Manage Rooms
        </h2>
        <p className="text-gray-600 text-sm">
          Search, update, or delete any room
        </p>
      </motion.div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by name or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div key={room._id} className="relative">
              <RoomCardForAdmin room={room} fromadmin={true} />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => navigate(`/updateroom/${room._id}`)}
                  className="bg-yellow-300 text-yellow-900 text-xs px-3 py-1 rounded-lg shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No matching rooms found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageRooms;
