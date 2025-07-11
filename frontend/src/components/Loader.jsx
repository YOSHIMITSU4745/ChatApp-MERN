// components/Loader.jsx
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <motion.div
        className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default Loader;
