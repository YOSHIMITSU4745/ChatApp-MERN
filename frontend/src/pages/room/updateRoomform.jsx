import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import {
  useGetRoomByIdQuery,
  useRemoveParticipantMutation,
  useUpdateRoomMutation,
} from "../../redux/api/roomApiSlice";
import { useGetTitleQuery } from "../../redux/api/titleApiSlice";
import Loader from "../../components/Loader";

const UpdateRoomForm = () => {

  
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: room, isLoading: isRoomLoading } = useGetRoomByIdQuery(id);
  const { userinfo } = useSelector((state) => state.auth);
  const [updateRoom, { isLoading }] = useUpdateRoomMutation();
  const { data: titles = [] } = useGetTitleQuery();
  const [remove] = useRemoveParticipantMutation();


  const isAdmin = userinfo.isAdmin; 
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    password: "",
    isPublic: true, // Derived later from room data
  });
  
  const [removeParticipant, setRemoveParticipant] = useState("");

  // Sync formData with room data after load
  useEffect(() => {
    if (room) {
      // console.log('room', room)
      setFormData({
        name: room.name || "",
        title: room.title?._id || "",
        password: room.password || "",
        isPublic: room.password ? false : true, // Derive from password existence
      });
    }
  }, [room]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.name,
        title: formData.title,
        password: formData.isPublic ? "" : formData.password,
      };
      
      await updateRoom({ id: room._id, data: updateData });
      toast.success("Room updated successfully");
    } catch (err) {
      toast.error("Failed to update room");
      console.error(err);
    }
  };
  
  const handleRemoveParticipant = async () => {
    try {
      
      
      const isparticipant = room?.participants.some(user => user._id=== removeParticipant.trim());
      if(!isparticipant)
        {
          toast.error("No such Participant!");
          return;
        }
        await remove({
          name: removeParticipant.trim(),
          data: { _id: room?._id },
        });
        toast.success(`Removed participant ${removeParticipant} from Room!`);
        setRemoveParticipant("");
      } catch (err) {
        console.error(err.message);
        toast.error("Failed to remove participant");
      }
    };
    
    if (isRoomLoading) return <Loader/>;

    if(!isAdmin)
     if(userinfo.id !=room?.author?._id) navigate('/');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-teal-700 text-center">
        Update Room
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Room Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">Select a title</option>
            {titles.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-medium">Room Visibility:</label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="visibility"
              checked={formData.isPublic}
              onChange={() =>
                setFormData((prev) => ({ ...prev, isPublic: true, password: "" }))
              }
            />
            Public
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="visibility"
              checked={!formData.isPublic}
              onChange={() =>
                setFormData((prev) => ({ ...prev, isPublic: false }))
              }
            />
            Private
          </label>
        </div>

        {!formData.isPublic && (
          <div>
            <label className="block text-gray-700 font-medium">
              Room Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              required={!formData.isPublic}
            />
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md"
          disabled={isLoading}
        >
          Update Room
        </motion.button>
      </form>

      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-3">
          Remove a Participant
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Username"
            value={removeParticipant}
            onChange={(e) => setRemoveParticipant(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveParticipant}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
          >
            Remove
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateRoomForm;
