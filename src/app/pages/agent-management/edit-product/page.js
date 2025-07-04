'use client'
import React, { useState, useEffect } from 'react';
import { getProductList, updateProduct } from '@/app/redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveSellerList } from '@/app/redux/sellerSlice';
import { toast } from 'react-toastify';
import Tiptap from '@/app/common/rich-text-editor';

const EditProduct = ({ product, onClose }) => {
    const { sellerData } = useSelector((state) => state.sellers);
    const data = useSelector((state) => state?.product ?? []);
    const dispatch = useDispatch();
    const [mrpError, setMrpError] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        category: '',
        subcategory: '',
        subcategoryTypeId: '',
        seller: '',
        title: '',
        subTitle: '',
        stock: '',
        price: '',
        mrp: '',
        perHour: '',
        unit: '',
        specification: '',
        discountPrice: '',
        rating: '',
        noOfRating: '',
        description: '',
        isNewArrial: false,
        isBestSeller: false,
        isRecommended: false,
        isActive: false,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                category: product.categoryId || '',
                subcategory: product.subCategoryId || '',
                subCategoryTypeId: product.subCategoryTypeId || '',
                seller: product.sellerId || '',
                title: product.productName || '',
                subTitle: product.subName || '',
                stock: product.stock || '',
                price: product.price || '',
                mrp: product.mrp || '',
                discountPrice: product.discountPrice || '',
                perHour: product.perHour || '',
                unit: product.unit || '',
                specification: product.specification || '',
                rating: product.rating || '',
                noOfRating: product.noOfRating || '',
                description: product.description || '',
                isNewArrial: product.isNewArrial,
                isBestSeller: product.isBestSeller,
                isRecommended: product.isRecommended,
                isActive: product.active,
            });
        }
        dispatch(fetchActiveSellerList());
    }, [product, dispatch]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevFormData) => {
            const newData = { ...prevFormData };
            newData[name] = type === "checkbox" ? checked : value;

            // Validate MRP and Price in real-time
            if (name === 'mrp' || name === 'price') {
                const mrp = parseFloat(newData.mrp) || 0;
                const price = parseFloat(newData.price) || 0;

                if (price > mrp) {
                    setMrpError(true);
                    setErrors({
                        ...errors,
                        price: 'Price cannot be greater than MRP'
                    });
                } else {
                    setMrpError(false);
                    setErrors({
                        ...errors,
                        price: ''
                    });
                }
                const discountPrice = mrp - price;
                newData.discountPrice = discountPrice.toString();
            }

            return newData;
        });
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const updatedData = {
        productId: product?.productId,
        categoryId: product?.categoryId,
        subCategoryId: product?.subCategoryId,
        subCategoryTypeId: product?.subCategoryTypeId,
        sellerId: formData.seller,
        title: formData.title,
        subTitle: formData.subTitle,
        rating: formData.rating,
        noOfRating: formData.noOfRating,
        stock: formData.stock,
        price: formData.price,
        mrp: formData.mrp,
        discountPrice: formData.discountPrice,
        perHour: formData.perHour,
        unit: formData.unit,
        specification: formData.specification,
        description: formData.description,
        isNewArrial: formData.isNewArrial,
        isBestSeller: formData.isBestSeller,
        isRecommended: formData.isRecommended,
        active: formData.isActive
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let isValid = true;
        const newErrors = {};
        const mrp = parseFloat(formData.mrp) || 0;
        const price = parseFloat(formData.price) || 0;
        if (price > mrp) {
            newErrors.price = 'Price cannot be greater than MRP';
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        dispatch(updateProduct(updatedData))
            .unwrap()
            .then((response) => {
                if (response.statusCode === 200) {
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
                dispatch(getProductList());
                onClose();
            })
            .catch((error) => {
                toast.error(error?.message || "Failed to update product");
            });
    };

    return (
        <div className="p-4 mb-4 rounded">
            <h3 className="mb-6 text-xl font-bold text-center text-add-label md:text-2xl md:mb-10">Edit Product</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Category */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Category</label>
                    <input
                        type="category"
                        name="category"
                        value={product?.categoryName}
                        disabled
                        className="w-full px-3 py-2 mt-2 text-sm bg-gray-100 border rounded cursor-not-allowed md:text-base"
                    />
                </div>

                {/* Subcategory */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Subcategory</label>
                    <input
                        type="text"
                        name="subcategory"
                        value={product?.subCategoryName}
                        disabled
                        className="w-full px-3 py-2 mt-2 text-sm bg-gray-100 border rounded cursor-not-allowed md:text-base"
                    />
                </div>

                {/* Subcategory Type */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Subcategory Type</label>
                    <input
                        type="text"
                        name="subCategoryTypeId"
                        value={product?.subCategoryTypeName}
                        disabled
                        className="w-full px-3 py-2 mt-2 text-sm bg-gray-100 border rounded cursor-not-allowed md:text-base"
                    />
                </div>

                {/* Seller */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Seller</label>
                    <select
                        name="seller"
                        value={formData.seller}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    >
                        <option value="">Select Seller</option>
                        {sellerData.map((seller) => (
                            <option key={seller.sellerId} value={seller.sellerId}>
                                {seller.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Title */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                {/* Subtitle */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Subtitle</label>
                    <input
                        type="text"
                        name="subTitle"
                        value={formData.subTitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                {/* Stock Quantity */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>


                {/* MRP */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">MRP</label>
                    <input
                        type="number"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                {/* Price */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 mt-2 text-sm border rounded md:text-base ${errors.price ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.price && (
                        <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                    )}
                </div>

                {/* Discount Price */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Discount Price</label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                {/* Rating */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Rating</label>
                    <input
                        type="text"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                {/* No. of Ratings */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">No. of Ratings</label>
                    <input
                        type="text"
                        name="noOfRating"
                        value={formData.noOfRating}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium">PerHour</label>
                    <input
                        type="number"
                        name="perHour"
                        value={formData.perHour}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Unit</label>
                    <input
                        type="number"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Description</label>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-2 text-sm border rounded md:text-base"
                        rows="3"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Specification</label>
                    <Tiptap
                        value={formData.specification}
                        onChange={val => setFormData(prev => ({ ...prev, specification: val }))}
                    />
                </div>
                
                

                {/* Active Checkbox */}
                <div className="col-span-1 mt-3 md:col-span-3">
                    <label className="flex items-center text-sm font-medium">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2"
                        />
                        Active
                    </label>
                </div>

                {/* Checkbox Group */}
                <div className="flex flex-col col-span-1 mt-3 space-y-3 md:col-span-3 md:flex-row md:space-y-0 md:space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isNewArrial"
                            checked={formData.isNewArrial}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4"
                        />
                        <span className="text-sm md:text-base">New Arrival</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isBestSeller"
                            checked={formData.isBestSeller}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4"
                        />
                        <span className="text-sm md:text-base">Best Seller</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isRecommended"
                            checked={formData.isRecommended}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4"
                        />
                        <span className="text-sm md:text-base">Recommended</span>
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex flex-col col-span-1 gap-3 mt-4 md:col-span-3 md:flex-row md:justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-white rounded bg-cancel-btn md:text-base"
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 text-sm text-white rounded bg-submit-btn md:text-base"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;