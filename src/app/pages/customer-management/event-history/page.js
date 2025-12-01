"use client"

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClosedEventMaster } from '@/app/redux/eventSlice';
import Table from '@/app/common/datatable';

export default function EventHistory() {
    const dispatch = useDispatch();
    const { closedEvents, loading} = useSelector((state) => state.event);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loginId, setLoginId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(getClosedEventMaster({ fromDate, toDate, loginId }));
    };


    useEffect(() => {
        dispatch(getClosedEventMaster({ fromDate, toDate, loginId }));
    }, [])

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
            <h1 className="mb-6 text-2xl font-bold">Event History</h1>

            {/* Form for API parameters */}
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                            From Date
                        </label>
                        <input
                            type="date"
                            id="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
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
                        <label htmlFor="loginId" className="block text-sm font-medium text-gray-700">
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
                    </div>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Closed Events
                </button>
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
