"use client";
import { useSelector } from "react-redux";

const RecentActivity = () => {
  const { transactions, loading, error } = useSelector((state) => state.dashboard ?? {});

  const statusColors = {
    confirm: "text-green-500",
    pending: "text-yellow-500",
    return: "text-red-500",
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Recent Agent Lease</h2>
      <div className="mt-4 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
            <table className="min-w-full text-left">
              <thead className="text-gray-700 bg-slate-200">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Price</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Discount Price</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Delivery Charge</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Total Amount</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Payment Method</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Transaction ID</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Tracking No</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Note</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.length > 0 ? (
                  transactions.map((txn) => (
                    <tr key={txn.orderId} className="border-b">
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.price}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.discountPrice}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.deliveryCharge}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.totalAmount}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.paymentMethod}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.transactionId}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.trackingNo}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{txn.note}</td>
                      <td className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-bold ${statusColors[txn.status?.toLowerCase()] || "text-gray-500"}`}>
                        {txn.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-3 text-center" colSpan="9">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;