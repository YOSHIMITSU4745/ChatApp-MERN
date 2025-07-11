import React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useGetSearchRoomQuery } from "../redux/api/roomApiSlice";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import RoomCard from "../components/roomCard";
import SidebarUserMessages from "./sideBarRight";

const SearchPage = () => {
  const [searchparams] = useSearchParams();
  const query = searchparams.get("q");
  const navigate = useNavigate();
  const { data: rooms, isLoading } = useGetSearchRoomQuery(query);

  return (
    <>
      {/* Right Sidebar - collapses on lg and below */}
   
        {window.innerWidth >= 1024 && <SidebarUserMessages />}
      

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        // Responsive padding-right for sidebar space on large screens
        className="max-w-5xl mx-auto px-4 py-8 lg:pr-[17rem]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-800">Available Rooms</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/createroom")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded-xl transition"
          >
            + Create New Room
          </motion.button>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {rooms?.map((room) => (
              <div key={room._id} onClick={() => navigate(`/room/${room._id}`)}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default SearchPage;
