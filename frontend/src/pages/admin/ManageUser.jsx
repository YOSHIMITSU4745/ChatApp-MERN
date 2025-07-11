import React, { useState, useMemo } from "react";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userApiSlice";
import { useGetRoomsQuery } from "../../redux/api/roomApiSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const ManageUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], isLoading: isUsersLoading } = useGetAllUsersQuery();
  const { data: rooms = [], isLoading: isRoomsLoading } = useGetRoomsQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const getUserRooms = (userId) => {
    const created = rooms.filter((room) => room.author._id === userId);
    const joined = rooms.filter((room) =>
      room.participants.some((p) => p === userId || p._id === userId)
    );
    return { created, joined };
  };

  return (
    <div className="mt-10 px-4">
        <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="mb-6 text-center"
>
  <h2 className="text-3xl font-bold text-teal-700 mb-1">👥 Manage Users</h2>
  <p className="text-gray-600 text-sm">View, search, and manage all registered users</p>
</motion.div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        />
      </div>

      {isUsersLoading || isRoomsLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredUsers.map((user) => {
            const { created, joined } = getUserRooms(user._id);

            return (
                
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-md border border-teal-100 px-5 py-4 flex flex-col justify-between"
              >
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-teal-700">{user.username}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Created Rooms:</p>
                    {created.length > 0 ? (
                      <ul className="list-disc ml-5 text-gray-800">
                        {created.map((r) => (
                          <li key={r._id}>{r.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 ml-2">None</p>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Joined Rooms:</p>
                    {joined.length > 0 ? (
                      <ul className="list-disc ml-5 text-gray-800">
                        {joined.map((r) => (
                          <li key={r._id}>{r.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 ml-2">None</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm"
                  >
                    🗑 Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageUser;
