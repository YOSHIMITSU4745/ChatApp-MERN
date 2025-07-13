import React, { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
  FiSearch,
  FiLogIn,
  FiUserPlus,
  FiShield,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";

const Navigation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { userinfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutuser,{isLoading}] = useLogoutMutation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false); // Optional: close menu on mobile
    }
  };

  const handleLogout = async () => {
    dispatch(logOut());
    try {
      const msg = await logoutuser().unwrap();
      toast.success(msg.message);
      navigate("/");
    } catch (error) {
      toast.error(`Error : ${error.message}`);
    }
  };

  return (
    <nav className="bg-gray-900/95 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div
          className="text-3xl font-bold cursor-pointer tracking-wide text-teal-400 hover:text-teal-300 transition"
          onClick={() => navigate("/")}
        >
          Chat<span className="text-white">App</span>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Search + Links */}
        <div className="hidden md:flex items-center space-x-6 w-full max-w-2xl mx-6">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex flex-grow">
            <input
              type="text"
              placeholder="Search Rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow caret-teal-500 text-teal-600 px-4 py-2 rounded-l-md text-black focus:outline-none placeholder-teal-700"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 px-4 py-2 rounded-r-md text-white transition"
            >
              <FiSearch size={20} />
            </button>
          </form>

          {/* Right Section */}
          {userinfo ? (
            <div className="flex items-center space-x-4">
              {userinfo.isAdmin && (
                <Link
                  to="/admin"
                  className="bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-1 rounded-full flex items-center gap-2 font-semibold transition shadow-sm"
                >
                  <FiShield size={18} />
                  Admin
                </Link>
              )}
              <Link to="/profile">
                <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition shadow-sm">
                  <HiUserCircle size={22} />
                  <span className="font-medium">Hi, {userinfo.username}</span>
                </div>
              </Link>
              <div
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-1 bg-gray-400 hover:bg-gray-600 text-white rounded-full font-medium transition cursor-pointer shadow-sm"
              >
                <FiLogOut size={20} />
                Logout
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-3 py-1 rounded-full transition shadow"
              >
                <FiLogIn />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white px-3 py-1 rounded-full transition shadow"
              >
                <FiUserPlus />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Search Rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow caret-teal-500 text-teal-600 px-4 py-2 rounded-l-md text-black focus:outline-none placeholder-teal-700"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 px-4 py-2 rounded-r-md text-white transition"
            >
              <FiSearch size={20} />
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {userinfo ? (
              <>
                {userinfo.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow"
                  >
                    <FiShield />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg shadow"
                >
                  <HiUserCircle />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg shadow"
                >
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg shadow"
                >
                  <FiLogIn />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow"
                >
                  <FiUserPlus />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
