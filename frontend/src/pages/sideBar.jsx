import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetTitleQuery } from "../redux/api/titleApiSlice";
import { FaHome, FaUser, FaTag, FaPlus } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { userinfo } = useSelector((state) => state.auth);
  const { data: titles = [], isLoading } = useGetTitleQuery();

  // Collapse if screen is small
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768); // Collapse below md
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const handleTitleClick = (titleName) => {
    navigate(`/search?q=${encodeURIComponent(titleName)}`);
  };

  const handleAddTitle = () => {
    navigate("/managetitles");
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 left-0 h-screen bg-teal-700 text-white shadow-lg z-30 overflow-y-auto"
    >
      {/* Collapse toggle: show only on small screens */}
      <div className="md:hidden flex justify-end p-2">
        <button onClick={() => setSidebarOpen((prev) => !prev)}>
          <FaBars size={20} />
        </button>
      </div>

      {sidebarOpen && (
        <div className="p-5">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-100">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/search?q=")}
                  className="flex items-center gap-2 hover:bg-teal-600 px-3 py-2 rounded-md w-full"
                >
                  <FaHome /> All Rooms
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    navigate(`/search?q=${encodeURIComponent(userinfo?.username)}`)
                  }
                  className="flex items-center gap-2 hover:bg-teal-600 px-3 py-2 rounded-md w-full"
                >
                  <FaUser /> My Rooms
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-teal-100 flex items-center gap-2">
                <FaTag /> Titles
              </h3>
              {userinfo?.isAdmin && (
                <button
                  title="Create Title"
                  onClick={handleAddTitle}
                  className="text-white hover:text-teal-200 transition"
                >
                  <FaPlus />
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="text-sm text-teal-200">Loading titles...</p>
            ) : (
              <ul className="space-y-2">
                {titles.map((title, index) => (
                  <li key={title._id}>
                    <button
                      onClick={() => handleTitleClick(title.name)}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-teal-600 transition"
                    >
                      <span className="text-sm font-semibold text-teal-200">
                        {index + 1}.
                      </span>
                      <span>{title.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
