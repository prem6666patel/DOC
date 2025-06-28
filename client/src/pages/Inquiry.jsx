import {
  User,
  Mail,
  Phone,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Inquiry = () => {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const allClients = useSelector(
    (state) => state.consultations.allConsultation
  );

  useEffect(() => {
    if (allClients?.length > 0) {
      setUserData(allClients);
    }
  }, [allClients]);

  const filteredData = userData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.firstName?.toLowerCase().includes(searchLower) ||
      item.lastName?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      item.phone?.toLowerCase().includes(searchLower) ||
      item.legalMatterType?.toLowerCase().includes(searchLower) ||
      item.message?.toLowerCase().includes(searchLower)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    if (sortField === "submittedAt") {
      return sortDirection === "asc"
        ? new Date(valueA) - new Date(valueB)
        : new Date(valueB) - new Date(valueA);
    }
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inquiry Details
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm">
              Manage all Inquiries here
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Total Inquiries</p>
                  <p className="text-xl font-bold mt-1">{userData.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow mb-4">
          <div className="p-4 border-b">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search inquiries..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 uppercase cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort("firstName")}
                  >
                    <div className="flex items-center gap-1">
                      Name <SortIcon field="firstName" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 uppercase cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-1">
                      Email <SortIcon field="email" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase whitespace-nowrap">
                    Phone
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 uppercase cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort("legalMatterType")}
                  >
                    <div className="flex items-center gap-1">
                      Matter <SortIcon field="legalMatterType" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase whitespace-nowrap">
                    Message
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 uppercase cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort("submittedAt")}
                  >
                    <div className="flex items-center gap-1">
                      Submitted <SortIcon field="submittedAt" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {item.firstName} {item.lastName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        <div className="flex items-center">
                          <Mail className="mr-2 text-gray-400" size={16} />
                          {item.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        <div className="flex items-center">
                          <Phone className="mr-2 text-gray-400" size={16} />
                          {item.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        <div className="flex items-center">
                          <Briefcase className="mr-2 text-gray-400" size={16} />
                          {item.legalMatterType}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-pre-wrap break-words max-w-sm">
                        {item.message}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {formatDate(item.submittedAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No inquiries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              results
            </div>
            <div className="flex items-center gap-3">
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-md border disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-2 py-1 rounded-md border disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
