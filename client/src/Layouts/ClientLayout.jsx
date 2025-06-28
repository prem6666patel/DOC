import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/users/userSlice";
import toast from "react-hot-toast";

const ClientLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
      dispatch(signoutSuccess());
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      let errorMessage = "Logout failed";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-900 text-white flex justify-between items-center px-4 py-3 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-lg font-bold">
            {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span className="font-semibold">
            {currentUser?.name || "Administrator"}
          </span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`fixed md:relative z-30 bg-gradient-to-b from-blue-900 to-blue-800 text-white w-64 md:w-64 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex flex-col h-full shadow-xl`}
      >
        <div className="p-5 border-b border-blue-700 hidden md:block">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl font-bold">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {currentUser?.name || "Administrator"}
              </h3>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto mt-3 md:mt-0">
          <ul className="p-3 space-y-1">
            {[
              { to: "/client/dashboard", icon: <FaHome />, text: "Dashboard" },
              {
                to: "/client/MyDocuments",
                icon: <IoDocumentTextSharp />,
                text: "My Documents",
              },
            ].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-amber-500 text-blue-900 font-medium shadow-md"
                        : "text-blue-100 hover:bg-blue-700"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after click
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Section */}
        <div
          onClick={() => {
            handleSignout();
            setSidebarOpen(false); // close on mobile
          }}
          className="w-full p-4 bg-blue-800 cursor-pointer hover:bg-blue-700 transition-colors mt-auto flex items-center"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 mt-14 md:mt-0">
        <div className="bg-white rounded-xl shadow-md min-h-full p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
