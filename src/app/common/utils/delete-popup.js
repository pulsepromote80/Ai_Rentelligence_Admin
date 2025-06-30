'use client'
import React from 'react'

const DeletePopup = ({
  show,
  title,
  name = '',
  type = 'item', 
  onCancel,
  onConfirm
}) => {
  if (!show) return null;

  const displayTitle = title || `Are you sure you want to delete this ${type}?`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
      <div className="p-6 bg-white shadow-lg rounded-xl w-[90%] sm:w-auto">
        <p className="mb-4 text-lg text-center">
          {displayTitle}{" "}
          <span className="block font-semibold text-center text-red-600">{name}</span>
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;

