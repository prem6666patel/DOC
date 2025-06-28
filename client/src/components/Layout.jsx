import React, { useState } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import Footer from "./Footer";

const navItems = [
  { id: "home", path: "/", label: "Home" },
  { id: "services", path: "/services", label: "Services" },
  { id: "about", path: "/about", label: "About" },
  { id: "contact", path: "/contact", label: "Contact" },
  { id: "login", path: "/login", label: "login" },
];

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-amber-600" />
              <Link to="/" className="text-2xl font-bold text-slate-900">
                Sterling & Associates
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                        : "text-gray-700 hover:text-amber-600"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="bg-amber-600 text-white px-6 py-2 rounded-md font-medium hover:bg-amber-700 transition"
              >
                Free Consultation
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block font-medium ${
                    isActive
                      ? "text-amber-600"
                      : "text-gray-700 hover:text-amber-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-amber-600 text-white px-6 py-2 rounded text-center"
            >
              Free Consultation
            </Link>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
