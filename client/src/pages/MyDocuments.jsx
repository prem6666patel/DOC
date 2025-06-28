import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, Download, Search, FileText } from "lucide-react";
import { useSelector } from "react-redux";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const MyDocuments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/file/get/${currentUser._id}`);
      const docs = response.data.data || [];
      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (error) {
      console.error("Fetch client error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch document details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [currentUser]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchTerm, documents]);

  const handleViewFile = (file) => {
    try {
      const byteCharacters = atob(file.base64Data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Failed to open file", error);
      toast.error("Cannot preview this file type");
    }
  };

  const handleDownloadFile = (file) => {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") {
        throw new Error("Download is only available in browser environments");
      }

      const byteCharacters = atob(file.base64Data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name || "download";
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(error.message || "Failed to download file");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Document Details
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              View document details for {currentUser?.name || "user"}
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex justify-between items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Total Documents</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">
                    {documents.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <FileText className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by file name..."
              className="block w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {documents.length === 0 ? (
            <div className="text-center py-10 px-4">
              No documents found. Upload your first document to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                    >
                      File Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((file) => (
                      <tr key={file._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">
                          <div className="truncate max-w-xs sm:max-w-md md:max-w-lg">
                            {file.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            <button
                              onClick={() => handleViewFile(file)}
                              className="text-blue-600 hover:text-blue-800 flex items-center text-xs sm:text-sm"
                              title="View"
                            >
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleDownloadFile(file)}
                              className="text-green-600 hover:text-green-800 flex items-center text-xs sm:text-sm"
                              title="Download"
                            >
                              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-4 text-center text-sm text-gray-500 sm:px-6"
                      >
                        No documents found matching your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
