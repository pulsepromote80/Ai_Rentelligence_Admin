'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNews, updateNews } from '@/app/redux/adminMasterSlice'
import Tiptap from '@/app/common/rich-text-editor'

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 14.362-14.303ZM19.5 7.5l-3-3"
    />
  </svg>
)

const ManageNew = () => {
  const dispatch = useDispatch()
  const { newsData, loading, error, updateNewsData } = useSelector(
    (state) => state.adminMaster,
  )

  const [editingNews, setEditingNews] = useState(null)
  const [editorValue, setEditorValue] = useState('')
  const [updating, setUpdating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    dispatch(getNews({ newsId: '' }))
  }, [dispatch])

  useEffect(() => {
    setEditorValue(editingNews ? editingNews.news : '')
  }, [editingNews])

  useEffect(() => {
    if (updating && updateNewsData?.statusCode === 200) {
      setEditingNews(null)
      setUpdating(false)
      dispatch(getNews({ newsId: '' }))
    }
  }, [updateNewsData, updating, dispatch])

  const handleUpdate = async () => {
    if (!editingNews) return

    setUpdating(true)
    await dispatch(
      updateNews({ newsId: String(editingNews.newsId), news: editorValue }),
    )
  }

  const paginatedData =
    newsData?.data?.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage,
    ) || []
  const totalPages = Math.ceil((newsData?.data?.length || 0) / rowsPerPage)
  const startItem = (currentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(
    currentPage * rowsPerPage,
    newsData?.data?.length || 0,
  )

  return (
    <>
      <div className="max-w-6xl p-5 mx-auto bg-white border border-blue-100 shadow-2xl mt-0mb-10 rounded-2xl">
        <h6 className="heading">Manage News</h6>

        {loading && (
          <div className="py-8 font-semibold text-center text-blue-700 animate-pulse">
            Loading...
          </div>
        )}

        {error && (
          <div className="mb-4 text-center text-red-500">
            {error.message || error}
          </div>
        )}

        <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center text-gray-700 border-collapse">
              <thead className="text-white bg-gradient-to-r from-blue-700 to-blue-500">
                <tr>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Action
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Sr. No.
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    News
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0
                  ? paginatedData.map((item, idx) => (
                    <tr
                      key={item.newsId}
                      className={
                        idx % 2 === 0
                          ? 'bg-blue-50 hover:bg-blue-100 transition'
                          : 'bg-white hover:bg-blue-50 transition'
                      }
                    >
                      <td className="px-4 py-2 text-center border">
                        <button
                          className="inline-flex items-center justify-center p-2 text-blue-600 transition bg-blue-100 rounded hover:bg-blue-200 hover:text-blue-800 focus:outline-none"
                          onClick={() => setEditingNews(item)}
                        >
                          <EditIcon />
                        </button>
                      </td>
                      <td className="px-2 py-2 border td-wrap-text">
                        {startItem + idx}
                      </td>
                      <td
                        className="px-2 py-2 border td-wrap-text"
                        dangerouslySetInnerHTML={{ __html: item.news }}
                      />
                      <td className="px-2 py-2 border td-wrap-text">
                        {item.newsDate ? new Date(item.newsDate).toLocaleDateString() : '-'}
                      </td>

                    </tr>
                  ))
                  : !loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-2 py-2 border td-wrap-text"
                      >
                        No News Found
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
        {(newsData?.data?.length || 0) > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {startItem}-{endItem} of {newsData?.data?.length || 0}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {editingNews && (
        <div className="relative max-w-3xl p-0 mx-auto mt-5 mt-0mb-10 ">
          {/* Close button */}
          <button
            type="button"
            className="absolute text-gray-400 top-4 right-4 hover:text-red-500 focus:outline-none"
            onClick={() => setEditingNews(null)}
            aria-label="Close editor"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="max-w-6xl p-5 mx-auto bg-white border border-blue-100 shadow-2xl mt-0mb-10 rounded-2xl">
            <h2 className="mb-5 text-xl font-semibold text-blue-800">
              Update News
            </h2>
            <Tiptap value={editorValue} onChange={setEditorValue} />
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ManageNew