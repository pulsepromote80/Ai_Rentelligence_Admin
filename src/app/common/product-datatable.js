"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MdEdit, MdDelete } from 'react-icons/md';
import { RiImageAddLine } from "react-icons/ri";

const ProductTable = ({ columns, data = [], onEdit, onDelete, onAddImage, onRowClick }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, order: "asc" });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
 
    useEffect(() => {
        const sorted = [...data].sort((a, b) => a.id - b.id);
        setSortedData(sorted);
    }, [data]);

    const sortData = (key) => {
        const order = sortConfig.key === key && sortConfig.order === "asc" ? "desc" : "asc";
        const sorted = [...sortedData].sort((a, b) => {
            const aValue = a[key]?.toString().toLowerCase() || "";
            const bValue = b[key]?.toString().toLowerCase() || "";
            return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
        setSortedData(sorted);
        setSortConfig({ key, order });
    };

    const filteredData = Array.isArray(sortedData)
        ? sortedData.filter((row) =>
            columns?.some((col) =>
                row[col.key]?.toString().toLowerCase().includes(searchTerm?.toLowerCase() || "")
            )
        )
        : [];

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Get the absolute serial number based on original position
    const getSerialNumber = (row) => {
        return data.findIndex(item => item.id === row.id) + 1;
    };

    const renderDescription = (value) => {
        if (!value) return '';
        return (
            <div className="max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap" title={value}>
                {value}
            </div>
        );
    };

    const renderTitle = (value) => {
        if (!value) return '';
        return (
            <div className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap" title={value}>
                {value}
            </div>
        );
    };

    const renderSubtitle = (value) => {
        if (!value) return '';
        return (
            <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={value}>
                {value}
            </div>
        );
    };

    const renderCategory = (value) => {
        if (!value) return '';
        return (
            <div className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap" title={value}>
                {value}
            </div>
        );
    };

    return (
        <div className="p-4 mt-6 rounded-md shadow-custom-1">
            {/* Search */}
            <div className="flex flex-col items-center justify-end mb-4 sm:flex-row">
                <h1 className="flex-1 text-xl font-semibold text-center text-gray-800 text-list-label sm:text-left sm:mr-4">
                    Products
                </h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mt-2 border rounded-md sm:mt-0 sm:w-64 border-customBlue focus:outline-none focus:border-customBlue"
                />
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full border border-collapse border-gray-300">
                    <thead>
                        <tr className="bg-action">
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-3 text-white border border-gray-300">Actions</th>
                            )}
                            {columns?.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => sortData(col.key)}
                                    className="px-6 py-3 text-white border border-gray-300 cursor-pointer hover:bg-blue-600"
                                >
                                    <div className="flex items-center justify-center">
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <span className="ml-2">
                                                {sortConfig.order === "asc" ? "▲" : "▼"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-100">
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <div className="flex items-center justify-center gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="flex items-center justify-center p-2 text-white"
                                                    title="Edit"
                                                >
                                                    <MdEdit size={25} color="green"/>
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => row.active && onDelete(row)}
                                                    disabled={!row.active}
                                                    className={`p-2 rounded-md flex items-center justify-center`}
                                                    title="Delete"
                                                >
                                                    <MdDelete size={25} className={row.active ? 'text-red-600' : 'text-gray-300 cursor-not-allowed'} color="red"/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        onClick={() => onRowClick(row)}
                                        className="px-6 py-4 text-center border border-gray-300 cursor-pointer"
                                    >
                                        {col.key === "S.no" ? (
                                            getSerialNumber(row)
                                        ) : col.key === "image" || col.key === "imageUrl" ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddImage(row);
                                                }}
                                                className="flex items-center justify-center p-2 text-white"
                                                title="Add Image"
                                            >
                                                <RiImageAddLine size={25} color="green" />
                                            </button>
                                        ) : col.key === "username" ? (
                                            <Link
                                                href={`/pages/customer-management/customer-order-activity?username=${row[col.key]}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {row[col.key]}
                                            </Link>
                                        ) : col.key === "description" ? (
                                            renderDescription(row[col.key])
                                        ) : col.key === "productName" ? (
                                            renderTitle(row[col.key])
                                        ) : col.key === "subName" ? (
                                            renderSubtitle(row[col.key])
                                        ) : col.key === "categoryName" || col.key === "subCategoryName" || col.key === "subCategoryTypeName" ? (
                                            renderCategory(row[col.key])
                                        ) : col.render ? (
                                            col.render(row[col.key], row)
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Table */}
            <div className="space-y-4 md:hidden">
                {currentRows.map((row) => (
                    <div
                        key={row.id}
                        onClick={() => onRowClick(row)}
                        className="p-4 bg-white border rounded-lg shadow-sm"
                    >
                        {columns.map((col) => (
                            <div key={col.key} className="flex justify-between py-1">
                                <span className="font-medium text-gray-600">{col.label}:</span>
                                <span className="text-right text-gray-800">
                                    {col.key === "S.no" ? (
                                        getSerialNumber(row)
                                    ) : col.key === "image" || col.key === "imageUrl" ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddImage(row);
                                            }}
                                            className="flex items-center justify-center p-2 text-white"
                                            title="Add Image"
                                        >
                                            <RiImageAddLine size={25} color="green" />
                                        </button>
                                    ) : col.key === "username" ? (
                                        <Link
                                            href={`/pages/customer-management/customer-order-activity?username=${row[col.key]}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {row[col.key]}
                                        </Link>
                                    ) : col.key === "description" ? (
                                        renderDescription(row[col.key])
                                    ) : col.key === "productName" ? (
                                        renderTitle(row[col.key])
                                    ) : col.key === "subName" ? (
                                        renderSubtitle(row[col.key])
                                    ) : col.key === "categoryName" || col.key === "subCategoryName" || col.key === "subCategoryTypeName" ? (
                                        renderCategory(row[col.key])
                                    ) : col.render ? (
                                        col.render(row[col.key], row)
                                    ) : (
                                        row[col.key]
                                    )}
                                </span>
                            </div>
                        ))}

                        {(onEdit || onDelete || onAddImage) && (
                            <div className="flex justify-center gap-2 mt-4">
                                {onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(row);
                                        }}
                                        className="flex items-center justify-center p-2 text-white"
                                        title="Edit"
                                    >
                                        <MdEdit size={22} color="green" />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (row.active) onDelete(row);
                                        }}
                                        disabled={!row.active}
                                        className={`flex items-center justify-center p-2 rounded-md ${row.active ? '' : 'cursor-not-allowed'}`}
                                        title="Delete"
                                    >
                                        <MdDelete size={22} color={row.active ? 'red' : 'gray'} className={row.active ? 'text-red-600' : 'text-gray-300'} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredData.length === 0 && (
                <p className="mt-4 text-center">No data found!</p>
            )}

            <div className="flex items-center justify-center mt-4 space-x-8">
                <div className="flex items-center space-x-2">
                    <span>Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="p-1 border rounded-md focus:outline-none"
                    >
                        {[5, 10, 25].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <span>
                        {indexOfFirstRow + 1} -{" "}
                        {indexOfLastRow > filteredData.length
                            ? filteredData.length
                            : indexOfLastRow}{" "}
                        of {filteredData.length}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border rounded-md ${currentPage === 1
                            ? "text-gray-400 border-gray-300"
                            : "hover:bg-gray-200"
                            }`}
                    >
                        ◄
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border rounded-md ${currentPage === totalPages
                            ? "text-gray-400 border-gray-300"
                            : "hover:bg-gray-200"
                            }`}
                    >
                        ►
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;