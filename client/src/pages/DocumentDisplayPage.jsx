import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Trash2, Eye, Download, Search, FileText } from "lucide-react";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const DocumentDisplayPage = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/file/get/${id}`);
      const files = response.data.data || [];
      setDocuments(files);
      setFilteredDocuments(files);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  useEffect(() => {
    const filtered = searchTerm.trim()
      ? documents.filter((file) =>
          file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : documents;
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await api.delete(`/file/delete/${fileToDelete}`);
      if (res.data.success) {
        toast.success("File deleted");
        fetchClientData();
      } else {
        toast.error(res.data.message || "Deletion failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting file");
    } finally {
      setIsDeleting(false);
      setOpenConfirmBoxDelete(false);
      setFileToDelete(null);
    }
  };

  const DeleteBox = ({ close, confirm, isLoading }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Confirm Deletion
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete this document?
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={close}
            disabled={isLoading}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  const handleViewFile = (file) => {
    try {
      const byteArray = new Uint8Array(
        atob(file.base64Data)
          .split("")
          .map((c) => c.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: file.fileType });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      toast.error("Cannot preview this file");
    }
  };

  const handleDownloadFile = (file) => {
    try {
      const byteArray = new Uint8Array(
        atob(file.base64Data)
          .split("")
          .map((c) => c.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: file.fileType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);

      toast.error("Failed to download");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!documents.length)
    return <div className="text-center py-10">No documents found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {openConfirmBoxDelete && (
        <DeleteBox
          close={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDelete}
          isLoading={isDeleting}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Summary */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Document Details
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              For: {documents[0]?.userId?.name || "user"}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 w-full sm:w-auto">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Documents</p>
                <p className="text-xl font-semibold">{documents.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="text-blue-600 h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Document Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  File Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Actions
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((file) => (
                  <tr key={file._id}>
                    <td className="px-4 py-3">{file.fileName}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewFile(file)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="flex items-center text-green-600 hover:text-green-800"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setFileToDelete(file._id);
                          setOpenConfirmBoxDelete(true);
                        }}
                        className="flex items-center text-red-600 hover:text-red-800"
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
                    colSpan="3"
                    className="text-center px-4 py-4 text-gray-500"
                  >
                    No documents match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentDisplayPage;
