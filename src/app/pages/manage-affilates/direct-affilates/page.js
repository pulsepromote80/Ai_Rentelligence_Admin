"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getdirectMember } from "@/app/redux/communitySlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaSearch, FaFileExcel, FaSyncAlt } from "react-icons/fa";
import Spinner from "@/app/common/spinner";

export default function Affiliate() {
  const dispatch = useDispatch();
  const { directMemberData, loading, error } = useSelector(
    (state) => state.community
  );

  const [loginId, setLoginId] = useState("");
  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);

  // Fetch direct members when search button clicked
  const handleSearch = () => {
    const newErrors = {};
    if (!loginId.trim()) {
      newErrors.title = "UserID is required";
      setErrors(newErrors);
      return;
    }
    dispatch(getdirectMember({ loginid: loginId }));
    setSearched(true);
    setCurrentPage(1); // reset page
  };

  // Export Excel
  const handleExport = () => {
    if (!directMemberData || directMemberData.length === 0) {
      alert("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      directMemberData.map((member, idx) => ({
        "Sr.No.": idx + 1,
        "Login ID": member.loginid,
        Name: member.name,
        Email: member.email,
        Mobile: member.mobile,
        "Team Business": `$${member.teamBusiness}`,
        "Lease Amount": `$${member.leaseAmount}`,
        Rank: member.urank,
        "Register Date": member.regDate,
        "Self Topup": `$${member.selfTopup}`,
        "DRY Percentage": member.dyrPercentage,
        "Topup Status": member.topupDate,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Direct Members");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "DirectMembers.xlsx");
  };

  // Refresh
  const handleRefresh = () => {
    setRefreshLoading(true);
    setTimeout(() => {
      setLoginId("");
      setSearched(false);
      setCurrentPage(1);
      setRefreshLoading(false);
    }, 1000); // Simulate loading time
  };

  // Pagination calculation
  const totalPages = Math.ceil(directMemberData?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = directMemberData?.slice(startIndex, endIndex);

  return (
    <div className="p-8 mx-auto mt-0 mb-12 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">
      <h6 className="heading"> Direct Affiliates</h6>

      {/* Input */}
      <div className="grid items-end grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        {/* User ID Input */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">
            User ID
          </label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="Enter User ID"
          />
           {errors.title && (
            <div className="mt-1 text-sm text-red-500">{errors.title}</div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 px-5 py-2 text-white bg-blue-600 shadow rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner size={4} color="text-white" /> : <FaSearch className="w-4 h-4" />} Search
          </button>
        </div>

        {/* Export Button */}
        <div className="flex">
          <button
            onClick={handleExport}
            className="flex items-center justify-center w-full gap-2 px-5 py-2 text-white bg-green-600 shadow rounded-xl hover:bg-green-700"
          >
            <FaFileExcel className="w-4 h-4" /> Export Excel
          </button>
        </div>

        {/* Refresh Button */}
        <div className="flex">
          <button
            onClick={handleRefresh}
            disabled={refreshLoading}
            className="flex items-center justify-center w-full gap-2 px-5 py-2 text-white bg-gray-600 shadow rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshLoading ? <Spinner size={4} color="text-white" /> : <FaSyncAlt className="w-4 h-4" />} Refresh
          </button>
        </div>
      </div>

      {/* Table Section */}
      {searched && (
        <>
          {loading ? (
            <div className="py-10 mt-10 font-semibold text-center text-blue-600 bg-white border border-gray-200 shadow-xl rounded-2xl">
              Loading...
            </div>
          ) : error ? (
            <div className="py-10 font-semibold text-center text-red-500">
              {error.message || "Something went wrong"}
            </div>
          ) : (
                  <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-collapse">
            {/* Table Header */}
            <thead className="text-white bg-blue-600">
                    <tr>
                      {[
                        "Sr.No.",
                        "Username",
                        "Name",
                        "Email",
                        "Mobile",
                        "Team Business ($)",
                        "Lease Amount ($)",
                        "Rank",
                        "Register Date",
                        "Topup Date",
                        "Self Topup ($)",
                        "DYR Percentage",
                        "Total Team",
                        "Active Team",
                        "Monthly Self",
                        "Monthly Team"
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

                  {/* Table Body */}
                  <tbody>
                    {paginatedData?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={12}
                          className="py-10 text-lg text-center text-gray-400"
                        >
                          No Data Found
                        </td>
                      </tr>
                    ) : (
                      paginatedData?.map((member, idx) => (
                        <tr
                          key={idx}
                          className="transition-colors border-b hover:bg-blue-50 last:border-none"
                        >
                          <td className="px-4 py-3 border td-wrap-text">
                            {startIndex + idx + 1}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.loginid}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.name}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.email}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.mobile}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            ${member.teamBusiness}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            ${member.leaseAmount}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.urank}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.regDate}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.topupDate || '-'}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            ${member.selfTopup}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                            {member.dyrPercentage}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                              {member.totTeam}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                              {member.activeTeam}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                              {member.monthlySelf}
                          </td>
                          <td className="px-4 py-3 border td-wrap-text">
                              {member.monthlyTeam}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {directMemberData?.length > 0 && (
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
                    {startIndex + 1}-{Math.min(endIndex, directMemberData?.length)}{" "}
                    of {directMemberData?.length}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      ◀
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      ▶
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}