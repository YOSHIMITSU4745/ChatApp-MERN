import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMessagesByUserIdQuery } from "../redux/api/messageApiSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
import Loader from "../components/Loader";

const SidebarUserMessages = () => {
  const { userinfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // default open on desktop

  const { data: messages = [], isLoading } = useGetMessagesByUserIdQuery(
    userinfo?.id,
    {
      skip: !userinfo?.id,
    }
  );

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Floating Toggle Button on Small Screens */}
      <button
        className="fixed bottom-5 right-5 z-50 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg lg:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Sidebar"
      >
        <FiMessageSquare size={20} />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="fixed top-20 right-0 h-[calc(100vh-5rem)] w-64 bg-gradient-to-br from-white to-teal-50 border-l border-teal-200 shadow-2xl z-40 p-5 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-800">Your Messages</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>

            {isLoading ? (
              <Loader/>
            ) : messages.length === 0 ? (
              <p className="text-gray-500">You haven't sent any messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      type: "spring",
                    }}
                    onClick={() => {
                      navigate(`/room/${msg.roomid._id}`);
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-teal-100 hover:border-teal-400 p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm text-teal-700 font-semibold truncate">
                        {msg.roomid?.name || "Unknown"}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {msg.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarUserMessages;
