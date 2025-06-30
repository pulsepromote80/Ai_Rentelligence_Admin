
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductMetaTag, getProductList } from '@/app/redux/productSlice';
import { toast } from 'react-toastify';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const ProductMetaTag = ({ productId, onClose, setActiveTab }) => {
    const dispatch = useDispatch();
    const { productMetaData } = useSelector((state) => state.product);
    const [isProductMetaTagAdded, setIsProductMetaTagAdded] = useState(false);

    const [formData, setFormData] = useState({
        metaTitle: '',
        metaDescription: '',
        metaKeyword: ''
    });

    const handleCancel = async () => {
        try {
            await dispatch(getProductList());
            toast.success('Product list refreshed!');
            if (onClose) onClose();
        } catch (error) {
            toast.error('Failed to refresh product list');
        }
    };

    useEffect(() => {
        if (productMetaData) {
            setFormData({
                metaTitle: productMetaData.metaTitle || '',
                metaDescription: productMetaData.metaDescription || '',
                metaKeyword: productMetaData.metaKeyword || ''
            });
        }
    }, [productMetaData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const metaPayload = {
            productId,
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            metaKeyword: formData.metaKeyword
        };

        const resultAction = await dispatch(addProductMetaTag(metaPayload));

        if (addProductMetaTag.fulfilled.match(resultAction)) {
            toast.success('Meta Tag added successfully!');
            setIsProductMetaTagAdded(true);
        } else {
            toast.error(resultAction.payload || 'Failed to add Meta Tag');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-2xl">
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <h3 className="mb-6 text-2xl font-bold text-center text-gray-800">
                        Add Agent Meta Tags
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter Meta Title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Meta Description
                            </label>
                            <textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleChange}
                                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter Meta Description"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                Meta Keywords
                                <div className="relative ml-1 cursor-pointer group">
                                    <InformationCircleIcon className="w-4 h-4 text-gray-900" />
                                    <div className="absolute z-10 hidden w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded-md shadow-lg group-hover:block">
                                        Enter comma-separated keywords
                                    </div>
                                </div>
                            </label>
                            <input
                                type="text"
                                name="metaKeyword"
                                value={formData.metaKeyword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter Meta Keywords"
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <button
                                type="submit"
                                className="px-6 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Submit
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 text-blue-700 transition-colors duration-200 bg-white border border-blue-700 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Go to Product List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductMetaTag;