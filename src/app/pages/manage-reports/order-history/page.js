"use client";
import { useState } from 'react';

const OrderHistory = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [userId, setUserId] = useState('100000');
  const [username, setUsername] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const transactionData = [
    {
      id: 1,
      userId: 100000,
      name: 'the fx king',
      transType: 'Fund Deduction By Admin',
      credit: 0.00,
      debit: 10.00,
      date: '09/05/25 16:56:35',
      remark: 'testing'
    },
    {
      id: 2,
      userId: 100000,
      name: 'the fx king',
      transType: 'Fund Deposit By Admin',
      credit: 500.00,
      debit: 0.00,
      date: '09/05/25 16:55:37',
      remark: 'Testing'
    }
  ];

  const handleSearch = () => {
    // Handle search functionality
    console.log('Search clicked');
  };

  const handleExport = () => {
    // Handle export functionality
    console.log('Export clicked');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
       
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Income Wallet Statement</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">$500.00</p>
                <p className="text-gray-600">Total Credit</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <p className="text-2xl font-bold text-red-600">$10.00</p>
                <p className="text-gray-600">Total Debit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Select Wallet</label>
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-Select Wallet-</option>
                <option value="the fx king">the fx king</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Transtype:</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Transaction</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">User ID:</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end space-x-4">
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Entries Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2 text-sm text-gray-700">entries</span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">S. No.</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">UserId</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">TransType</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Credit</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Debit</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Remark</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionData.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.userId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.transType}</td>
                    <td className="px-6 py-4 text-sm text-green-600 whitespace-nowrap">${transaction.credit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-red-600 whitespace-nowrap">${transaction.debit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{transaction.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">2</span> of <span className="font-medium">2</span> entries
              </p>
              
              <div className="mt-4 md:mt-0">
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    disabled
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    1
                  </button>
                  <button
                    disabled
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;