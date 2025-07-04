"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNews, updateNews } from '@/app/redux/adminMasterSlice';
import Tiptap from '@/app/common/rich-text-editor';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 14.362-14.303ZM19.5 7.5l-3-3" />
  </svg>
);

const ManageNew = () => {
  const dispatch = useDispatch();
  const { newsData, loading, error, updateNewsData } = useSelector((state) => state.adminMaster);

  const [editingNews, setEditingNews] = useState(null); 
  const [editorValue, setEditorValue] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getNews({ newsId: '' }));
  }, [dispatch]);

  useEffect(() => {
    setEditorValue(editingNews ? editingNews.news : '');
  }, [editingNews]);

  useEffect(() => {
    if (updating && updateNewsData?.statusCode === 200) {
      setEditingNews(null);
      setUpdating(false);
      dispatch(getNews({ newsId: '' }));
    }
  }, [updateNewsData, updating, dispatch]);

  const handleUpdate = async () => {
    if (!editingNews) return;

    setUpdating(true);
    await dispatch(updateNews({ newsId: String(editingNews.newsId), news: editorValue }));
  };

  return (
    <>
      <div className="max-w-5xl mx-auto mt-5 overflow-x-auto shadow-lg rounded-xl bg-white/90">
        <h1 className="mb-8 text-2xl font-bold tracking-wide text-center text-black drop-shadow">Manage News</h1>

        {loading && (
          <div className="py-8 font-semibold text-center text-blue-700 animate-pulse">Loading...</div>
        )}

        {error && (
          <div className="mb-4 text-center text-red-500">{error.message || error}</div>
        )}

        <table className="min-w-full border border-gray-200 rounded-xl">
          <thead className="sticky top-0 z-10 text-blue-900 bg-gradient-to-r from-blue-200 to-blue-400">
            <tr>
              <th className="px-4 py-3 text-center border">Action</th>
              <th className="px-4 py-3 text-center border">Sr. No.</th>
              <th className="px-4 py-3 text-center border">News</th>
              <th className="px-4 py-3 text-center border">Date</th>
            </tr>
          </thead>
          <tbody>
            {newsData?.data?.length > 0 ? (
              newsData.data.map((item, idx) => (
                <tr key={item.newsId} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}>
                  <td className="px-4 py-2 text-center border">
                    <button
                      className="inline-flex items-center justify-center p-2 text-blue-600 transition bg-blue-100 rounded hover:bg-blue-200 hover:text-blue-800 focus:outline-none"
                      onClick={() => setEditingNews(item)}
                    >
                      <EditIcon />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center border">{idx + 1}</td>
                  <td className="px-4 py-2 text-center border" dangerouslySetInnerHTML={{ __html: item.news }} />
                  <td className="px-4 py-2 text-center border">{new Date(item.newsDate).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan={4} className="py-10 text-lg text-center text-gray-400">No News Found</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {editingNews && (
        <div className="relative max-w-3xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-200 shadow-lg rounded-xl">
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 focus:outline-none"
            onClick={() => setEditingNews(null)}
            aria-label="Close editor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="mb-4 text-xl font-semibold text-blue-800">Update News</h2>
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
      )}
    </>
  );
};

export default ManageNew;
