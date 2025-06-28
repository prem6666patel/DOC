import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Briefcase } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const EditClient = () => {
  const { getClientsData } = useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    type: "Others",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const PRACTICE_AREAS = [
    "Corporate Law",
    "Criminal Defense",
    "Family Law",
    "Personal Injury",
    "Estate Planning",
    "Real Estate Law",
    "Others",
  ];

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await api.get(`/user/get/${id}`);
        if (response.data.success) {
          const { name, email, contact, type } = response.data.data;
          setFormData({ name, email, contact, type });
        } else {
          throw new Error(
            response.data.message || "Failed to fetch client data"
          );
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        navigate("/admin/clients");
      } finally {
        setIsFetching(false);
      }
    };

    fetchClientData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Invalid phone number (10 digits)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(`/user/update/${id}`, formData);
      if (response.data.success) {
        toast.success("Client updated successfully!");
        await getClientsData();
        navigate("/admin/clients");
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      let errorMessage = "Update failed. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 409) {
        errorMessage = "Email is already registered";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "No server response. Check your connection.";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-6 sm:mb-10">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-amber-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Briefcase className="text-white h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Edit Client Account
          </h1>
          <p className="text-sm text-gray-500 mt-1 sm:mt-2">
            Note: Password cannot be changed from this form
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm sm:text-base`}
                  placeholder="John Doe"
                />
                <User className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm sm:text-base`}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <div className="relative">
                <input
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.contact ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm sm:text-base`}
                  placeholder="1234567890"
                />
                <Phone className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              </div>
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
              )}
            </div>

            {/* Area */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none appearance-none bg-white text-sm sm:text-base"
                >
                  {PRACTICE_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <Briefcase className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => navigate("/admin/clients")}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Updating...
                </>
              ) : (
                "Update Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditClient;
