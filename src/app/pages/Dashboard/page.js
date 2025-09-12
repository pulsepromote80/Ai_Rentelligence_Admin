'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardData } from '@/app/redux/dashboardSlice'
import { getToken } from '@/app/pages/api/auth'
import Card from '@/app/pages/Dashboard/card/page'
import RecentActivity from '@/app/pages/Dashboard/recent-activity/page'
import { chartData } from '@/app/constants/chartData-constant'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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
    <div className="min-h-screen from-gray-50 to-gray-100 space-y-8">
      {/* Top Stats */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl transition-shadow duration-300">
        <Card stats={stats} loading={loading} error={error} />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Stat Card */}
        <div className="md:col-span-1">
          <StatCard />
        </div>

        {/* Orders Chart */}
        <div className="md:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
          <h5 className="text-2xl font-bold mb-5 flex items-center gap-2">
            Orders Overview
          </h5>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mini Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MiniChartCard
          title="Total Orders Completed"
          value={stats?.totalOrder ?? 0}
          data={chartData}
          bgColor="from-purple-500 to-purple-300"
        />
        <MiniChartCard
          title="Total Order Returns"
          value={stats?.returnOrder ?? 0}
          data={chartData}
          bgColor="from-red-500 to-red-300"
        />
        <div className="bg-gradient-to-tr from-green-500 to-green-300 rounded-3xl shadow-xl border border-gray-200 p-6 hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-xl font-bold mb-3 text-white">Inventory Alert</h2>
          <ul className="space-y-2 text-sm text-white/90">
            <li>
              Low-Stock Agents:{' '}
              <span className="font-bold">{stats?.lowProduct ?? 0}</span>
            </li>
            <li>
              Out of Stock Agents:{' '}
              <span className="font-bold">{stats?.outOfStock ?? 0}</span>
            </li>
            <li>
              Last Week Users:{' '}
              <span className="font-bold">{stats?.lastWeekUsers ?? 0}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
        <RecentActivity transactions={transactions} loading={loading} />
      </div>
    </div>
  )
}

function StatCard() {
  const stats = useSelector((state) => state.dashboard.stats)

  if (!stats) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 text-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-300 text-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <h2 className="text-lg font-bold mb-4">Agent Stats</h2>
      <div className="space-y-3 text-sm">
        <p>Total Joining: <span className="font-bold">{stats.totalJoining}</span></p>
        <p>Total Income Wallet: <span className="font-bold">{stats.totalIncomeWallet}</span></p>
        <p>Total Deposit Wallet: <span className="font-bold">{stats.totalDepositWallet}</span></p>
        <p>Total Active Agents: <span className="font-bold">{stats.totalactive}</span></p>
        <p>Total Working Income: <span className="font-bold">{stats.workingIncomeTotal}</span></p>
      </div>
    </div>
  )
}

function MiniChartCard({ title, value, data, bgColor }) {
  return (
    <div
      className={`bg-gradient-to-tr ${bgColor} rounded-3xl shadow-xl p-6 text-white hover:scale-[1.02] transition-transform duration-300`}
    >
      <p className="text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <div className="h-12 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#fff"
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
