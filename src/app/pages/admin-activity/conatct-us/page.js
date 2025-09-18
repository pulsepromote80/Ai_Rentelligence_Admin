'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllContactUs } from '@/app/redux/adminMasterSlice'
import { toast } from 'react-toastify'

const ContactUs = () => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    dispatch(getAllContactUs())
      .unwrap()
      .catch((error) => {
        toast.error(error.message || 'Failed to fetch contact us details')
      })
  }, [dispatch])

  const contactUsData = useSelector(
    (state) => state.adminMaster.contactUsData?.data || [],
  )

  const contactUsList = contactUsData.filter((item) => item.CareerName === null)
  const careerList = contactUsData.filter((item) => item.CareerName !== null)

  const paginate = (data, page, rowsPerPage) => {
    const totalPages = Math.ceil(data.length / rowsPerPage)
    const startItem = (page - 1) * rowsPerPage + 1
    const endItem = Math.min(page * rowsPerPage, data.length)
    const currentItems = data.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage,
    )

    return { totalPages, startItem, endItem, currentItems }
  }

  const contactPagination = paginate(contactUsList, currentPage, rowsPerPage)
  const careerPagination = paginate(careerList, currentPage, rowsPerPage)

  return (
    <div className="max-w-6xl p-5 mx-auto mt-0mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl space-y-10">
      {/* Contact Us Table */}
      <div>
        <h6 className="heading mb-0 pb-0"> Contact Us Details</h6>
        <div className="mt-6 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center text-gray-700 border-collapse">
              <thead className="text-white bg-gradient-to-r from-blue-700 to-blue-500">
                <tr>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    S.No.
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Mobile
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Subject
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {contactPagination.currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-2 py-2 td-wrap-text border"
                    >
                      No Contact Data Found
                    </td>
                  </tr>
                ) : (
                  contactPagination.currentItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx % 2 === 0
                          ? 'bg-blue-50 hover:bg-blue-100 transition'
                          : 'bg-white hover:bg-blue-50 transition'
                      }
                    >
                      <td className="px-2 py-2 td-wrap-text border">
                        {contactPagination.startItem + idx}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Name || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Email || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Mobile || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Subject || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Message || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h6 className="heading">Career Details</h6>
        <div className="mt-6 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center text-gray-700 border-collapse">
              <thead className="text-white bg-gradient-to-r from-blue-700 to-blue-500">
                <tr>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    S.No.
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Mobile
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Subject
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    Message
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">
                    CareerName
                  </th>
                </tr>
              </thead>
              <tbody>
                {careerPagination.currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-2 py-2 td-wrap-text border"
                    >
                      No Career Data Found
                    </td>
                  </tr>
                ) : (
                  careerPagination.currentItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx % 2 === 0
                          ? 'bg-blue-50 hover:bg-blue-100 transition'
                          : 'bg-white hover:bg-blue-50 transition'
                      }
                    >
                      <td className="px-2 py-2 td-wrap-text border">
                        {careerPagination.startItem + idx}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Name || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Email || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Mobile || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Subject || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.Message || '-'}
                      </td>
                      <td className="px-2 py-2 td-wrap-text border">
                        {item.CareerName || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>{' '}
      </div>
    </div>
  )
}

export default ContactUs
