import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaFileUpload,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/users/userSlice";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close sidebar when resizing to larger screens if needed
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
      dispatch(signoutSuccess());
      toast.success("Logged out successfully");
      navigate("/");
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

  // Close sidebar when clicking on a link (for mobile)
  const handleNavLinkClick = () => {
    if (windowWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 relative">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-blue-900 text-white shadow-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-sm font-bold">
            {currentUser?.username?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span className="font-medium">
            {currentUser?.username || "Admin"}
          </span>
        </div>
      </header>

      {/* Sidebar - Responsive */}
      <nav
        className={`w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl fixed lg:sticky top-0 h-screen flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-blue-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl font-bold">
              {currentUser?.username?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {currentUser?.username || "Administrator"}
              </h3>
              <p className="text-blue-200 text-sm">
                {currentUser?.role || "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <ul className="p-3 space-y-1">
            {[
              { to: "/admin/dashboard", icon: <FaHome />, text: "Dashboard" },
              {
                to: "/admin/clients",
                icon: <FaUserFriends />,
                text: "Clients",
              },
              {
                to: "/admin/documents",
                icon: <FaFileUpload />,
                text: "Documents",
              },
              {
                to: "/admin/inquiry",
                icon: <MdContactMail />,
                text: "Inquiry",
              },
            ].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-amber-500 text-blue-900 font-medium shadow-md"
                        : "text-blue-100 hover:bg-blue-700"
                    }`
                  }
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
          onClick={handleSignout}
          className="w-full p-4 bg-blue-800 cursor-pointer hover:bg-blue-700 transition-colors mt-auto flex items-center"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </div>
      </nav>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 lg:p-6 mt-16 lg:mt-0">
        <div className="bg-white rounded-xl shadow-md min-h-full p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
