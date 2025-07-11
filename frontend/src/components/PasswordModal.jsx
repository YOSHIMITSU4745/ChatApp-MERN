import React, { useState } from "react";

const PasswordModal = ({ isOpen, onSubmit, onClose }) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 opacity-100">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-teal-700">Enter Room Password</h2>
        <input
          type="password"
          placeholder="Room Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-teal-600 text-white px-4 py-2 rounded-lg"
            onClick={() => onSubmit(password)}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
