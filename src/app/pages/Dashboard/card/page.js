'use client'
import { useSelector } from 'react-redux'

const Card = ({ loading, error = null }) => {
  const stats = useSelector((state) => state.dashboard.stats)
  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-black">Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div className="p-4 text-center shadow-lg bg-blue-50 rounded-xl">
            <div className="text-sm text-gray-500">Total Joining</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalJoining}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-green-50 rounded-xl">
            <div className="text-sm text-gray-500">Total Today Joining</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalTodayJoining}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-orange-50 rounded-xl">
            <div className="text-sm text-gray-500">Total Active</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalactive}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-teal-50 rounded-xl">
            <div className="text-sm text-gray-500">Total Bussiness</div>
            <div className="mt-2 text-2xl font-bold">₹{stats.totalBusiness}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-red-50 rounded-xl">
            <div className="text-sm text-gray-500">Today Bussiness</div>
            <div className="mt-2 text-2xl font-bold">{stats.todayBusiness}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-purple-50 rounded-xl">
            <div className="text-sm text-gray-500">Total Income Wallet</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalIncomeWallet}</div>
          </div>

          <div className="p-4 text-center bg-gray-100 shadow-lg rounded-xl">
            <div className="text-sm text-gray-500">Total Deposit Wallet</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalDepositWallet}</div>
          </div>

 
          <div className="p-4 text-center shadow-lg bg-indigo-50 rounded-xl">
            <div className="text-sm text-gray-500">Today Deposit</div>
            <div className="mt-2 text-2xl font-bold">{stats.todayDeposit}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-yellow-50 rounded-xl">
            <div className="text-sm text-gray-500">Total Withdrawal</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalWithdrawal}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-pink-50 rounded-xl">
            <div className="text-sm text-gray-500">Total ROI</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalROI}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-lime-50 rounded-xl">
            <div className="text-sm text-gray-500">Working Income Today</div>
            <div className="mt-2 text-2xl font-bold">₹{stats.workingIncomeToday}</div>
          </div>

          <div className="p-4 text-center shadow-lg bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-500">Working Income Total</div>
            <div className="mt-2 text-2xl font-bold">{stats.workingIncomeTotal}</div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  )
}

export default Card