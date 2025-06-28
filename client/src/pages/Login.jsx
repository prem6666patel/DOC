import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/users/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      dispatch(signInStart());
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(signInSuccess(response.data.user));
        toast.success("Login successful");
        if (response.data.user.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/client/dashboard");
        }
      } else {
        toast.error(response.data.message || "Login failed");
        dispatch(signInFailure(response.data.message));
      }
    } catch (err) {
      dispatch(signInFailure(err));
      if (err.response?.status === 401) {
        toast.error("Invalid password");
      } else {
        toast.error(
          err.response?.data?.message || "Login failed. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Login to Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your legal dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-600 focus:outline-none"
                placeholder="you@example.com"
              />
              <Mail className="absolute left-3 top-3 text-amber-600 h-5 w-5" />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-600 focus:outline-none"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-3 text-amber-600 h-5 w-5" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-amber-700 transition-all disabled:bg-amber-400"
            >
              {loading ? (
                <span className="flex justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
