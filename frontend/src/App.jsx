import React, { useState } from "react";
import Navigation from "./pages/auth/Nav";
import Sidebar from "./pages/sideBar";
import SidebarUserMessages from "./pages/sideBarRight";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { userinfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const hideNavPaths = ["/admin"];
  const shouldShow = !hideNavPaths.includes(location.pathname);

  return (
    <>
      <ToastContainer />
      <Navigation />

      {/* Sidebar toggle */}
      {userinfo && shouldShow && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Right Sidebar */}
      {userinfo && shouldShow && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <main
        className={`py-3 transition-all duration-300 ${
          userinfo && shouldShow && sidebarOpen ? "md:pl-64" : "pl-16"
        }`}
      >
        <Outlet />
      </main>
    </>
  );
};

export default App;
