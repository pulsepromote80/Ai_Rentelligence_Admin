"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAdminUsersList, fetchActivateAdminUser, fetchDeActivateAdminUser } from '@/app/redux/adminUserSlice';
import { toast } from 'react-toastify';

const ManageAdmin = () => {
    const dispatch = useDispatch();
    const { allAdminListData, loading, error, activateStatus } = useSelector((state) => state.admin);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const [actionLoadingId, setActionLoadingId] = useState(null);

    useEffect(() => {
        dispatch(fetchAllAdminUsersList());
    }, [dispatch, activateStatus]);

    const handleActivateDeactivate = async (adminUserId, isActive) => {
        setActionLoadingId(adminUserId);
        try {
            let result;
            if (isActive) {
                result = await dispatch(fetchDeActivateAdminUser(adminUserId));
            } else {
                result = await dispatch(fetchActivateAdminUser(adminUserId));
            }
            if (result && result.payload && result.payload.statusCode === 200) {
                toast.success(result.payload.message || (isActive ? 'Admin Deactivated Successfully!' : 'Admin Activated Successfully!'));
            } else {
                toast.error((result && result.payload && result.payload.message) || 'Action failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
        setActionLoadingId(null);
    };

    const paginatedRows = (allAdminListData || []).slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const totalPages = Math.ceil((allAdminListData?.length || 0) / rowsPerPage);
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, allAdminListData?.length || 0);

    return (
        <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl">
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-700">Manage Admins</h1>
            {loading ? (
                <div className="py-10 text-center">Loading...</div>
            ) : error ? (
                <div className="py-10 text-center text-red-500">{error}</div>
            ) : (
                <div className="mt-2 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
                    <table className="min-w-full border border-gray-200 rounded-xl">
                        <thead className="sticky top-0 z-10 text-white bg-blue-500">
                            <tr>
                                <th className="px-4 py-2 text-sm font-medium text-center border rounded-tl-lg">Sr.No.</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border">Username</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border">Password</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border">First Name</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border">Last Name</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border">Email</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border">Phone</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border">Created Date</th>
                                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
                                </tr>
                            ) : (
                                paginatedRows.map((row, idx) => {
                                    const isActive = row.activeStatus === 'Activated';
                                    return (
                                        <tr
                                            key={row.adminUserId}
                                            className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                                        >
                                            <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{startItem + idx}</td>
                                            <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.username || '-'}</td>
                                            <td className="relative px-4 py-2 text-sm text-center text-gray-700 border group">
                                                <span className="password-mask group-hover:hidden">
                                                    {row.password ? '*'.repeat(row.password.length) : '-'}
                                                </span>
                                                <span className="absolute z-10 hidden px-2 py-1 -translate-x-1/2 bg-white border rounded shadow password-reveal group-hover:inline left-1/2">
                                                    {row.password}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.firstName || '-'}</td>
                                            <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.lastName || '-'}</td>
                                            <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.email || '-'}</td>
                                            <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.phoneNumber || '-'}</td>
                                            <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.createdDate ? row.createdDate.split('T')[0] : '-'}</td>
                                            <td className="px-4 py-2 text-sm text-center border">
                                                {isActive ? (
                                                    <span className="px-3 py-1 font-medium text-green-500 ">
                                                        Activated
                                                    </span>
                                                ) : (
                                                    <button
                                                        className={`px-3 py-1 rounded font-semibold text-white bg-green-500 hover:bg-green-600 ${actionLoadingId === row.adminUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={actionLoadingId === row.adminUserId}
                                                        onClick={() => handleActivateDeactivate(row.adminUserId, isActive)}
                                                    >
                                                        {actionLoadingId === row.adminUserId
                                                            ? 'Please wait...'
                                                            : 'Active'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    {(allAdminListData?.length || 0) > 0 && (
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="text-sm text-gray-600">
                                {startItem}-{endItem} of {allAdminListData?.length || 0}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageAdmin;