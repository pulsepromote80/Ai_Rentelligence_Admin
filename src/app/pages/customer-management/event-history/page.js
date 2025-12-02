"use client"

import { useState, useEffect } from 'react';
import { FaSyncAlt} from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi';
import { FileSpreadsheet } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { getClosedEventMaster } from '@/app/redux/eventSlice';
import { usernameLoginId } from '@/app/redux/adminMasterSlice';
import { toast } from 'react-toastify';
import Table from '@/app/common/datatable';

export default function EventHistory() {
    const dispatch = useDispatch();
    const { closedEvents, loading } = useSelector((state) => state.event);
    const { usernameData, error: usernameError } = useSelector((state) => state.adminMaster);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loginId, setLoginId] = useState('');
    const [userName, setUserName] = useState('');
    const [userIdError, setUserIdError] = useState('');
    const [userIdSuccess, setUserIdSuccess] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (loginId && loginId.trim()) {
                const result = await dispatch(usernameLoginId(loginId));
                if (result?.payload === null) {
                    setUserIdError("User ID doesn't exist");
                    setUserIdSuccess('');
                    setUserName('');
                } else {
                    setUserIdError('');
                    setUserIdSuccess("User ID exists");
                }
            } else {
                setUserName('');
                setUserIdError('');
                setUserIdSuccess('');
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [loginId, dispatch]);

    useEffect(() => {
        if (usernameError) {
            toast.error(usernameError.message || 'Invalid User ID');
            setUserName('');
            setUserIdError('');
        }
    }, [usernameError]);

    useEffect(() => {
        if (usernameData) {
            setUserName(usernameData.name || usernameData.userName || '');
        }
    }, [usernameData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(getClosedEventMaster({ fromDate, toDate, loginId }));
    };

    const handleRefresh = () => {
        setFromDate(" ");
        setToDate(" ");
        setLoginId('');
        setUserName('');
        setUserIdError('');
        setUserIdSuccess('');
    }

    const handleExport = () => {
        if (!closedEvents || closedEvents.length === 0) {
            toast.error('No data available to export');
            return;
        }

        try {
            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Convert data to worksheet
            const ws = XLSX.utils.json_to_sheet(closedEvents);

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Event History');

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `event_history_${timestamp}.xlsx`;

            // Save the file
            XLSX.writeFile(wb, filename);

            toast.success('Excel file exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export Excel file');
        }
    }

    // Define columns for the datatable (adjust based on API response structure)
    const columns = [
        { key: 'S No', label: 'S.No.' },
        { key: 'AuthLogin', label: 'AuthLogin' },
        { key: 'Tittle', label: 'Title' },
        { key: 'SessionTime', label: 'SessionTime' },
        { key: 'EventType', label: 'Event Type' },
        { key: 'Price', label: 'Price' },
        { key: 'location', label: 'location' },
        { key: 'EventDateTime', label: 'EventDateTime' },
        { key: 'AccessType', label: 'AccessType' },
        { key: 'TicketNumber', label: 'TicketNumber' },
        { key: 'Status', label: 'Status' },
        // Add more columns as needed based on the API response
    ];

    return (
        <div className="p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Event History</h1>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition bg-green-600 rounded-lg shadow hover:bg-green-700"
                >
                    <FileSpreadsheet className="w-5 h-5" />
                    Export Excel
                </button>
            </div>

            {/* Form for API parameters */}
            <form className="mb-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label htmlFor="fromDate" className="block text-sm font-semibold text-blue-700">
                            From Date
                        </label>
                        <input
                            type="date"
                            id="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full p-2 mt-1  border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="toDate" className="block text-sm font-semibold text-blue-700">
                            To Date
                        </label>
                        <input
                            type="date"
                            id="toDate"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="loginId" className="block text-sm font-semibold text-blue-700">
                            Login ID
                        </label>
                        <input
                            type="text"
                            id="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Login ID"
                        />
                         {userIdError && <p className="mt-1 text-sm text-red-500">{userIdError}</p>}
                         {userIdSuccess && <p className="mt-1 text-sm text-green-500">{userIdSuccess}</p>}
                    </div>
                </div>
                <div className='flex gap-4 justify-end '>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="px-4 py-2 flex justify-center gap-2 items-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                          <FiSearch className="w-4 h-4" />
                        Search
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center justify-center max-w-md gap-2 px-5 py-2 text-white transition bg-gray-600 shadow rounded-xl hover:bg-gray-700"
                    >
                        <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" />
                        Refresh
                    </button>
                </div>

            </form>

            {/* Datatable to display closed events */}
            <Table
                columns={columns}
                data={closedEvents}
                loading={loading}
                title="Closed Events"
            />
        </div>
    );
}
