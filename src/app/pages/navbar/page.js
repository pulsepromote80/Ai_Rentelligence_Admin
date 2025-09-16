"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { Bell, Settings, LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminUserDetails } from "@/app/redux/adminUserSlice";
import { getAdminUserId, getUsername } from "@/app/pages/api/auth";
import { useRouter } from "next/navigation";
import { logout } from "@/app/redux/authSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUserId, setAdminUserId] = useState(null);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { user: adminDetails } = useSelector((state) => state.admin);
  const menuRef = useRef(null);

  useEffect(() => {
    const id = getAdminUserId();
    const username = getUsername && getUsername();
    setAdminUserId(id);
    if (id && username) {
      dispatch(fetchAdminUserDetails({ adminUserId: id, username }));
    } else if (id) {
      dispatch(fetchAdminUserDetails({ adminUserId: id }));
    }
  }, [dispatch]);

  const handleProfileClick = () => {
    setMenuOpen(!menuOpen);
    router.push("/pages/profile");
  };

  const handleUpdateAdmin = () =>{
    setMenuOpen(!menuOpen);
    router.push("/pages/update-profile-admin")
  }

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      dispatch(logout());
      router.push("/");
      router.refresh();
    }, 1500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="flex items-center justify-between w-[95%] mx-auto p-3 bg-white sm:p-4 md:p-3">
      <div className="flex items-center">
        <h1 className="flex items-center text-lg font-bold text-black sm:text-xl md:text-2xl">
          <Image
            src="/Logo.png"
            alt="RentIntelligence Logo"
            width={150}
            height={35}
             
          />
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600 sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs px-1 py-0 sm:px-1.5 sm:py-0.5 rounded-full">
            3
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <div
            className="bg-profile-icon text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1 sm:gap-2 cursor-pointer text-sm sm:text-base"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>Hi, {adminDetails?.username || "Admin"}</span>
            <Image
              src="/userProfile.png"
              alt="Profile"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full sm:w-7 sm:h-7 md:w-8 md:h-8"
            />
          </div>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 text-black bg-white rounded-lg shadow-lg w-36 sm:w-40 top-12">
              <ul className="py-1 sm:py-2">
                <li
                  className="flex items-center gap-2 px-3 py-1 text-sm cursor-pointer sm:px-4 sm:py-2 hover:bg-gray-200 sm:text-base"
                  onClick={handleProfileClick}
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" /> Profile
                </li>
                <li className="flex items-center gap-2 px-3 py-1 text-sm cursor-pointer sm:px-4 sm:py-2 hover:bg-gray-200 sm:text-base"
                  onClick={handleUpdateAdmin}>
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" /> Settings
                </li>
                <li
                  className="flex items-center gap-2 px-3 py-1 text-sm cursor-pointer sm:px-4 sm:py-2 hover:bg-gray-200 sm:text-base"
                  onClick={handleLogout}
                >
                  {isLoggingOut ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-gray-600 rounded-full sm:w-4 sm:h-4 border-t-transparent animate-spin"></div>
                      Logging out...
                    </div>
                  ) : (
                    <>
                      <LogOut className="w-3 h-3 sm:w-4 sm:h-4" /> Logout
                    </>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;