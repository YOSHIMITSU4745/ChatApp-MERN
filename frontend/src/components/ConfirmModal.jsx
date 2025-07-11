import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold text-teal-700 mb-3">
                Confirm Deletion
              </h2>
              <p className="text-gray-700 mb-5">
                Are you sure ? 
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                  onClick={onConfirm}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
