"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList, deleteProduct, getByIdProduct, getByIdImage } from '@/app/redux/productSlice';
import ProductTable from '@/app/common/product-datatable';
import { Columns } from '@/app/constants/product-constant';
import AddProduct from '../add-product/page';
import EditProduct from '../edit-product/page';
import AddProductImage from '../add-product-image/page';
import { toast } from 'react-toastify';
import DeletePopup from '@/app/common/utils/delete-popup';
import ProductDetails from './product-details/page';
import SimilarProductDetails from './similarProduct-details/page';
import EditSimilarProduct from '../edit-similarproduct/page';
import EditProductMetaTag from '../edit-product-metatag/page';
import ProductMetaTagDetails from '../agent/product-meta-tag-details/page';


const Agent = () => {
  const dispatch = useDispatch();
  const { loading, data, productDetails } = useSelector((state) => state.product ?? {});

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editProductMetaTag, setEditProductMetaTag] = useState(null);
  const [editSimilarProduct, setEditSimilarProduct] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addProductImage, setAddProductImage] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const similarProductList = useSelector((state) => state.product.similarProduct)
  


  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  const handleRowClick = (row) => {
    const productId = row.productId;
    dispatch(getByIdProduct({ id: productId }));
    setShowProductDetails(true);
    setShowForm(false);
    setActiveTab('product');
  };

  const confirmDelete = (row) => {
    setSelectedProduct(row);
    setShowDeletePopup(true);
  };

  const handleDelete = async () => {
    if (selectedProduct?.active) {
      dispatch(deleteProduct({
        productId: selectedProduct.productId,
        categoryId: selectedProduct.categoryId,
        subCategoryId: selectedProduct.subCategoryId,
        subCategoryTypeId: selectedProduct.subCategoryTypeId,
      }))
        .unwrap()
        .then((response) => {
          if (response.statusCode === 200) {
            toast.success(response.message);
          } else {
            toast.error(response.message || "Failed to delete product");
          }

          setShowDeletePopup(false);
          setSelectedProduct(null);
          dispatch(getProductList());
        })
        .catch((error) => {
          toast.error(error?.message || "Something went wrong while deleting the product");
        });
    }
  };

  const handleEdit = (row) => {
    setEditProduct(row);
    setEditSimilarProduct({
      productId: row.productId,
      categoryId: row.categoryId,
      subCategoryId: row.subCategoryId,
      subCategoryTypeId: row.subCategoryTypeId,
    });
    setActiveTab('editProduct');
  };

  const closeEditForm = () => {
    setEditProduct(null);
  };

  const handleAddImage = (row) => {
    setAddProductImage(row);
    dispatch(getByIdImage(row.productId));
    setSelectedProduct(row);
  };

  const closeAddImageForm = () => {
    setAddProductImage(null);
  };

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <div className="w-full sm:w-[45%] flex sm:justify-start justify-center mb-4">
          {!showForm && !editProduct && !addProductImage && !showProductDetails && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-white rounded-md bg-add-btn"
            >
              + Add Agent
            </button>
          )}
        </div>

      </div>

      {showForm && !showProductDetails && <AddProduct onClose={() => setShowForm(false)} />}
      {addProductImage && <AddProductImage product={addProductImage} onClose={closeAddImageForm} />}
      {editProduct && (
        <div className="p-4 mt-4 bg-white rounded shadow">
          <div className="flex items-center justify-center order-1 mb-2 sm:order-2">
            <button onClick={closeEditForm} className="px-4 py-1 text-sm text-white rounded bg-cancel-btn">
              Cancel
            </button>
          </div>
          <div className="flex flex-wrap justify-center mb-4 overflow-x-auto border-b border-gray-300 sm:justify-between sm:overflow-x-hidden ">

            <div className="flex order-2 w-full space-x-4 sm:order-1">
              <div
                className={`py-2 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'editProduct'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-500'
                  }`}
                onClick={() => setActiveTab('editProduct')}
              >
                Edit Product
              </div>

              <div
                className={`py-2 text-sm font-medium border-b-2 transition-colors duration- whitespace-nowrap ${activeTab === 'editSimilarProduct'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-500'
                  }`}
                onClick={() => setActiveTab('editSimilarProduct')}
              >
                Edit Similar Agent
              </div>

              <div
                className={`py-2 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === 'editMetaTags'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-500'
                  }`}
                onClick={() => setActiveTab('editMetaTags')}
              >
                Edit Agent Meta Tag
              </div>
            </div>

          </div>

          {activeTab === 'editProduct' && (
            <EditProduct product={editProduct} onClose={closeEditForm} />
          )}
          {activeTab === 'editSimilarProduct' && (
            <EditSimilarProduct row={editSimilarProduct} />
          )}
          {activeTab === 'editMetaTags' && (
            <EditProductMetaTag product={editProduct} onClose={closeEditForm} />
          )} 
        </div>
      )}


      {showProductDetails && productDetails && (
        <div className="mt-4">
          <div className="flex flex-wrap justify-center mb-4 border-b border-gray-300 sm:justify-between ">
            <div className="flex items-center order-1 mb-2 sm:order-2">
              <button
                onClick={() => setShowProductDetails(false)}
                className="px-3 py-1 text-sm text-white rounded bg-cancel-btn"
              >
                Cancel
              </button>
            </div>
            <div className="flex order-2 space-x-4 sm:order-1">
              <div
                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-300 ${activeTab === 'product'
                  ? 'border-b-2 border-blue-500 text-blue-500 text-lg'
                  : 'text-gray-600 hover:text-blue-500'
                  }`}
                onClick={() => setActiveTab('product')}
              >
                Agent Details
              </div>

              <div
                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-300 ${activeTab === 'similarProduct'
                  ? 'border-b-2 border-blue-500 text-blue-500 text-lg'
                  : 'text-gray-600 hover:text-blue-500'
                  }`}
                onClick={() => setActiveTab('similarProduct')}
              >
                Similar Agent Details
              </div>

              <div
                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-300 ${activeTab === 'similarProductMetatag'
                  ? 'border-b-2 border-blue-500 text-blue-500 text-lg'
                  : 'text-gray-600 hover:text-blue-500'
                  }`}
                onClick={() => setActiveTab('similarProductMetatag')}
              >
                 Agent Metatag Details
              </div>
            </div>

          </div>
          <ProductDetails
            productDetails={productDetails}
            activeTab={activeTab}
            setSelectedImageUrl={setSelectedImageUrl}
          />
          <SimilarProductDetails similarProductList={similarProductList} setActiveTab={setActiveTab} activeTab={activeTab} />
          {activeTab === 'similarProductMetatag'  && <ProductMetaTagDetails product={productDetails}/>}
          
          {selectedImageUrl && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
              onClick={() => setSelectedImageUrl(null)}
            >
              <div className="relative w-full max-w-3xl px-4" onClick={(e) => e.stopPropagation()}>
                <img
                  src={selectedImageUrl}
                  alt="Selected Product"
                  className="w-full max-h-[80vh] object-contain rounded-md"
                />
                <button
                  onClick={() => setSelectedImageUrl(null)}
                  className="absolute px-3 py-1 text-lg text-black bg-white rounded-full shadow-lg top-2 right-2"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!showForm && !editProduct && !addProductImage && !showProductDetails && (
        <ProductTable
          columns={Columns}
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          onAddImage={handleAddImage}
          onRowClick={handleRowClick}
          title={'Product'}
        />
      )}

      <DeletePopup
        show={showDeletePopup}
        type="product"
        name={selectedProduct?.productName}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Agent;