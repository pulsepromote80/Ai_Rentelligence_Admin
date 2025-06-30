
'use client'
import React, { useState, useEffect } from 'react'
import Loading from '@/app/common/loading'

const TableWithCheckbox = ({ columns, data, loading, title, onSelectionChange, selectedRowIds: externalSelectedIds = [],onCheckboxChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, order: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [localData, setLocalData] = useState([])

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleCheckboxChange = (rowData) => {
    const updatedData = localData.map((item) =>
      item.gproductId === rowData.gproductId
        ? { ...item, isSelected: !item.isSelected }
        : item
    )
    setLocalData(updatedData);

    const selectedItems = updatedData.filter((item) => item.isSelected)
    onSelectionChange?.(selectedItems)

     const selectedIds = selectedItems.map(item => item.gproductId)
    onCheckboxChange?.(selectedIds)
  }

   
  
  
  const sortData = (key) => {
    const order =
      sortConfig.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc'
    const sorted = [...localData].sort((a, b) => {
      const aVal = a[key]?.toString().toLowerCase() || ''
      const bVal = b[key]?.toString().toLowerCase() || ''
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    setSortConfig({ key, order })
    return sorted
  }

  const filteredData = localData?.filter((row) =>
    columns?.some((col) =>
      row[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || []

  const sortedData = sortConfig.key ? sortData(sortConfig.key) : filteredData

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  if (loading) return <Loading />

  return (
    <div className="p-4 mt-3 rounded-md shadow-custom-1">
      <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
        {title && (
          <h2 className="mb-2 text-xl font-semibold text-gray-800 sm:mb-0 sm:text-center">
            {title}
          </h2>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full p-2 border rounded-md sm:w-64 border-customBlue focus:outline-none focus:border-customBlue"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto sm:block">
        {!localData || filteredData.length === 0 ? (
          <div className="py-10 text-lg text-center text-black border rounded-md">
            No Data found!
          </div>
        ) : (
          <>
            <table className="min-w-full border border-collapse border-gray-300">
              <thead>
                <tr className="bg-action">
                  <th className="px-4 py-3 text-white border border-gray-300">
                    Select
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-white border border-gray-300 cursor-pointer bg-header-tbl hover:bg-blue-600"
                      onClick={() => sortData(col.key)}
                    >
                      <div className="flex items-center justify-center">
                        {col.label}
                        {sortConfig.key === col.key && (
                          <span className="ml-2">
                            {sortConfig.order === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => {
                  const rowId = row.gproductId
                  return (
                    <tr key={rowId}>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        <input
                          type="checkbox"
                          checked={row.isSelected}
                          onChange={() => handleCheckboxChange(row)}
                        />
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-2 text-center border border-gray-300"
                        >
                          {col.key === 'images' ? (
                            <img
                              src={row[col.key] || '/fallback-image.jpg'}
                              alt={row.productName || 'images'}
                              className="object-cover w-16 h-16 rounded"
                            />
                          ) : (
                            row[col.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-4 space-x-8">
              <div className="flex items-center space-x-2">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setCurrentPage(1)
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
                  {indexOfFirstRow + 1} -{' '}
                  {indexOfLastRow > filteredData.length
                    ? filteredData.length
                    : indexOfLastRow}{' '}
                  of {filteredData.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded-md ${currentPage === 1
                    ? 'text-gray-400 border-gray-300'
                    : 'hover:bg-gray-200'
                    }`}
                >
                  ◄
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded-md ${currentPage === totalPages
                    ? 'text-gray-400 border-gray-300'
                    : 'hover:bg-gray-200'
                    }`}
                >
                  ►
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {currentRows.length === 0 ? (
          <div className="py-10 text-lg text-center text-black border rounded-md">
            No Data found!
          </div>
        ) : (
          currentRows.map((row) => (
            <div
              key={row.gproductId}
              className="p-4 mb-4 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={row.isSelected}
                    onChange={() => handleCheckboxChange(row)}
                  />
                  <span className="font-semibold">Select</span>
                </label>
              </div>
              {columns.map((col) => (
                <div key={col.key} className="mb-2">
                  <div className="text-sm font-semibold text-gray-600">
                    {col.label}
                  </div>
                  <div className="text-base text-black">
                    {col.key === 'images' ? (
                      <img
                        src={row[col.key] || '/fallback-image.jpg'}
                        alt={row.productName || 'images'}
                        className="object-cover w-20 h-20 mt-1 rounded"
                      />
                    ) : (
                      row[col.key]
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TableWithCheckbox
