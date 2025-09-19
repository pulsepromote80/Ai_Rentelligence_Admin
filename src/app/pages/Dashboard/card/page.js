'use client'
import { useSelector } from 'react-redux'

const Card = ({ loading, error = null }) => {
  const stats = useSelector((state) => state.dashboard.stats)

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5">
            {/* Total Employee */}
            <div className="p-6 bg-white border-l-4 border-blue-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">{stats.totalJoining}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Total Joining</div>
            </div>

            {/* New Employee */}
            <div className="p-6 bg-white border-l-4 border-green-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">   {stats.workingIncomeTotal}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Working Income Total</div>
            </div>

            {/* On Leave */}
            <div className="p-6 bg-white border-l-4 border-yellow-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">   {stats.totalTodayJoining}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Total Today Joining</div>
            </div>

            {/* Job Applicants */}
            <div className="p-6 bg-white border-l-4 border-purple-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">{stats.totalactive}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Total Active</div>
            </div>

            {/* Over Time */}
            <div className="p-6 bg-white border-l-4 border-red-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">₹{stats.totalBusiness}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Total Bussiness</div>
            </div>
          </div>

          {/* Announcement Section */}
          <div className="admint-big-card-flexing">
            <div className="p-6 mb-8 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl big-card-flexing-div">
              <div className="big-card-div">
                <h3 className="mb-2 text-xl font-bold">Total Rent Wallet</h3>
                <p className="mb-4">{stats.totalRentWallet}</p>
             
              </div>
              <img
                src="https://gxon.layoutdrop.com/demo/assets/images/media/svg/media1.svg"
                alt=""
                className="bottom-0 position-absolute end-0 z-n1"></img>
            </div>

            <div className="p-6 mb-8 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl big-card-flexing-div">
              <div className="big-card-div">
                <h3 className="mb-2 text-xl font-bold">Total Income Wallet</h3>
                <p className="mb-4">{stats.totalIncomeWallet}</p>
           
              </div>
              <img
                src="https://gxon.layoutdrop.com/demo/assets/images/media/svg/media1.svg"
                alt=""
                className="bottom-0 position-absolute end-0 z-n1"
              ></img>
            </div>
          </div>

<div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5">
            {/* Total Employee */}
            <div className="p-6 bg-white border-l-4 border-blue-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">{stats.totalDepositWallet}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Total Deposit Wallet</div>
            </div>

            {/* New Employee */}
            <div className="p-6 bg-white border-l-4 border-green-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading"> {stats.todayDeposit}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Today Deposit</div>
            </div>

            {/* On Leave */}
            <div className="p-6 bg-white border-l-4 border-yellow-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">{stats.totalWithdrawal}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Total Withdrawal</div>
            </div>

            {/* Job Applicants */}
            <div className="p-6 bg-white border-l-4 border-purple-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dashboard-card-heading">{stats.totalROI}</div>
              <div className="mt-1 text-sm text-gray-500 dashboard-card-sub-heading">Total ROI</div>
            </div>

            {/* Over Time */}
            <div className="p-6 bg-white border-l-4 border-red-500 shadow rounded-xl">
              <div className="text-3xl font-bold text-gray-900">₹{stats.workingIncomeToday}</div>
              <div className="mt-1 text-sm text-gray-500">Working Income Today</div>
            </div>
          </div> 
        </>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  )
}

export default Card
