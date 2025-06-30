import React from 'react';

const SimilarProductDetails = ({ similarProductList, activeTab }) => {
  return (
    <div>
      {activeTab === 'similarProduct' && (
        <div className="mt-2">
          <div className="p-4 bg-white border border-gray-200 shadow-md rounded-xl">
            <div className="overflow-x-auto">
              {Array.isArray(similarProductList) && similarProductList.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <table className="min-w-full text-sm rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">Image</th>
                          <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">Title</th>
                          <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">Description</th>
                          <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {similarProductList.map((similarProduct, index) => (
                          <tr
                            key={index}
                            className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                          >
                            <td className="px-6 py-3 text-left">
                              <img
                                src={similarProduct.images}
                                alt={similarProduct.productName}
                                className="object-cover w-16 h-16 rounded-md"
                              />
                            </td>
                            <td className="px-6 py-3 text-left">{similarProduct.productName}</td>
                            <td className="px-6 py-3 text-left">{similarProduct.description}</td>
                            <td className="px-6 py-3 text-left">{similarProduct.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block md:hidden">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {similarProductList.map((similarProduct, index) => (
                        <div
                          key={index}
                          className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-md"
                        >
                          <img
                            src={similarProduct.images}
                            alt={similarProduct.productName}
                            className="object-cover w-full h-48 mb-4 rounded-md"
                          />
                          <h3 className="text-lg font-semibold text-gray-800">{similarProduct.productName}</h3>
                          <p className="mt-2 text-sm text-gray-600">{similarProduct.description}</p>
                          <p className="mt-2 text-xl font-bold text-gray-900">{similarProduct.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No SimilarProductDetails available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimilarProductDetails;