// 'use client'
// import React, { useState, useEffect } from 'react'
// import Loading from '@/app/common/loading'

// const SuccessOrderTable = ({ columns, data, loading, title, onSelectionChange }) => {
//   const [selectedRowIds, setSelectedRowIds] = useState([])
//   const [selectedRowData, setSelectedRowData] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [sortConfig, setSortConfig] = useState({ key: null, order: 'asc' })
//   const [currentPage, setCurrentPage] = useState(1)
//   const [rowsPerPage, setRowsPerPage] = useState(5)
//   const [showCheckAll, setShowCheckAll] = useState(false)

//   useEffect(() => {
//     setSelectedRowIds([])
//     setSelectedRowData([])
//   }, [data])  

//   const handleCheckboxChange = (row, index) => {
//     const rowId = row.orderId || row.id
//     let newIds, newData

//     if (selectedRowIds.includes(rowId)) {
//       newIds = selectedRowIds.filter(id => id !== rowId)
//       newData = selectedRowData.filter(r => r.orderId !== rowId)
//     } else {
//       newIds = [...selectedRowIds, rowId]
//       newData = [...selectedRowData, row]
//     }

//     setSelectedRowIds([...new Set(newIds)])
//     setSelectedRowData([...new Set(newData.map(r => JSON.stringify(r)))].map(r => JSON.parse(r)))

//     if (typeof onSelectionChange === 'function') {
//       onSelectionChange(newData)
//     }
//   }

//   const sortData = (key) => {
//     const order =
//       sortConfig.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc'
//     const sorted = [...data].sort((a, b) => {
//       const aVal = a[key]?.toString().toLowerCase() || ''
//       const bVal = b[key]?.toString().toLowerCase() || ''
//       return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
//     })
//     setSortConfig({ key, order })
//     return sorted
//   }

//   const filteredData = data?.filter((row) =>
//     columns?.some((col) =>
//       row[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   ) || []
  
//   const sortedData = sortConfig.key ? sortData(sortConfig.key) : filteredData;

//   const indexOfLastRow = currentPage * rowsPerPage
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage
//   const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow)
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage)

//   const isAllChecked = currentRows.length > 0 && currentRows.every(row =>
//     selectedRowIds.includes(row.orderId || row.id)
//   )

//   const handleCheckAll = (checked) => {
//     const allIds = currentRows.map(row => row.orderId || row.id)
//     if (checked) {
//       setSelectedRowIds(allIds)
//       setSelectedRowData(currentRows)
//       onSelectionChange?.(currentRows)
//     } else {
//       setSelectedRowIds([])
//       setSelectedRowData([])
//       onSelectionChange?.([])
//     }
//   }

//   if (loading) return <Loading />

//   return (
//     <div className="p-4 rounded-md shadow-custom-1">
//       <div className="flex items-center justify-end mb-4">
//         {title && (
//           <h2 className="flex-1 text-xl font-semibold text-center text-gray-800">
//             {title}
//           </h2>
//         )}
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value)
//             setCurrentPage(1)
//           }}
//           className="w-full p-2 mt-2 border rounded-md sm:w-64 sm:mt-0 border-customBlue focus:outline-none focus:border-customBlue"
//         />
//       </div>

//       <div className="overflow-x-auto tabel">
//         {!data || filteredData.length === 0 ? (
//           <div className="py-10 text-lg text-center text-black border rounded-md">
//             No Data found!
//           </div>
//         ) : (
//           <>
//             <table className="min-w-full border border-collapse border-gray-300">
//               <thead>
//                 <tr className="bg-action">
//                   <th  className="px-4 py-3 text-white border border-gray-300 cursor-pointer"
//                     onClick={() => setShowCheckAll(!showCheckAll)}
//                   >
//                     Select
//                     {showCheckAll && (
//                       <div className="mt-1">
//                         <input
//                           type="checkbox"
//                           checked={isAllChecked}
//                           onChange={(e) => handleCheckAll(e.target.checked)}
//                         />
//                       </div>
//                     )}
//                   </th>
//                   {columns.map((col) => (
//                     <th
//                       key={col.key}
//                       className="px-6 py-3 text-white border border-gray-300 cursor-pointer bg-header-tbl hover:bg-blue-600"
//                       onClick={() => sortData(col.key)}
//                     >
//                       <div className="flex items-center justify-center">
//                         {col.label}
//                         {sortConfig.key === col.key && (
//                           <span className="ml-2">
//                             {sortConfig.order === 'asc' ? '▲' : '▼'}
//                           </span>
//                         )}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRows.map((row, index) => {
//                   const rowId = row.orderId || row.id || `${row.OrderName}-${index}`

//                   return (
//                     <tr key={rowId}>
//                       <td className="px-4 py-2 text-center border border-gray-300">
//                         <input
//                           type="checkbox"
//                           checked={selectedRowIds.includes(rowId)}
//                           onChange={() => handleCheckboxChange(row, index)}
//                         />
//                       </td>
//                       {columns.map((col) => (
//                         <td
//                           key={`${rowId}-${col.key}`}
//                           className="px-6 py-2 text-center border border-gray-300"
//                         >
//                           {col.key === 'productImage' ? (
//                             <img
//                               src={row[col.key] || '/fallback-image.jpg'}
//                               alt={row.productName || 'Product Image'}
//                               className="object-cover w-16 h-16 rounded"
//                             />
//                           ) : (
//                             row[col.key]
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="flex items-center justify-center mt-4 space-x-8">
//               <div className="flex items-center space-x-2">
//                 <span>Rows per page:</span>
//                 <select
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value))
//                     setCurrentPage(1)
//                   }}
//                   className="p-1 border rounded-md focus:outline-none"
//                 >
//                   {[5, 10, 25].map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <span>
//                   {indexOfFirstRow + 1} -{' '}
//                   {indexOfLastRow > filteredData.length
//                     ? filteredData.length
//                     : indexOfLastRow}{' '}
//                   of {filteredData.length}
//                 </span>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 border rounded-md ${currentPage === 1
//                     ? 'text-gray-400 border-gray-300'
//                     : 'hover:bg-gray-200'
//                     }`}
//                 >
//                   ◄
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 border rounded-md ${currentPage === totalPages
//                     ? 'text-gray-400 border-gray-300'
//                     : 'hover:bg-gray-200'
//                     }`}
//                 >
//                   ►
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SuccessOrderTable

'use client'
import React, { useState, useEffect } from 'react'
import Loading from '@/app/common/loading'

const SuccessOrderTable = ({ columns, data, loading, title, onSelectionChange }) => {
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [selectedRowData, setSelectedRowData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, order: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showCheckAll, setShowCheckAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  useEffect(() => {
    setSelectedRowIds([])
    setSelectedRowData([])
  }, [data])  

  const handleCheckboxChange = (row, index) => {
    const rowId = row.orderId || row.id
    let newIds, newData

    if (selectedRowIds.includes(rowId)) {
      newIds = selectedRowIds.filter(id => id !== rowId)
      newData = selectedRowData.filter(r => r.orderId !== rowId)
    } else {
      newIds = [...selectedRowIds, rowId]
      newData = [...selectedRowData, row]
    }

    setSelectedRowIds([...new Set(newIds)])
    setSelectedRowData([...new Set(newData.map(r => JSON.stringify(r)))].map(r => JSON.parse(r)))

    if (typeof onSelectionChange === 'function') {
      onSelectionChange(newData)
    }
  }

  const sortData = (key) => {
    const order =
      sortConfig.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc'
    const sorted = [...data].sort((a, b) => {
      const aVal = a[key]?.toString().toLowerCase() || ''
      const bVal = b[key]?.toString().toLowerCase() || ''
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    setSortConfig({ key, order })
    return sorted
  }

  const filteredData = data?.filter((row) =>
    columns?.some((col) =>
      row[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || []
  
  const sortedData = sortConfig.key ? sortData(sortConfig.key) : filteredData;

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const isAllChecked = currentRows.length > 0 && currentRows.every(row =>
    selectedRowIds.includes(row.orderId || row.id)
  )

  const handleCheckAll = (checked) => {
    const allIds = currentRows.map(row => row.orderId || row.id)
    if (checked) {
      setSelectedRowIds(allIds)
      setSelectedRowData(currentRows)
      onSelectionChange?.(currentRows)
    } else {
      setSelectedRowIds([])
      setSelectedRowData([])
      onSelectionChange?.([])
    }
  }

  if (loading) return <Loading />

  return (
    <div className="p-4 rounded-md shadow-custom-1">
      <div className="flex flex-col items-center justify-between mb-4 md:flex-row">
        {title && (
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800 md:mb-0 md:text-left md:flex-1">
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

      <div className="overflow-x-auto">
        {!data || filteredData.length === 0 ? (
          <div className="py-10 text-lg text-center text-black border rounded-md">
            No Data found!
          </div>
        ) : isMobile ? (
          // Mobile Card View
          <div className="space-y-4">
            {currentRows.map((row, index) => {
              const rowId = row.orderId || row.id || `${row.OrderName}-${index}`
              
              return (
                <div key={rowId} className="p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(rowId)}
                        onChange={() => handleCheckboxChange(row, index)}
                        className="mr-2"
                      />
                      <span className="font-medium">ID: {rowId}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {columns.map((col) => (
                      <div key={`${rowId}-${col.key}`} className="mb-2">
                        <div className="text-sm font-semibold text-gray-600">{col.label}</div>
                        <div className="text-sm">
                          {col.key === 'productImage' ? (
                            <img
                              src={row[col.key] || '/fallback-image.jpg'}
                              alt={row.productName || 'Product Image'}
                              className="object-cover w-16 h-16 rounded"
                            />
                          ) : (
                            row[col.key]
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Desktop Table View
          <>
            <table className="min-w-full border border-collapse border-gray-300">
              <thead>
                <tr className="bg-action">
                  <th className="px-4 py-3 text-white border border-gray-300 cursor-pointer"
                    onClick={() => setShowCheckAll(!showCheckAll)}
                  >
                    Select
                    {showCheckAll && (
                      <div className="mt-1">
                        <input
                          type="checkbox"
                          checked={isAllChecked}
                          onChange={(e) => handleCheckAll(e.target.checked)}
                        />
                      </div>
                    )}
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
                {currentRows.map((row, index) => {
                  const rowId = row.orderId || row.id || `${row.OrderName}-${index}`

                  return (
                    <tr key={rowId}>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedRowIds.includes(rowId)}
                          onChange={() => handleCheckboxChange(row, index)}
                        />
                      </td>
                      {columns.map((col) => (
                        <td
                          key={`${rowId}-${col.key}`}
                          className="px-6 py-2 text-center border border-gray-300"
                        >
                          {col.key === 'productImage' ? (
                            <img
                              src={row[col.key] || '/fallback-image.jpg'}
                              alt={row.productName || 'Product Image'}
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
          </>
        )}

        {/* Pagination - Common for both views */}
        <div className="flex flex-col items-center justify-center mt-4 space-y-4 md:flex-row md:space-y-0 md:space-x-8">
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
      </div>
    </div>
  )
}

export default SuccessOrderTable