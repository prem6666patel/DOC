import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/GlobalProvider";
import axios from "axios";
import toast from "react-hot-toast";

const AddDocument = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const allClients = useSelector((state) => state.clients.allClients);
  const { getClientsData, getfiles } = useGlobalContext();

  useEffect(() => {
    if (allClients?.length > 0) {
      setUserData(allClients);
    } else {
      getClientsData(); // fallback fetch if Redux is empty
    }
  }, [allClients, getClientsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId || !documentName || !documentFile) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("userId", selectedUserId);
      formData.append("name", documentName);
      formData.append("file", documentFile);

      await axios.post("http://localhost:5000/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Document uploaded successfully!");

      // Reset
      setSelectedUserId("");
      setDocumentName("");
      setDocumentFile(null);
      getfiles();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.response?.data?.message || "Failed to upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Add Document
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select User */}
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select User
            </label>
            <select
              id="user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            >
              <option value="">-- Select a user --</option>
              {userData.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Document Name */}
          <div>
            <label
              htmlFor="documentName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Document Name
            </label>
            <input
              type="text"
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="documentFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Document File
            </label>
            <input
              type="file"
              id="documentFile"
              ref={fileInputRef}
              onChange={(e) => setDocumentFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocument;
