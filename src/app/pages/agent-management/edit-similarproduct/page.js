
'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductSearchByFilterNew } from '@/app/redux/productSearchByFilterSlice';
import { fetchSimilarProduct, updateSimilarProduct } from '@/app/redux/similarProductSlice';
import { toast } from 'react-toastify';
import TableWithCheckbox from '@/app/common/similarProduct-datatable';
import { Columns } from '@/app/constants/similarproduct-constant';

const EditSimilarProduct = ({ row }) => {
  const dispatch = useDispatch();
  const { loading, searchFilterData } = useSelector((state) => state.searchFilter);
  const [preSelectedIds, setPreSelectedIds] = useState([]);
  const [currentSelectedIds, setCurrentSelectedIds] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (row?.categoryId && row?.subCategoryId && row?.subCategoryTypeId) {
        const body = {
          categoryId: row.categoryId,
          subCategoryId: row.subCategoryId,
          subcategoryTypeId: row.subCategoryTypeId,
          excludeCurrentProduct: true
        };
        try {
          await dispatch(getProductSearchByFilterNew(body)).unwrap();
        } catch {
          //toast.error('Failed to fetch product search filter data');
        }
      }
    };

    fetchFilteredProducts();
  }, [row, dispatch]);

  useEffect(() => {
    if (row?.productId) {
      dispatch(fetchSimilarProduct(row.productId))
        .unwrap()
        .then((data) => {
          const ids = Array.isArray(data) ? data.map(item => String(item.subProductId)) : [];
          setPreSelectedIds(ids);
          setCurrentSelectedIds(ids);
        })
        .catch(() => toast.error('Failed to fetch similar product IDs'));
    }
  }, [row, dispatch]);

  useEffect(() => {
       if (searchFilterData?.length) {
       const filteredData = searchFilterData.filter(item => 
        item.gproductId !== row?.productId
      );
      
      const updatedData = filteredData.map((item) => ({
        ...item,
        isSelected: currentSelectedIds.includes(String(item.gproductId)),
      }));
      setTableData(updatedData);
    } else {
      setTableData([]);
    }
  }, [searchFilterData, currentSelectedIds, row?.gproductId]);

  const handleCheckboxChange = (selectedIds) => {
    setCurrentSelectedIds(selectedIds);
  };

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    const aSet = new Set(a);
    const bSet = new Set(b);

    return a.every(item => bSet.has(item)) &&
      b.every(item => aSet.has(item));
  };

  const handleUpdate = async () => {
    const hasChanges = !arraysEqual(preSelectedIds, currentSelectedIds);
    if (!hasChanges) {
      toast.info('No changes detected');
      return;
    }

    try {
      await dispatch(updateSimilarProduct({
        productId: row.productId,
        subProductId: currentSelectedIds,
      })).unwrap();

      toast.success('Similar products updated successfully');
      setPreSelectedIds([...currentSelectedIds]);
    } catch (error) {
      toast.error('Failed to update similar products');
    }
  };
  return (
    <div>
      {tableData?.length > 0 ? (
        <TableWithCheckbox
          columns={Columns}
          data={tableData}
          loading={loading}
          title="Edit Similar Products"
          selectedRowIds={currentSelectedIds}
          onCheckboxChange={handleCheckboxChange}
        />
      ) : (
        <p className="mt-4 text-center">No Similar Agents found.</p>
      )}
      <div className="flex justify-end mr-3">
        <button
          onClick={handleUpdate}
          className="px-6 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out bg-green-600 shadow-md hover:bg-green-700 rounded-xl"
        >
          Update
        </button>
      </div>

    </div>
  );
};

export default EditSimilarProduct;