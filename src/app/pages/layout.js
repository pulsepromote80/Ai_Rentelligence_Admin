"use client"
import Sidebar from "./sidebar/page"
import Navbar from "@/app/pages/navbar/page";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
            <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-300 z-[99]">
                <Navbar />
            </div>
            <div className="flex pt-[60px]">
                <div className="fixed left-0 h-screen top-[56px] md:top-20 z-[999]">
                    <Sidebar />
                </div>
                <div className="flex-1 p-4 md:p-6 lg:ml-64 md:ml-30 overflow-auto h-[calc(100vh-60px)] bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
}