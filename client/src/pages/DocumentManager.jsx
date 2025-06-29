import { User, Search, Trash2, Eye, Download, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const DocumentManager = () => {
  const { getfiles } = useGlobalContext();

  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const allClients = useSelector((state) => state.files.allFiles);
  console.log("allClients : ", allClients);

  useEffect(() => {
    if (allClients?.length > 0) {
      setUserData(allClients);
      setFilteredDocuments(allClients);
    }
  }, [allClients]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDocuments(userData);
    } else {
      const filtered = userData.filter((file) =>
        (
          file.name?.toLowerCase() +
          " " +
          file.userId?.name?.toLowerCase()
        ).includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchTerm, userData]);

  const handleDeleteClick = (fileId) => {
    setFileToDelete(fileId);
    setOpenConfirmBoxDelete(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await api.delete(`/file/delete/${fileToDelete}`);
      if (response.data.success) {
        toast.success(response.data.message);
        getfiles();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message ||
          "Delete failed. Please check your authentication."
      );
    } finally {
      setIsDeleting(false);
      setOpenConfirmBoxDelete(false);
      setFileToDelete(null);
    }
  };

  const DeleteBox = ({ close, confirm, isLoading }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
        <p className="mt-2 text-gray-500">
          Are you sure you want to delete this document? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={close}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  const handleViewFile = (file) => {
    try {
      if (!file.base64Data) throw new Error("File data is missing");
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
      if (!file.base64Data) throw new Error("File data is missing");
      const byteCharacters = atob(file.base64Data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName || "download";
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

  const handleRegisterDOC = () => {
    navigate("/admin/addDocument");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Documents Details
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage all Documents here
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Total Documents</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">
                    {userData.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <User className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by file name or client name ..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleRegisterDOC}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm sm:text-base flex items-center justify-center whitespace-nowrap hover:bg-blue-700 transition"
          >
            <Plus size={18} className="mr-2" />
            Add New Document
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((file) => (
                  <tr key={file._id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900">
                      {file.userId?.name || "Unknown"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900">
                      {file.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewFile(file)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="text-green-600 hover:text-green-800 flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                      <button
                        onClick={() => handleDeleteClick(file._id)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No documents found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openConfirmBoxDelete && (
        <DeleteBox
          close={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default DocumentManager;
