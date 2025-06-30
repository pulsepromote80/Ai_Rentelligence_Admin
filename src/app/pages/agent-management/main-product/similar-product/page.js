
'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductSearchByFilterNew } from '@/app/redux/productSearchByFilterSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { addSimilarProduct } from '@/app/redux/similarProductSlice';
import TableWithCheckbox from '@/app/common/similarProduct-datatable';
import { Columns } from '@/app/constants/similarproduct-constant';
import ImagePopup from '@/app/pages/image-popup/page';

const SimilarProduct = ({ productId, data, setActiveTab }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, searchFilterData } = useSelector((state) => state.searchFilter);
  const imagedetails = useSelector((state) => state.product);
  const [selectedSubProductIds, setSelectedSubProductIds] = useState([]);
  const [isSimilarProductAdded, setIsSimilarProductAdded] = useState(false);
  const [datalist, setDataList] = useState([]);

  useEffect(() => {
    if (searchFilterData?.length) {
      const filteredData = searchFilterData.filter(item => 
        item.gproductId !== productId
      );
      
      const updatedData = filteredData.map((item) => ({
        ...item,
        isSelected: false,
      }));
      setDataList(updatedData);
    } else {
      setDataList([]);
    }
  }, [searchFilterData, productId]);

  useEffect(() => {
    if (data?.categoryId && data?.subCategoryId && data?.subCategoryTypeId) {
      const requestBody = {
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        subcategoryTypeId: data.subCategoryTypeId,
        excludeCurrent: true
      };

      dispatch(getProductSearchByFilterNew(requestBody))
        .unwrap()
        .then((res) => {
          console.log("Filtered Products (excluding current):", res);
        })
        .catch((err) => {
          toast.error("Failed to fetch similar products");
        });
    }
  }, [data, dispatch, productId]);

  const handleAddSimilarProduct = (e) => {
    e.preventDefault();

    if (selectedSubProductIds.length === 0) {
      toast.warning("Please select at least one similar product");
      return;
    }

    const uniqueSubProductIds = [...new Set(selectedSubProductIds)];

    const requestBody = {
      productId: productId, 
      subProductIds: uniqueSubProductIds, 
      active: true,
    };

    dispatch(addSimilarProduct(requestBody))
      .unwrap()
      .then(() => {
        toast.success("Similar products added successfully!");
        setSelectedSubProductIds([]);
        setIsSimilarProductAdded(true);
      })
      .catch((err) => {
        console.error("Error adding similar products:", err);
        toast.error("Failed to add similar products");
      });
  };

  return (
    <form className="max-w-3xl p-8 mx-auto space-y-6 bg-white shadow-lg rounded-xl" onSubmit={handleAddSimilarProduct}>
      <div className="p-4">
        {imagedetails?.images?.[0] && (
          <div className="mb-4">
            <ImagePopup
              src={imagedetails.images[0]}
              alt="Product"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        <div className="p-4">
          {datalist?.length > 0 ? (
            <TableWithCheckbox
              columns={Columns}
              data={datalist}
              loading={loading}
              title="Similar Products"
              subtitle="(Current product excluded)"
              onSelectionChange={(selectedRows) => {
                const selectedIds = selectedRows.map(item => item.gproductId);
                setSelectedSubProductIds(selectedIds);
              }}
            />
          ) : (
            <p className="text-gray-500">No similar agents available (excluding current product).</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading || selectedSubProductIds.length === 0}
          className={`px-6 py-3 text-white rounded-lg ${
            loading || selectedSubProductIds.length === 0
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adding...' : 'Add Selected Products'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('addProductMetaTag')}
          className="px-6 py-3 ml-4 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          {isSimilarProductAdded ? 'Next' : 'Skip to Product Meta Tag'}
        </button>
      </div>
    </form>
  );
};

export default SimilarProduct;