import React, { useRef } from 'react';
import { useGetUsersCountQuery } from '../../redux/api/userApiSlice';
import { useGetMessagesCountQuery } from '../../redux/api/messageApiSlice';
import ManageRooms from './ManageRooms';
import { useGetRoomsQuery } from '../../redux/api/roomApiSlice';
import Loader from '../../components/Loader';
import ManageUser from './ManageUser';

const AdminPage = () => {
  const { data: roomList = [], isLoading: loadingRooms } = useGetRoomsQuery();
  const { data: usersCount, isLoading: isUserCountLoading } = useGetUsersCountQuery();
  const { data: messagesCount, isLoading: isMessageCountLoading } = useGetMessagesCountQuery();

  const isLoading = isUserCountLoading || isMessageCountLoading || loadingRooms;

  const roomsRef = useRef(null);
  const usersRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-teal-50 px-6 sm:px-10 pb-10">
      <h1 className="text-4xl font-bold text-teal-800 mt-8 mb-6 text-center">Admin Dashboard</h1>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { title: 'Users', count: usersCount?.count },
          { title: 'Rooms', count: roomList.length },
          { title: 'Messages', count: messagesCount?.count }
        ].map((info, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-md text-center border border-teal-100 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-teal-700 mb-1">{info.title}</h2>
            <p className="text-3xl font-bold text-gray-800">{info.count}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-teal-700 transition"
          onClick={() => scrollToSection(roomsRef)}
        >
          📂 Manage Rooms
        </button>
        <button
          className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-teal-700 transition"
          onClick={() => scrollToSection(usersRef)}
        >
          👤 Manage Users
        </button>
      </div>

      {/* Manage Rooms Section */}
      <section
        ref={roomsRef}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-12"
      >
        <h2 className="text-2xl font-bold text-teal-800 mb-4 border-b pb-2">📂 Manage Rooms</h2>
        <ManageRooms />
      </section>

      {/* Manage Users Section */}
      <section
        ref={usersRef}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <h2 className="text-2xl font-bold text-teal-800 mb-4 border-b pb-2">👤 Manage Users</h2>
        <ManageUser />
      </section>
    </div>
  );
};

export default AdminPage;
