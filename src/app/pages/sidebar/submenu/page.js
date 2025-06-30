"use client";
import React from "react";
import { useSelector } from "react-redux";

const SubmenuPage = () => {
  const selectedPage = useSelector((state) => state.sidebar.selectedPage);

  if (!selectedPage) {
    return (
      <div className="p-4 text-sm text-center text-gray-500 sm:p-5 md:p-6 sm:text-base md:text-lg">
        Please select a submenu from the sidebar.
      </div>
    );
  }
  return (
    <div className="p-4 bg-white rounded-lg shadow-md sm:p-5 md:p-6">
      <h2 className="text-xl font-bold text-gray-700 sm:text-2xl">
        {selectedPage.subMenuName}
      </h2>
      <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
        This is the <strong>{selectedPage.subMenuName}</strong> page. Content for this section will go here.
      </p>
    </div>
  );
};

export default SubmenuPage;