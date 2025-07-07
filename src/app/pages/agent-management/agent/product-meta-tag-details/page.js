'use client';
import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
const ProductMetaTagDetails = ({ product }) => {
    if (!product) return <p>No Data Found</p>;
    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl !mx-auto !mt-6">
            <div className="flex justify-between items-center !mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Product Meta Details</h2>
            </div>
            <div className="!space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Meta Title</label>
                    <div className="!mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                        {product?.metaTitle}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Meta Description</label>
                    <div className="!mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                       {product?.metaDescription}
                    </div>
                </div>
                <div>
                    <label className="flex items-center text-sm font-medium text-gray-600">
                        Meta Keywords
                        <span className="ml-1 text-gray-400">
                            <InformationCircleIcon className="w-4 h-4" title="Comma-separated keywords" />
                        </span>
                    </label>
                    <div className="!mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                         {product?.metakeyword}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductMetaTagDetails;