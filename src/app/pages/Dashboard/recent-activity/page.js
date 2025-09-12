"use client";
import { useSelector } from "react-redux";

const RecentActivity = () => {
  const { transactions, loading, error } = useSelector(
    (state) => state.dashboard ?? {}
  );

  const statusColors = {
    confirm: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    return: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-4 sm:p-6">
      <h5 className="text-gray-800 tracking-tight sm:text-3xl">
        Recent Agent Lease
      </h5>

      <div className="mt-6 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-xl">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-slate-200 to-slate-300 text-gray-700">
                <tr>
                  {[
                    "Price",
                    "Discount Price",
                    "Delivery Charge",
                    "Total Amount",
                    "Payment Method",
                    "Transaction ID",
                    "Tracking No",
                    "Note",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-3 sm:px-4 sm:py-4 text-sm font-semibold uppercase tracking-wide"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {transactions?.length > 0 ? (
                  transactions.map((txn, idx) => (
                    <tr
                      key={txn.orderId}
                      className={`transition-colors hover:bg-slate-50 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-3 py-3 sm:px-4 sm:py-4 font-medium text-gray-800 whitespace-nowrap">
                        {txn.price}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.discountPrice}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.deliveryCharge}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 font-semibold text-gray-900 whitespace-nowrap">
                        {txn.totalAmount}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {txn.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-gray-600">
                        {txn.transactionId}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-gray-600">
                        {txn.trackingNo}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.note}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[txn.status?.toLowerCase()] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500 italic"
                      colSpan="9"
                    >
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
