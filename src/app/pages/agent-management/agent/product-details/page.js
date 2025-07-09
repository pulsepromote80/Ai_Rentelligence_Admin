"use client";
import React from "react";

const ProductDetails = ({ productDetails, activeTab, setSelectedImageUrl }) => {
  return (
    <div>
      {activeTab === "product" && (
        <>
          <div className="hidden p-4 mt-2 bg-white border border-gray-200 shadow-md rounded-xl md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded-md">
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Title</th>
                    <td className="px-3 py-2 text-left">{productDetails.productName}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Subtitle</th>
                    <td className="px-3 py-2 text-left">{productDetails.subName}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Description</th>
                    <td className="px-3 py-2 text-left">{productDetails.description}</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Category Name</th>
                    <td className="px-3 py-2 text-left">{productDetails.categoryName}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">SubCategory Name</th>
                    <td className="px-3 py-2 text-left">{productDetails.subCategoryName}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">SubCategory Type</th>
                    <td className="px-3 py-2 text-left">{productDetails.subCategoryTypeName}</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Seller Name</th>
                    <td className="px-3 py-2 text-left">{productDetails.sellerName}</td>
                     <th className="px-3 py-2 font-semibold text-left text-gray-700">Price</th>
                    <td className="px-3 py-2 text-left">{productDetails.price}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">MRP</th>
                    <td className="px-3 py-2 text-left">{productDetails.mrp}</td>
                  </tr>
                  <tr className="bg-white border-b">
                   <th className="px-3 py-2 font-semibold text-left text-gray-700">Rating</th>
                    <td className="px-3 py-2 text-left">{productDetails.rating}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Discount Price</th>
                    <td className="px-3 py-2 text-left">{productDetails.discountPrice}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">PerHour</th>
                    <td className="px-3 py-2 text-left">{productDetails.perHour}</td>
                  </tr>
                  <tr className="bg-white border-b">
                   <th className="px-3 py-2 font-semibold text-left text-gray-700">Unit</th>
                    <td className="px-3 py-2 text-left">{productDetails.unit}</td>
                    <th className="px-3 py-2 font-semibold text-left text-gray-700">Specification</th>
                    <td className="px-3 py-2 text-left">
                      {productDetails.specification && (
                        <div className="md:w-[159%] lg:w-[159%]" dangerouslySetInnerHTML={{ __html: productDetails.specification }} />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="block p-2 space-y-4 md:hidden">
            {[
              { label: "Title", value: productDetails.productName },
              { label: "Subtitle", value: productDetails.subName },
              { label: "Description", value: productDetails.description },
              { label: "Category Name", value: productDetails.categoryName },
              { label: "SubCategory Name", value: productDetails.subCategoryName },
              { label: "SubCategory Type", value: productDetails.subCategoryTypeName },
              { label: "Seller Name", value: productDetails.sellerName },
              { label: "Size Name", value: productDetails.sizeName },
              { label: "Concern Name", value: productDetails.concernName },
              { label: "Ingredient Name", value: productDetails.ingredientName },
              { label: "Price", value: productDetails.price },
              { label: "Rating", value: productDetails.rating },
              { label: "Discount Price", value: productDetails.discountPrice },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-gray-200 rounded-md shadow"
              >
                <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                <p className="text-sm text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Images */}
          <h5 className="mt-5 mb-2 font-semibold">Images:</h5>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {productDetails.imageUrls?.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Product Image ${index + 1}`}
                className="object-cover w-full h-48 rounded-md cursor-pointer"
                onClick={() => setSelectedImageUrl(imageUrl)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;