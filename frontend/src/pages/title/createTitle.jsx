import React, { useState } from "react";
import { useGetTitleQuery, useCreateTitleMutation, useUpdateTitleMutation } from "../../redux/api/titleApiSlice";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const TitleManagerPage = () => {
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const { data: titles = [], isLoading } = useGetTitleQuery();
  const [createTitle] = useCreateTitleMutation();
  const [updateTitle] = useUpdateTitleMutation();

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await createTitle({ name: newTitle }).unwrap();
      toast.success("Title created");
      setNewTitle("");
    } catch (err) {
      toast.error("Failed to create title");
      console.error(err);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await updateTitle({ id, data:{name:editingName} }).unwrap();
      toast.success("Title updated");
      setEditingId(null);
    } catch (err) {
      toast.error("Update failed");
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">Manage Titles</h2>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New title name"
          className="flex-1 px-4 py-2 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleCreate}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          + Add Title
        </button>
      </div>

      {isLoading ? (
        <Loader/>
      ) : (
        <div className="flex flex-wrap gap-4">
          {titles.map((title) => (
            <motion.div
              key={title._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
            >
              {editingId === title._id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="bg-white px-2 py-1 rounded border border-teal-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleEditSave(title._id)}
                    className="text-sm text-teal-700 font-semibold hover:underline"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium">{title.name}</span>
                  <button
                    onClick={() => {
                      setEditingId(title._id);
                      setEditingName(title.name);
                    }}
                    className="text-teal-600 hover:text-teal-800 ml-2"
                  >
                    <FaEdit />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TitleManagerPage;
