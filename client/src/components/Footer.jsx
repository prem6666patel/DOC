import React from "react";
import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Scale className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold">Sterling & Associates</span>
          </div>
          <p className="text-gray-300 mb-4 max-w-md">
            Providing exceptional legal services with integrity, dedication, and
            expertise for over 25 years.
          </p>
          <div className="text-sm text-gray-400">
            © 2024 Sterling & Associates. All rights reserved.
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            {["/", "/services", "/about", "/contact"].map((path, idx) => (
              <li key={idx}>
                <Link to={path} className="hover:text-amber-400 transition">
                  {path.replace("/", "") || "Home"}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:text-amber-400">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400">
                Attorney Advertising
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400">
                Disclaimer
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
