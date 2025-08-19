import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  AlertTriangle,
  FileText,
  CreditCard,
  RefreshCw,
  Shield,
} from "lucide-react";

const Notifications = () => {
  const [filterBy, setFilterBy] = useState("All");

  const notifications = [
    {
      id: 1,
      type: "warning",
      icon: AlertTriangle,
      title: "Compliance Document Expiring",
      description: "Annual review for Trade license due for renewal",
      time: "Now",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
    {
      id: 2,
      type: "info",
      icon: FileText,
      title: "Quarterly Report Overdue",
      description:
        "Q3 reports pending for the following departments in Admin",
      time: "6 minutes",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      id: 3,
      type: "error",
      icon: CreditCard,
      title: "Payment Processing Failed",
      description: "Issue with Transaction number #4569879",
      time: "15 minutes",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
    },
    {
      id: 4,
      type: "info",
      icon: RefreshCw,
      title: "Supplier Contract Renewal",
      description: "Agreement with XYZ Supplies due for renewal next month",
      time: "28 minutes",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      id: 5,
      type: "warning",
      icon: Shield,
      title: "Security Patch Updates",
      description: "System security patch found and requires action by COO",
      time: "35 minutes",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
  ];

  const stats = [
    { label: "Total Notifications", value: "123", color: "text-gray-700" },
    { label: "Unread", value: "34", color: "text-gray-700" },
    { label: "Urgent", value: "19", color: "text-gray-700" },
    { label: "System Alerts", value: "25", color: "text-gray-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
            Notifications Center
          </h2>
          <p className="text-sm text-gray-600">
            Manage alerts and system notifications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 
                        flex flex-col items-center justify-center text-center"
            >
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="mb-5">
          <div className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 
                             text-sm border border-gray-300 rounded-lg bg-white 
                             hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() =>
                    setFilterBy(filterBy === "All" ? "Urgent" : "All")
                  }
                >
                  <span className="text-gray-700">Filter by</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${notification.bgColor} border-l-4 ${notification.borderColor} 
                            hover:bg-opacity-80 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-md bg-white shadow-sm">
                    <notification.icon
                      className={`w-5 h-5 ${notification.iconColor}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {notification.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {notification.time}
                      </span>
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 focus:outline-none">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
