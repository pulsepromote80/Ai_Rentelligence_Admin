"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPersonalTeamList } from '@/app/redux/communitySlice';

const TreeNode = ({ node, allNodes = [], level = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const children = allNodes.filter(child => child.sponsorId === node.loginid);

  return (
    <div className="relative pl-6">
      
      {level > 0 && (
        <span className="absolute left-0 top-0 h-full w-0.5 bg-purple-200"></span>
      )}
      <div
        className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-lg p-5 mb-6 border-l-4 border-purple-400 min-w-[270px] transition-transform hover:scale-[1.025] hover:shadow-2xl duration-200"
      >
        <div className="flex items-center gap-3">
          {children.length > 0 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center justify-center font-bold text-purple-600 transition-colors bg-white border-2 border-purple-300 rounded-full shadow-sm w-7 h-7 focus:outline-none hover:bg-purple-100"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '-' : '+'}
            </button>
          )}
          <div>
            <div className="text-lg font-extrabold tracking-wide text-gray-800">{node.name}</div>
            <div className="font-mono text-xs text-purple-500">{node.loginid}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-3 text-sm text-gray-700">
          {node.email && (
            <span>
              <span className="font-medium text-gray-500">Email:</span> {node.email}
            </span>
          )}
          <span>
            <span className="font-medium text-gray-500">SponsorId:</span> {node.sponsorId}
          </span>
        </div>
      </div>
      {/* Children */}
      {expanded && children.length > 0 && (
        <div className="pl-4 ml-8 border-l-2 border-purple-200">
          {children.map((child, idx) => (
            <TreeNode
              key={child.id + '-' + child.loginid + '-' + child.sponsorId + '-' + idx}
              node={child}
              allNodes={allNodes}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DownlineAffilates = () => {
  const dispatch = useDispatch();
  const [authLogin, setAuthLogin] = useState('');
  const [searched, setSearched] = useState(false);
  const { personalTeamList, loading, error } = useSelector(state => state.community);
  const dataArray = Array.isArray(personalTeamList) ? personalTeamList : personalTeamList?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (authLogin) {
      dispatch(getPersonalTeamList({ authLogin }));
      setSearched(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-transparent">
      <div className="flex flex-col items-center w-full max-w-4xl p-10 mx-auto bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center">Downline Affiliates</h2>
        <form onSubmit={handleSearch} className="flex flex-col w-full gap-4 mb-6">
          <div className="flex flex-col flex-1">
            <label className="mb-1 font-medium text-gray-700">Enter Login ID :</label>
            <input
              type="text"
              value={authLogin}
              onChange={e => {
                setAuthLogin(e.target.value);
                if (e.target.value === '') setSearched(false);
              }}
              placeholder="Enter Login Id"
              className="h-12 p-3 text-base bg-gray-100 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="self-center w-full h-12 mt-10 text-lg font-semibold text-white transition-all rounded shadow bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 md:w-1/3 md:self-center md:mt-0"
          >
            Search
          </button>
        </form>
        {authLogin && searched && (
          <div className="w-full">
            {loading && <div className="text-center text-blue-600">Loading...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}
            {!loading && dataArray.length === 0 && (
              <div className="text-center text-gray-500">No data found.</div>
            )}
            {dataArray && dataArray.length > 0 && (
              <div className="mt-4">
                {dataArray.map((root, idx) => (
                  <TreeNode
                    key={root.id + '-' + root.loginid + '-' + root.sponsorId + '-' + idx}
                    node={root}
                    allNodes={dataArray}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownlineAffilates;