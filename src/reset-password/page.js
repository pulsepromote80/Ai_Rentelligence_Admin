
"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/app/redux/authSlice";
import { useRouter } from "next/navigation";
import Loading from '@/app/common/loading' 
import Spinner from "@/app/common/spinner";

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { forgotPasswordUsername, loading, error, success } = useSelector(
    (state) => state.auth
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!forgotPasswordUsername) {
      alert("Invalid request. Please restart the forgot password process.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    dispatch(resetPassword({ username: forgotPasswordUsername, newPassword }))
      .unwrap()
      .then(() => {
        router.push("/");
      })
      .catch((err) => alert(err));
  };
return (
    <div className="flex items-center justify-center h-auto bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-4 text-2xl font-bold text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-3 py-2 mt-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-3 py-2 mt-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? (
              <>
               <Spinner />
                <span className="ml-2">Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
          {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
        </form>
      </div>
    </div>
);
}


