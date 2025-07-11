import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetJoinedRoomsQuery,
  useGetRoomsQuery,
} from "../redux/api/roomApiSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import RoomCard from "../components/roomCard";
import { motion } from "framer-motion";
import SidebarUserMessages from "./sideBarRight";

const Home = () => {
  const { userinfo } = useSelector((state) => state.auth);

  const { data: allrooms, isLoading: isallroomsLoading } = useGetRoomsQuery();
  const { data: joinedrooms, isLoading: isjoinedroomsLoading } =
    useGetJoinedRoomsQuery();
  const navigate = useNavigate();

  const isLoading = isjoinedroomsLoading || isallroomsLoading;

  let rooms = [];

  if (!isLoading) {
    rooms = joinedrooms && joinedrooms.length > 0 ? joinedrooms : allrooms;
  }

  if (!userinfo) {
    return (
      <div className="text-center pt-20">
        <h1 className="text-4xl font-bold text-teal-700">
          Welcome to the Chat App
        </h1>
        <p className="mt-4 text-lg text-gray-700">Let's connect people.</p>

        <div className="mt-8 flex justify-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-xl transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-white border border-teal-600 text-teal-600 font-semibold py-2 px-6 rounded-xl hover:bg-teal-50 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (

    <div >
    {window.innerWidth >= 1024 && <SidebarUserMessages />}

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto px-4 py-8 lg:pr-72 transition-all duration-300"

      >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-800">
          {joinedrooms && joinedrooms.length > 0 ? "Joined" : "All"} Rooms
        </h2>
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
        <div className="grid gap-5 sm:grid-cols-2 sm:grid-cols-3">
          {rooms?.map((room) => (
            <div key={room._id} onClick={() => navigate(`/room/${room._id}`)}>
              <RoomCard room={room}  />
            </div>
          ))}
        </div>
      )}
    </motion.div>
    </div>
  );
};

export default Home;
