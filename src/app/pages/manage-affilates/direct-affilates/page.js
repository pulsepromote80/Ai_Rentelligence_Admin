"use client";
//import { summary } from "@/app/constants/constant";
//import { directMembers } from "@/app/constants/constant";
//import DownlineMembers from "./downline-members/page";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getdirectMember } from "@/app/redux/communitySlice";

export default function Affiliate() {
  const dispatch = useDispatch();
  const { directMemberData } = useSelector((state) => state.community);
  const [loginId, setLoginId] = useState("");

  // Auto-fetch on input
  useEffect(() => {
    if (loginId) {
      dispatch(getdirectMember({ loginid: loginId }));
    }
  }, [loginId, dispatch]);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-6xl p-12 bg-white shadow-2xl rounded-3xl">
        <h2 className="mb-10 text-3xl font-bold text-center">Direct Affiliates</h2>
        <div className="mb-10">
          <label className="block mb-3 text-lg font-medium text-gray-700" htmlFor="loginId">
            Enter User ID :
          </label>
          <input
            id="loginId"
            type="text"
            placeholder="Enter User Id"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full px-6 py-4 text-lg placeholder-gray-400 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
            autoComplete="off"
          />
        </div>
        {/* Show members only if loginId is present and data is available */}
        {loginId && directMemberData && (
          <section className="w-full mt-8">
            <h3 className="mb-6 text-2xl font-semibold text-center text-blue-600">Direct Members</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {directMemberData?.map((member, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-6 transition-shadow bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-2xl">
                  <div className="text-lg font-semibold text-gray-800">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                  <div className="text-xs text-gray-400">Joined: {member.regDate}</div>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{member.topupDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}