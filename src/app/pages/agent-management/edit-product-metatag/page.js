
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProductMetaTag, getProductList } from '@/app/redux/productSlice';
import { toast } from 'react-toastify';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const EditProductMetaTag = ({ product, onClose }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaDescription: '',
        metaKeyword: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                metaTitle: product.metaTitle || '',
                metaDescription: product.metaDescription || '',
                metaKeyword: product.metakeyword || '' 
            });
        }
    }, [product]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const metaPayload = {
            productId: product.productId,
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            metaKeyword: formData.metaKeyword
        };

        try {
            const resultAction = await dispatch(addProductMetaTag(metaPayload));
            
            if (addProductMetaTag.fulfilled.match(resultAction)) {
                toast.success('Meta Tag updated successfully!');
                await dispatch(getProductList());
            } else {
                throw new Error(resultAction.payload || 'Failed to update Meta Tag');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">Edit Agent Meta Tags</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Meta Title</label>
                    <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter Meta Title"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Meta Description</label>
                    <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter Meta Description"
                        rows="4"
                        required
                    />
                </div>

                <div>
                    <label className="flex items-center text-sm font-medium">
                        Meta Keywords
                        <div className="relative ml-1 cursor-pointer group">
                            <InformationCircleIcon className="w-4 h-4 text-gray-400" />
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
                        className="w-full p-2 mt-1 border rounded"
                        placeholder="Enter Meta Keywords"
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-blue-700 bg-white border border-blue-700 rounded-md hover:bg-blue-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductMetaTag;