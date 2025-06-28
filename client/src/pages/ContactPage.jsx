import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    legalMatterType: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/consultation/submit",
        formData
      );
      if (res.data.success) {
        toast.success("Your request was submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          legalMatterType: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Contact Information
          </h3>
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-amber-600 mr-4 mt-1" />
              <div>
                <div className="font-semibold text-gray-900">
                  Office Address
                </div>
                <div className="text-gray-600">
                  123 Legal Plaza, Suite 400
                  <br />
                  Downtown Business District
                  <br />
                  Metropolitan City, ST 12345
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-amber-600 mr-4 mt-1" />
              <div>
                <div className="font-semibold text-gray-900">Phone</div>
                <div className="text-gray-600">(555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-amber-600 mr-4 mt-1" />
              <div>
                <div className="font-semibold text-gray-900">Email</div>
                <div className="text-gray-600">info@sterlinglaw.com</div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="font-semibold text-gray-900 mb-4">Office Hours</h4>
            <div className="text-gray-600 space-y-1">
              <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
              <div>Saturday: 9:00 AM - 2:00 PM</div>
              <div>Sunday: By Appointment Only</div>
            </div>
          </div>
        </div>

        {/* Consultation Form */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Free Consultation Request
          </h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-amber-600"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-amber-600"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:ring-amber-600"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:ring-amber-600"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legal Matter Type
              </label>
              <select
                name="legalMatterType"
                value={formData.legalMatterType}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:ring-amber-600"
                required
              >
                <option value="">Select area</option>
                <option>Corporate Law</option>
                <option>Criminal Defense</option>
                <option>Family Law</option>
                <option>Personal Injury</option>
                <option>Estate Planning</option>
                <option>Real Estate Law</option>
                <option>Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:ring-amber-600"
                placeholder="Please describe your legal matter..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 text-white px-6 py-4 rounded-md font-semibold hover:bg-amber-700 transform hover:scale-105 transition"
            >
              Request Free Consultation
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
