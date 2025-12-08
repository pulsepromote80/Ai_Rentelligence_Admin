"use client";

import React from "react";
import Link from "next/link";

const AdminActivity = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Admin Activity Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/pages/admin-activity/admin-registration">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Admin Registration</h2>
              <p className="text-gray-500">Register new admin users</p>
            </div>
          </Link>
          <Link href="/pages/admin-activity/change-password">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
              <p className="text-gray-500">Update admin passwords</p>
            </div>
          </Link>
          <Link href="/pages/admin-activity/manage-admin">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Manage Admin</h2>
              <p className="text-gray-500">Manage existing admins</p>
            </div>
          </Link>
          <Link href="/pages/admin-activity/manage-news">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Manage News</h2>
              <p className="text-gray-500">Handle news content</p>
            </div>
          </Link>
          <Link href="/pages/admin-activity/setting">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Settings</h2>
              <p className="text-gray-500">Configure system settings</p>
            </div>
          </Link>
          <Link href="/pages/admin-activity/wallet-address">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Wallet Address</h2>
              <p className="text-gray-500">Manage wallet addresses</p>
            </div>
          </Link>
          <Link href="/pages/admin-activity/credit-debit-fund">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Credit/Debit Fund</h2>
              <p className="text-gray-500">Manage fund transactions</p>
            </div>
          </Link>
          <Link href="/pages/admin-activity/conatct-us">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700">Contact Us</h2>
              <p className="text-gray-500">View contact inquiries</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminActivity;
