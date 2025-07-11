import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useDeleteCurrentUserMutation,
  useLogoutMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router";
import Loader from "../../components/Loader";
import { logOut } from "../../redux/features/auth/authSlice";
import ConfirmModal from "../../components/ConfirmModal";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteuser, { isLoading: isDeleting }] =
    useDeleteCurrentUserMutation();
  const [logout, { isLoading: isLogginOut }] = useLogoutMutation();
  const isLoading = isDeleting || isLogginOut || isUpdating;
  useEffect(() => {
    if (userinfo) {
      console.log(userinfo);
      setFormData({
        username: userinfo.username || "",
        email: userinfo.email || "",
        userId: userinfo._id || userinfo.id || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userinfo]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password confirmation if password is entered
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Prepare the update payload
      const updatePayload = {
        username: formData.username,
        email: formData.email,
      };

      // Include password only if provided
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const result = await updateUser(updatePayload).unwrap();

      toast.success("Profile updated successfully!");
      // Optionally update redux auth state here if needed
      dispatch(setCredentials(result));

      navigate("/");
      // Clear passwords after successful update
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteuser();
      await logout();
      dispatch(logOut());

      toast.success("Account deleted successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete account!");
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-teal-600 text-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="userId" className="block mb-1 font-medium">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed disabled:bg-teal-600 "
          />
        </div>

        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            New Password (optional)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter new password"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition-colors"
        >
          Update Profile
        </button>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="w-full mt-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </form>

      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          handleDelete();
        }}
        onCancel={() => setShowConfirm(false)}
      />

      {isLoading && <Loader />}
    </div>
  );
};

export default UserProfile;
