import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetTitleQuery } from "../../redux/api/titleApiSlice";
import { useCreateRoomMutation } from "../../redux/api/roomApiSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const CreateRoom = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");

  const navigate = useNavigate();  
  const {userinfo} = useSelector((state)=>state.auth);    
  const { data: titles = [], isLoading: loadingTitles } = useGetTitleQuery();
  const [createRoom, { isLoading: creating }] = useCreateRoomMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      password: isPublic ? "" : password,
      title,
      author:userinfo.id
    };

    try {
      const newroom = await createRoom(payload).unwrap();
      console.log(newroom);
      toast.success("Room created successfully!");
      navigate('/');  
      // Optional: redirect or reset form
    } catch (err) {
      console.error("Error creating room:", err);
      toast.error("Failed to create room.");
    }
  };

  if (loadingTitles) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 bg-teal-50 p-6 rounded-2xl shadow-lg border border-teal-300"
    >
      <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">Create New Room</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-teal-700 font-medium mb-1">Room Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-teal-700 font-medium mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="What is this room about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-teal-700 font-medium mb-1">Select Title</label>
          <select
            className="w-full px-4 py-2 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          >
            <option value="" disabled>
              Choose a title
            </option>
            {titles.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-teal-700 font-medium">Make Room Public</span>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-14 h-7 rounded-full relative transition duration-300 ${
              isPublic ? "bg-teal-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isPublic ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>

        {!isPublic && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-teal-700 font-medium mb-1 mt-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Set room password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>
        )}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-xl transition"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Room"}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateRoom;
