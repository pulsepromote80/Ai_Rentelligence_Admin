'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardData } from '@/app/redux/dashboardSlice'
import { getToken } from '@/app/pages/api/auth'
import Card from '@/app/pages/Dashboard/card/page'
import RecentActivity from '@/app/pages/Dashboard/recent-activity/page'
import { chartData } from '@/app/constants/chartData-constant'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { loading, stats, transactions, error } = useSelector(
    (state) => state.dashboard,
  )
  const token = getToken()

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardData())
    }
  }, [token, dispatch])

  return (
    <div className="min-h-screen p-4 mt-6 space-y-4 text-gray-800 bg-white md:p-6 md:space-y-6">
      <div className="w-full mt-4 overflow-hidden border shadow-lg md:mt-6 rounded-xl">
        <Card stats={stats} loading={loading} error={error} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <StatCard />
        </div>

        <div className="p-4 border shadow-lg rounded-xl md:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">Orders</h2>
          <div className="h-[200px] position-relative z-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-4 shadow-lg bg-purple-50 rounded-xl">
          <MiniChartCard
            title="Total Order Completed"
            value={stats?.totalOrder ?? 0}
            data={chartData}
          />
        </div>

        <div className="p-4 shadow-lg bg-red-50 rounded-xl">
          <MiniChartCard
            title="Total Order Returns"
            value={stats?.returnOrder ?? 0}
            data={chartData}
          />
        </div>

        <div className="p-4 border shadow-lg bg-green-50 rounded-xl">
          <h2 className="mb-2 text-lg font-semibold">Inventory Alert</h2>
          <ul className="pl-5 space-y-1 text-sm list-disc">
            <li>
              Low-Stock Agents:{' '}
              <span className="font-semibold">{stats?.lowProduct ?? 0}</span>
            </li>
            <li>
              Out of Stock Agents:{' '}
              <span className="font-semibold">{stats?.outOfStock ?? 0}</span>
            </li>
            <li>
              Last Week Users:{' '}
              <span className="font-semibold">{stats?.lastWeekUsers ?? 0}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Activity - Full width always */}
      <div className="w-full mt-4 border shadow-lg md:mt-6 rounded-xl">
        <RecentActivity transactions={transactions} loading={loading} />
      </div>
    </div>
  )
}


function Cards({ title, value }) {
  return (
    <div className="p-3 border shadow-lg md:p-4 rounded-xl">
      <p className="mb-1 text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold md:text-xl">{value}</p>
    </div>
  )
}

function StatCard() {
  const stats = useSelector((state) => state.dashboard.stats)

  if (!stats) {
    return <div className="p-4 border shadow-lg rounded-xl">Loading...</div>
  }

  return (
    <div className="h-full p-3 border shadow-lg md:p-4 rounded-xl">
      <h2 className="mb-2 text-base font-semibold md:text-lg">Agent Stats</h2>
      <div className="space-y-1 md:space-y-2">
         <p className="text-xs md:text-sm">
          Total Joining: <span className="font-semibold">{stats.totalJoining}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Income Wallet: <span className="font-semibold">{stats.totalIncomeWallet}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Deposit Wallet: <span className="font-semibold">{stats.totalDepositWallet}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Active Agents: <span className="font-semibold">{stats.totalactive}</span>
        </p>
        <p className="text-xs md:text-sm">
          Total Working Income: <span className="font-semibold">{stats.workingIncomeTotal}</span>
        </p>
      </div>
    </div>
  )
}

function MiniChartCard({ title, value, data }) {
  return (
    <div className="h-full p-3 border shadow-lg md:p-4 rounded-xl">
      <p className="text-xs text-gray-500 md:text-sm">{title}</p>
      <p className="text-base font-bold md:text-lg">{value}</p>
      <div className="w-full h-10 mt-2 md:h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard