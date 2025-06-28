import {
  User,
  Mail,
  Phone,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useGlobalContext } from "../provider/GlobalProvider";
import { GrDocumentText } from "react-icons/gr";

const ClientManagement = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState({});

  const allClients = useSelector((state) => state.clients.allClients);
  const { getClientsData } = useGlobalContext();

  useEffect(() => {
    // Adjust items per page based on screen size
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(3);
      } else if (window.innerWidth < 768) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (allClients?.length > 0) {
      setUserData(allClients);
    }
  }, [allClients]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
  });

  const filteredData = userData.filter((client) =>
    Object.values(client).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const handleRegister = () => navigate("/admin/register");
  const handleEdit = (clientId) => navigate(`/admin/edit-client/${clientId}`);
  const handleDocuments = (id) => navigate(`/admin/doc-client/${id}`);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(
        `/user/delete/${deleteClientId}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getClientsData();
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
    }
  };

  const toggleMobileMenu = (id) => {
    setIsMobileMenuOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const DeleteBox = ({ close, confirm, isLoading }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <h3 className="text-lg font-medium text-gray-900">
            Confirm Deletion
          </h3>
          <p className="mt-2 text-gray-500">
            Are you sure you want to delete this client? This action cannot be
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Clients Details
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage all Clients here
            </p>
          </div>

          {/* Stats Card */}
          <div className="w-full md:w-auto">
            <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
              <div className="flex justify-between items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Total Clients
                  </p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">
                    {userData.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <User className="text-blue-600" size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden mb-6">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                onClick={handleRegister}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center whitespace-nowrap hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                <Plus size={18} className="mr-2" />
                Add New Client
              </button>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden sm:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["name", "email", "contact", "type"].map((key) => (
                    <th
                      key={key}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {renderSortIcon(key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="mr-2 text-gray-400" size={16} />
                          {client.email}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="mr-2 text-gray-400" size={16} />
                          {client.contact}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Briefcase className="mr-2 text-gray-400" size={16} />
                          {client.type || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDocuments(client._id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <GrDocumentText size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(client._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setOpenConfirmBoxDelete(true);
                              setDeleteClientId(client._id);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {filteredData.length === 0 && searchTerm
                        ? "No matching clients found"
                        : "No clients available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Mobile List View */}
            <div className="sm:hidden">
              {currentItems.length > 0 ? (
                currentItems.map((client) => (
                  <div
                    key={client._id}
                    className="border-b border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Mail className="mr-1 text-gray-400" size={14} />
                          {client.email}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Phone className="mr-1 text-gray-400" size={14} />
                          {client.contact}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Briefcase className="mr-1 text-gray-400" size={14} />
                          {client.type || "N/A"}
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleMobileMenu(client._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {isMobileMenuOpen[client._id] && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleDocuments(client._id);
                                  toggleMobileMenu(client._id);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <GrDocumentText className="mr-2" size={14} />
                                Documents
                              </button>
                              <button
                                onClick={() => {
                                  handleEdit(client._id);
                                  toggleMobileMenu(client._id);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="mr-2" size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setOpenConfirmBoxDelete(true);
                                  setDeleteClientId(client._id);
                                  toggleMobileMenu(client._id);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Trash className="mr-2" size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  {filteredData.length === 0 && searchTerm
                    ? "No matching clients found"
                    : "No clients available"}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center mx-4">
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, sortedData.length)}
                    </span>{" "}
                    of <span className="font-medium">{sortedData.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
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

export default ClientManagement;
