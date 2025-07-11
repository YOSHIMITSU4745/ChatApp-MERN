import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RoomMenu = ({ handleEdit, handleDelete, isAuthor }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);

    // Optional: auto close after 3 seconds
    setTimeout(() => {
      setShowMenu(false);
    }, 10000);
  };

  if(!isAuthor) return null;
  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-teal-100 transition"
      >
        <FaEllipsisV className="text-teal-700" />
      </button>

      <AnimatePresence>
        {showMenu && (   

          <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-[-10] z-50 mt-2 w-40 rounded-xl bg-white shadow-lg ring-1 ring-teal-100 overflow-hidden"
          >
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left hover:bg-teal-50 hover:text-teal-700 transition flex items-center gap-2"
              >
                <FaEdit/>
                Edit Room
              </button>
            </li>
            <li>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 hover:text-red-700 transition flex items-center gap-2"
                >
                  <FaTrash/>
                Delete Room
              </button>
            </li>
          </ul>
        </motion.div>
              )}
      </AnimatePresence>
    </div>
  );
};

export default RoomMenu;
