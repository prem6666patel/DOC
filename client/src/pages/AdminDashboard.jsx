import React from "react";
import {
  FaSearch,
  FaBell,
  FaEnvelope,
  FaCalendarAlt,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileExcel,
  FaEllipsisV,
  FaFileUpload,
} from "react-icons/fa";
import { FaUserFriends, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const allClients = useSelector((state) => state.clients.allClients);
  const allDocuments = useSelector((state) => state.files.allFiles);
  const allInquirey = useSelector(
    (state) => state.consultations.allConsultation
  );

  const stats = {
    totalClients: allClients.length,
    activeCases: allInquirey.length,
    totalDocuments: allDocuments.length,
  };

  // Count clients by their practice area
  const countClientsByPracticeArea = () => {
    const practiceAreas = {
      "Corporate Law": 0,
      "Criminal Defense": 0,
      "Family Law": 0,
      "Personal Injury": 0,
      "Estate Planning": 0,
      "Real Estate Law": 0,
      Others: 0,
    };

    allClients.forEach((client) => {
      const practiceArea = client.type || "Others";
      // eslint-disable-next-line no-prototype-builtins
      if (practiceAreas.hasOwnProperty(practiceArea)) {
        practiceAreas[practiceArea]++;
      } else {
        practiceAreas["Others"]++;
      }
    });

    return practiceAreas;
  };

  const practiceAreaCounts = countClientsByPracticeArea();

  // Pie Chart Data
  const clientPracticeAreaPieData = {
    labels: Object.keys(practiceAreaCounts),
    datasets: [
      {
        data: Object.values(practiceAreaCounts),
        backgroundColor: [
          "#3B82F6", // Corporate Law - blue
          "#EF4444", // Criminal Defense - red
          "#10B981", // Family Law - green
          "#F59E0B", // Personal Injury - amber
          "#8B5CF6", // Estate Planning - purple
          "#EC4899", // Real Estate Law - pink
          "#64748B", // Others - gray
        ],
        borderWidth: 0,
      },
    ],
  };

  // Bar Chart Data (using same data as pie chart)
  const clientPracticeAreaBarData = {
    labels: Object.keys(practiceAreaCounts),
    datasets: [
      {
        label: "Number of Clients",
        data: Object.values(practiceAreaCounts),
        backgroundColor: [
          "#3B82F6", // Corporate Law - blue
          "#EF4444", // Criminal Defense - red
          "#10B981", // Family Law - green
          "#F59E0B", // Personal Injury - amber
          "#8B5CF6", // Estate Planning - purple
          "#EC4899", // Real Estate Law - pink
          "#64748B", // Others - gray
        ],
        borderRadius: 4,
      },
    ],
  };

  const hadleToClient = () => {
    navigate("/admin/clients");
  };

  const hadleToInquiry = () => {
    navigate("/admin/inquiry");
  };

  const hadleTodocuments = () => {
    navigate("/admin/documents");
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome back! Here's what's happening with your cases today.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
        {/* Clients Card */}
        <div
          onClick={hadleToClient}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs sm:text-sm text-gray-500 font-medium">
                Total Clients
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
                {stats.totalClients}
              </p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <FaUserFriends className="text-blue-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        {/* Active Cases Card */}
        <div
          className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={hadleToInquiry}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs sm:text-sm text-gray-500 font-medium">
                Total Inquiry
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
                {stats.activeCases}
              </p>
            </div>
            <div className="bg-amber-100 p-2 sm:p-3 rounded-lg">
              <FaFilePdf className="text-amber-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div
          className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={hadleTodocuments}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs sm:text-sm text-gray-500 font-medium">
                Total Documents
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
                {stats.totalDocuments}
              </p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
              <FaFileUpload className="text-green-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
        {/* Client Practice Areas Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
              Client Distribution by Practice Area
            </h3>
            <div className="flex space-x-2">
              <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-lg">
                Count
              </button>
              <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
                Percentage
              </button>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <Bar
              data={clientPracticeAreaBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                    title: {
                      display: true,
                      text: "Number of Clients",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Client Practice Areas Pie Chart */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
            Practice Area Distribution
          </h3>
          <div className="h-56 sm:h-64">
            <Pie
              data={clientPracticeAreaPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                      padding: 16,
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12,
                      },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
