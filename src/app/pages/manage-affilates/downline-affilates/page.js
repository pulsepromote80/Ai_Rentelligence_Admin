"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonalTeamList } from "@/app/redux/communitySlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaSearch, FaFileExcel, FaSyncAlt } from "react-icons/fa";
import Spinner from "@/app/common/spinner";

const DownlineAffiliates = () => {
  const dispatch = useDispatch();
  const [authLogin, setAuthLogin] = useState("");
  const [searched, setSearched] = useState(false);
  const [lastSearched, setLastSearched] = useState("");
  const { personalTeamList, loading, error } = useSelector(
    (state) => state.community
  );
  const [errors, setErrors] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);

  // 🔍 Search
  const handleSearch = () => {
    const newErrors = {};
    if (!authLogin.trim()) {
      newErrors.title = "UserID is required";
      setErrors(newErrors);
      return;
    }
    setErrors({});
    dispatch(getPersonalTeamList({ authLogin }));
    setSearched(true);
    setLastSearched(authLogin);
    setCurrentPage(1); // reset page on new search
  };

  // 📊 Export Excel
  const handleExport = () => {
    const data = Array.isArray(personalTeamList)
      ? personalTeamList
      : personalTeamList?.data || [];

    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((member, idx) => ({
        "Sr.No.": idx + 1,
        "Login ID": member.loginid,
        "Sponsor ID": member.sponsorId,
        Name: member.name,
        Email: member.email,
        Mobile: member.mobile,
        "Team Business": `$${member.teamBusiness}`,
        "Lease Amount": `$${member.leaseAmount}`,
        Rank: member.urank,
        "Register Date": member.regDate,
        "Topup Value": `$${member.topupValue}`,
        Level: member.uLvl,
        Status: member.status,
        "Topup Status": member.topupDate,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Downline Members");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "DownlineMembers.xlsx");
  };

  // 🔄 Refresh
  const handleRefresh = () => {
    setAuthLogin("");
    setSearched(false);
    setCurrentPage(1);
  };

  const data = Array.isArray(personalTeamList)
    ? personalTeamList
    : personalTeamList?.data || [];

  // Pagination calculation
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="p-8 mx-auto mt-0 mb-12 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">
      <h6 className="heading">   Downline Affiliates</h6>
      <div className="flex flex-wrap items-end gap-3 mb-6 justify-space-between">
        {/* Input Field */}
        <div className="flex flex-col">
          <label className="block mb-1 text-sm font-semibold text-blue-700">
            Enter Login ID
          </label>
          <input
            type="text"
            value={authLogin}
            onChange={(e) => {
              setAuthLogin(e.target.value);
              if (e.target.value === "") setSearched(false);
            }}
            placeholder="Enter Login Id"
            className="h-12 px-4 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            style={{ width: "250px" }}
          />
          {errors.title && (
            <div className="mt-1 text-sm text-red-500">{errors.title}</div>
          )}
        </div>

        {/* Buttons (Now perfectly aligned with input) */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`flex items-center justify-center h-12 gap-2 px-5 text-white shadow rounded-xl ${loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? (
            <Spinner size={4} color="text-white" />
          ) : (
            <FaSearch className="w-4 h-4" />
          )}
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={handleExport}
          className="flex items-center justify-center h-12 gap-2 px-5 text-white bg-green-600 shadow rounded-xl hover:bg-green-700"
        >
          <FaFileExcel className="w-4 h-4" /> Export Excel
        </button>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center justify-center h-12 gap-2 px-5 text-white shadow rounded-xl ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-600 hover:bg-gray-700"
            }`}
        >
          {loading ? (
            <Spinner size={4} color="text-white" />
          ) : (
            <FaSyncAlt className="w-4 h-4" />
          )}
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Table Section */}
      {searched && (
        <div className="w-full">
          {loading && (
            <div className="py-10 mt-10 font-semibold text-center text-blue-600 bg-white border border-gray-200 shadow-xl rounded-2xl">
              Loading...
            </div>
          )}
          {error && (
            <div className="py-10 font-semibold text-center text-red-500">
              {error}
            </div>
          )}
          {!loading && data.length === 0 && (
            <div className="py-10 text-center text-gray-500">No data found.</div>
          )}
          {data && data.length > 0 && (
            <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center border-collapse">
                  {/* Table Header */}
                  <thead className="text-white bg-blue-600">
                    <tr>
                      {[
                        "Sr.No.",
                        "Login ID",
                        "Sponsor ID",
                        "Name",
                        "Email",
                        "Mobile",
                        "Team Business ($)",
                        "Lease Amount ($)",
                        "Rank",
                        "Register Date",
                        "Topup date",
                        "Total Team",
                        "Active Team",
                        "Monthly Self",
                        "Monthly Team",
                        "Level",
                        "Status",
                      ].map((heading, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((member, idx) => (
                      <tr
                        key={idx}
                        className="transition-colors border-b hover:bg-blue-50 last:border-none"
                      >
                        <td className="px-4 py-3 font-medium">
                          {startIndex + idx + 1}
                        </td>
                        <td className="px-4 py-3 border td-wrap-text">{member.loginid}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.sponsorId}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.name}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.email}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.mobile}</td>
                        <td className="px-4 py-3 border td-wrap-text">${member.teamBusiness}</td>
                        <td className="px-4 py-3 border td-wrap-text">${member.leaseAmount}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.urank}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.regDate}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.topupDate || '-'}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.totTeam}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.activeTeam}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.monthlySelf}</td>
                        <td className="px-4 py-3 border td-wrap-text">  {member.monthlyTeam}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.uLvl}</td>
                        <td className="px-4 py-3 border td-wrap-text">{member.status}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {data.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="p-1 mr-3 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                      <option value="1500">1500</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                        }`}
                    >
                      ‹ Prev
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded ${currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                        }`}
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownlineAffiliates;