'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchActiveCategoryList } from '@/app/redux/categorySlice'
import { fetchActiveSubCategoryList } from '@/app/redux/subcategorySlice'
import { fetchActiveSubCategoryTypeList } from '@/app/redux/subcategoryTypeSlice'
import { fetchActiveSellerList } from '@/app/redux/sellerSlice'
import { addProduct } from '@/app/redux/productSlice'
import Select from 'react-select'
import { toast } from 'react-toastify'
import SimilarProduct from '../main-product/similar-product/page'
import { addProductImage } from '@/app/redux/productSlice'
import ProductMetaTag from '../main-product/product-metaTag/page'
import Tiptap from '@/app/common/rich-text-editor'
import { AiOutlinePlusCircle } from "react-icons/ai";
import { set } from 'react-hook-form'

const AddProduct = ({ onClose, productId }) => {
  const dispatch = useDispatch()
  const { categoryData } = useSelector((state) => state?.category ?? [])
  const { sellerData } = useSelector((state) => state?.sellers ?? [])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [subCategoryTypeOptions, setSubCategoryTypeOptions] = useState([])
  const [selectedSubCategoryType, setSelectedSubCategoryType] = useState(null)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [stock, setstock] = useState('')
  const [price, setprice] = useState('')
  const [discountPrice, setdiscountPrice] = useState('')
  const [rating, setrating] = useState('')
  const [noOfRating, setnoOfRating] = useState('')
  const [mrp, setMrp] = useState('')
  const [perHour, setPerHour] = useState('')
  const [unit, setUnit] = useState('')
  const [specification, setSpecification] = useState('')
  const [task, setTask] = useState('')
  const [totalReturn, setTotalReturn] = useState('')
  const [weeklyReturn, setWeeklyReturn] = useState('')
  const [toatalmonth, settoatalmonth] = useState('')
  const [nfTurL, setnfTurL] = useState('')
  const [month, setMonth] = useState('')
  const [activeTab, setActiveTab] = useState('addProduct');
  const [isProductMetaTagEnabled, setIsProductMetaTagEnabled] = useState(false);
  const [isSimilarProductTabEnabled, setIsSimilarProductTabEnabled] = useState(false);
  const [newProductId, setNewProductId] = useState(null);
  const [isNewArrial, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [similarProductData, setSimilarProductData] = useState(null);
  const [image, setImage] = useState(null);
  const [showSpecificationEditor, setShowSpecificationEditor] = useState(false);

  useEffect(() => {
    dispatch(fetchActiveCategoryList())
    dispatch(fetchActiveSellerList())
  }, [dispatch])

  
//   useEffect(() => {
//     if (price) {
//       const priceValue = parseFloat(price);
      
//       if (priceValue >= 100 && priceValue <= 2000) {
//         setMonth('8'); 
//         setTotalReturn('200'); 
//       } else if (priceValue >= 2100 && priceValue <= 10000) {
//         setMonth('9'); 
//         setTotalReturn('210'); 
//       } else if (priceValue >= 11000) {
//         setMonth('10'); 
//         setTotalReturn('220'); 
//       }
//     }
//   }, [price]);

  
// useEffect(() => {
//   if (price && month) {
//     const priceValue = parseFloat(price);
//     const monthlyReturnPercentage = parseFloat(month);
//     const weeklyReturnValue = (priceValue * monthlyReturnPercentage) / 100 / 4;
//     setWeeklyReturn(weeklyReturnValue.toFixed(2));
//   }
// }, [price, month]);

  
//   useEffect(() => {
//     if (totalReturn && month) {
//       const totalReturnValue = parseFloat(totalReturn);
//       const monthlyReturnValue = parseFloat(month);
//       if (monthlyReturnValue > 0) {
//         const calculatedMonths = (totalReturnValue / monthlyReturnValue).toFixed(0);
//         settoatalmonth(calculatedMonths);
//       }
//     }
//   }, [totalReturn, month]);

useEffect(() => {
  if (!price || price.trim() === "") {
    // Reset all fields if price is empty/null
    setMonth("");
    setTotalReturn("");
    setWeeklyReturn("");
    settoatalmonth("");
  } else {
    const priceValue = parseFloat(price);
    
    if (priceValue >= 100 && priceValue <= 2000) {
      setMonth("8"); 
      setTotalReturn("200"); 
    } else if (priceValue >= 2100 && priceValue <= 10000) {
      setMonth("9"); 
      setTotalReturn("210"); 
    } else if (priceValue >= 11000) {
      setMonth("10"); 
      setTotalReturn("220"); 
    }
  }
}, [price]);

useEffect(() => {
  if (month && price) {
    const monthlyReturnPercentage = parseFloat(month);
    const weeklyReturnValue = (parseFloat(price) * monthlyReturnPercentage) / 100 / 4;
    setWeeklyReturn(weeklyReturnValue.toFixed(2));
  } else {
    setWeeklyReturn(""); 
  }
}, [month, price]);

useEffect(() => {
  
  if (totalReturn && month) {
    const totalReturnValue = parseFloat(totalReturn);
    const monthlyReturnValue = parseFloat(month);
    if (monthlyReturnValue > 0) {
      const calculatedMonths = (totalReturnValue / monthlyReturnValue).toFixed(2);
      settoatalmonth(calculatedMonths);
    }
  } else {
    settoatalmonth(""); 
  }
}, [totalReturn, month]);

  const handleCategoryChange = (option) => {
    setSelectedCategory(option)
    setSelectedSubCategory(null)
    setSelectedSubCategoryType(null)
    setSubCategoryOptions([])
    setSubCategoryTypeOptions([])

    if (errors.selectedCategory) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedCategory: '' }));
    }

    if (option) {
      dispatch(fetchActiveSubCategoryList(option.value)).then((response) => {
        if (response?.payload?.length > 0) {
          setSubCategoryOptions(
            response.payload.map((sub) => ({
              value: sub.subCategoryGUID,
              label: sub.name,
            })),
          )
        }
      })
    }
  }

  const handleSubCategoryChange = (option) => {
    setSelectedSubCategory(option)
    setSelectedSubCategoryType(null)
    setSubCategoryTypeOptions([])

    if (option) {
      dispatch(fetchActiveSubCategoryTypeList(option.value)).then(
        (response) => {
          if (response?.payload?.length > 0) {
            setSubCategoryTypeOptions(
              response.payload.map((sub) => ({
                value: sub.subCategoryTypeGUID,
                label: sub.name,
              })),
            )
          }
        },
      )
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!selectedCategory) newErrors.selectedCategory = 'Category is required'
    if (!selectedSubCategory) newErrors.selectedSubCategory = 'Subcategory is required'
    if (!selectedSubCategoryType) newErrors.selectedSubCategoryType = 'SubcategoryType is required'
    if (!selectedSeller) newErrors.selectedSeller = 'Seller is required'
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!subTitle.trim()) newErrors.subTitle = 'Subtitle is required'
    if (!image) newErrors.image = 'Image is required'
    if (!nfTurL) newErrors.nfTurL = 'NFT Url is required'

    if (!stock.trim()) {
      newErrors.stock = 'Stock is required'
    } else if (isNaN(stock) || parseInt(stock) < 0) {
      newErrors.stock = 'Stock must be a positive number'
    }

    if (!mrp.trim()) {
      newErrors.mrp = 'MRP is required'
    } else if (isNaN(mrp) || parseFloat(mrp) <= 0) {
      newErrors.mrp = 'MRP must be a positive number '
    }

    if (!price.trim()) {
  newErrors.price = 'Price is required';
} else if (isNaN(price) || parseFloat(price) <= 100) {  
  newErrors.price = 'Price must be a positive number and Greater and Equal to 100';
} else if (parseFloat(price) > parseFloat(mrp)) {
  newErrors.price = 'Price cannot be greater than MRP';
}

    if (!discountPrice.trim()) {
      newErrors.discountPrice = 'Discount Price is required'
    } else if (isNaN(discountPrice) || parseFloat(discountPrice) < 0) {
      newErrors.discountPrice = 'Discount Price must be a positive number'
    }

    if (!perHour.trim()) {
      newErrors.perHour = 'Per Hour is required'
    } else if (isNaN(perHour) || parseFloat(perHour) < 0) {
      newErrors.perHour = 'Per Hour must be a positive number'
    }

    if (!unit.trim()) {
      newErrors.unit = 'Unit is required'
    } else if (isNaN(unit) || parseFloat(unit) < 0) {
      newErrors.unit = 'Unit must be a positive number'
    }

    if (!rating.trim()) {
      newErrors.rating = 'Rating is required'
    } else if (isNaN(rating) || parseFloat(rating) < 0 || parseFloat(rating) > 5) {
      newErrors.rating = 'Rating must be between 0 and 5'
    }

    if (!noOfRating.trim()) {
      newErrors.noOfRating = 'Number of ratings is required'
    } else if (isNaN(noOfRating) || parseInt(noOfRating) < 0) {
      newErrors.noOfRating = 'Number of ratings must be a positive number'
    }

    if (!image) {
      newErrors.image = 'Image is required';
    }

    if (!task.trim()) newErrors.task = 'Task is required'
    if (!totalReturn.trim()) {
      newErrors.totalReturn = 'Total Return is required'
    } else if (isNaN(totalReturn) || parseFloat(totalReturn) < 0) {
      newErrors.totalReturn = 'Total Return must be a positive number'
    }
    if (!weeklyReturn.trim()) {
      newErrors.weeklyReturn = 'Weekly Return is required'
    } else if (isNaN(weeklyReturn) || parseFloat(weeklyReturn) < 0) {
      newErrors.weeklyReturn = 'Weekly Return must be a positive number'
    }
    if (!month.trim()) {
      newErrors.month = 'Monthly Return is required'
    } else if (isNaN(month) || parseInt(month) < 0) {
      newErrors.month = 'Monthly Return must be a positive number'
    }

    if (!toatalmonth.trim()) {
      newErrors.toatalmonth = 'Total Month is required'
    } else if (isNaN(toatalmonth) || parseInt(toatalmonth) < 0) {
      newErrors.toatalmonth = 'Total Month must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleMrpChange = (e) => {
    const newMrp = e.target.value;
    setMrp(newMrp);
    
    if (errors.mrp) {
      setErrors((prev) => ({ ...prev, mrp: '' }));
    }
    
    if (price && !isNaN(price) && !isNaN(newMrp)) {
      const calculatedDiscount = Math.max(0, parseFloat(newMrp) - parseFloat(price));
      setdiscountPrice(calculatedDiscount.toString());
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setprice(newPrice);
    
    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: '' }));
    }
    
    if (mrp && !isNaN(mrp) && !isNaN(newPrice)) {
      const calculatedDiscount = Math.max(0, parseFloat(mrp) - parseFloat(newPrice));
      setdiscountPrice(calculatedDiscount.toString());
      
      if (parseFloat(newPrice) > parseFloat(mrp)) {
        setErrors((prev) => ({
          ...prev,
          price: 'Price cannot be greater than MRP'
        }));
      }
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const productData = {
      title,
      subTitle,
      description,
      stock,
      price,
      discountPrice,
      rating,
      noOfRating,
      mrp,
      perHour,
      unit,
      specification,
      task,
      toatalmonth,
      nfTurL,
      totalReturn,
      weeklyReturn,
      month,
      categoryId: selectedCategory.value,
      categoryName: selectedCategory.label,
      subCategoryId: selectedSubCategory.value,
      subCategoryName: selectedSubCategory.label,
      subCategoryTypeId: selectedSubCategoryType?.value || null,
      subCategoryTypeName: selectedSubCategoryType?.label,
      sellerId: selectedSeller.value,
      sellerName: selectedSeller.label,
      isNewArrial,
      isBestSeller,
      isRecommended
    }
    try {
      const response = await dispatch(addProduct(productData)).unwrap();
      if (response.statusCode === 200) {
        toast.success(response.message);
        const productId = response.productId;
        setNewProductId(productId);
        setIsSimilarProductTabEnabled(true);
        setActiveTab('addSimilarProduct');
        setIsProductMetaTagEnabled(true);
        setSimilarProductData(productData);

        const productImageData = {
          productId: productId,
          image
        };

        if (productImageData) {
          const imageResponse = await dispatch(addProductImage(productImageData)).unwrap();
        }
      } else if (response.statusCode === 417) {
        toast.warn(response.message);
      } else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error(error?.message || 'Failed to add product');
    }
  }

  const categoryOptions = categoryData?.map((category) => ({
    value: category.categoryId,
    label: category.name,
  }))

  const sellerOptions = sellerData?.map((seller) => ({
    value: seller.sellerId,
    label: seller.name,
  }));

  return (
    <div className="px-4 pb-4 bg-white rounded-lg shadow-md">
      <div className="flex mb-4 overflow-x-auto border-b border-gray-300 sm:overflow-x-hidden">
        <div
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${activeTab === 'addProduct'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-600 hover:text-blue-500'
            }`}
          onClick={() => setActiveTab('addProduct')}
        >
          Add Agent
        </div>
        
        <div
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${activeTab === 'addSimilarProduct'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : isSimilarProductTabEnabled
              ? 'text-gray-600 hover:text-blue-500'
              : 'text-gray-400 cursor-not-allowed'
            }`}
          onClick={() => {
            if (isSimilarProductTabEnabled) {
              setActiveTab('addSimilarProduct');
            }
          }}
        >
          Add Similar Agent
        </div>        
         <div
          className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-300 ${activeTab === 'addProductMetaTag'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : isProductMetaTagEnabled
              ? 'text-gray-600 hover:text-blue-500'
              : 'text-gray-400 cursor-not-allowed'
            }`}
          onClick={() => {
            if (isProductMetaTagEnabled) {
              setActiveTab('addProductMetaTag');
            }
          }}
        >
          Add Agent Meta Tag
        </div>
      </div>


      {activeTab === 'addProduct' ? (
        <div>
          <h3 className="mb-4 text-2xl font-bold text-center text-add-label">Add Agent</h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <Select options={categoryOptions} value={selectedCategory} onChange={handleCategoryChange} placeholder="Select Category" className="w-full mt-2" />
              {errors.selectedCategory && <p className="mt-1 text-sm text-red-500">{errors.selectedCategory}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <Select
                options={subCategoryOptions}
                value={selectedSubCategory}
                onChange={(value) => {
                  handleSubCategoryChange(value)
                  if (errors.selectedSubCategory) {
                    setErrors((prev) => ({ ...prev, selectedSubCategory: '' }))
                  }
                }}
                placeholder="Select Subcategory"
                isDisabled={!selectedCategory}
                className="w-full mt-2"
              />
              {errors.selectedSubCategory && (
                <p className="text-xs text-red-500">{errors.selectedSubCategory}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Subcategory Type <span className="text-red-500">*</span>
              </label>
              <Select
                options={subCategoryTypeOptions}
                value={selectedSubCategoryType}
                onChange={(value) => {
                  setSelectedSubCategoryType(value)
                  if (errors.selectedSubCategoryType) {
                    setErrors((prev) => ({ ...prev, selectedSubCategoryType: '' }))
                  }
                }}
                placeholder="Select Subcategory Type"
                isDisabled={!selectedSubCategory}
                className="w-full mt-2"
              />
              {errors.selectedSubCategoryType && (
                <p className="text-xs text-red-500">
                  {errors.selectedSubCategoryType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Seller <span className="text-red-500">*</span>
              </label>
              <Select
                options={sellerOptions}
                value={selectedSeller}
                onChange={(value) => {
                  setSelectedSeller(value)
                  if (errors.selectedSeller) {
                    setErrors((prev) => ({ ...prev, selectedSeller: '' }))
                  }
                }}
                placeholder="Select Seller"
                className="w-full mt-2"
              />
              {errors.selectedSeller && (
                <p className="text-xs text-red-500">{errors.selectedSeller}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: '' }))
                  }
                }}
                placeholder="Enter Title"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Subtitle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => {
                  setSubTitle(e.target.value)
                  if (errors.subTitle) {
                    setErrors((prev) => ({ ...prev, subTitle: '' }))
                  }
                }}
                placeholder="Enter Subtitle"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.subTitle ? 'border-red-500' : ''}`}
              />
              {errors.subTitle && (
                <p className="text-xs text-red-500">{errors.subTitle}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => {
                  setstock(e.target.value)
                  if (errors.stock) {
                    setErrors((prev) => ({ ...prev, stock: '' }))
                  }
                }}
                placeholder="Stock Quantity"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.stock ? 'border-red-500' : ''}`}
              />
              {errors.stock && (
                <p className="text-xs text-red-500">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                MRP <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={mrp}
                onChange={handleMrpChange}
                placeholder="MRP"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.mrp ? 'border-red-500' : ''}`}
              />
              {errors.mrp && (
                <p className="text-xs text-red-500">{errors.mrp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={handlePriceChange}
                placeholder="Price"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Discount Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => {
                  e.preventDefault();
                  return false;
                }}
                placeholder="Discount Price"
                className="w-full px-3 py-2 mt-2 border rounded cursor-not-allowed"
                readOnly
              />
              {errors.discountPrice && (
                <p className="text-xs text-red-500">{errors.discountPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Rating <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={rating}
                onChange={(e) => {
                  setrating(e.target.value)
                  if (errors.rating) {
                    setErrors((prev) => ({ ...prev, rating: '' }))
                  }
                }}
                placeholder="Rating"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.rating ? 'border-red-500' : ''}`}
              />
              {errors.rating && (
                <p className="text-xs text-red-500">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                No. of Ratings <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={noOfRating}
                onChange={(e) => {
                  setnoOfRating(e.target.value)
                  if (errors.noOfRating) {
                    setErrors((prev) => ({ ...prev, noOfRating: '' }))
                  }
                }}
                placeholder="No. of Ratings"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.noOfRating ? 'border-red-500' : ''}`}
              />
              {errors.noOfRating && (
                <p className="text-xs text-red-500">{errors.noOfRating}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                PerHour <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={perHour}
                onChange={(e) => {
                  setPerHour(e.target.value)
                  if (errors.perHour) {
                    setErrors((prev) => ({ ...prev, perHour: '' }))
                  }
                }}
                placeholder="Per Hour"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.perHour ? 'border-red-500' : ''}`}
              />
              {errors.perHour && (
                <p className="text-xs text-red-500">{errors.perHour}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value)
                  if (errors.unit) {
                    setErrors((prev) => ({ ...prev, unit: '' }))
                  }
                }}
                placeholder="Unit"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.unit ? 'border-red-500' : ''}`}
              />
              {errors.unit && (
                <p className="text-xs text-red-500">{errors.unit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Task <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value)
                  if (errors.task) {
                    setErrors((prev) => ({ ...prev, task: '' }))
                  }
                }}
                placeholder="Task"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.task ? 'border-red-500' : ''}`}
              />
              {errors.task && (
                <p className="text-xs text-red-500">{errors.task}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Total Return (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={totalReturn}
                readOnly
                isDisabled={!totalReturn}
                placeholder="Total Return"
                className="w-full px-3 py-2 mt-2 border rounded cursor-not-allowed"
              />
              {errors.totalReturn && (
                <p className="text-xs text-red-500">{errors.totalReturn}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Weekly Return ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={weeklyReturn}
                readOnly
                isDisabled={!weeklyReturn}
                placeholder="Weekly Return"
                className="w-full px-3 py-2 mt-2 border rounded cursor-not-allowed"
              />
              {errors.weeklyReturn && (
                <p className="text-xs text-red-500">{errors.weeklyReturn}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Monthly Return (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={month}
                readOnly
                isDisabled={!month}
                placeholder="Monthly Return"
                className="w-full px-3 py-2 mt-2 border rounded cursor-not-allowed"
              />
              {errors.month && (
                <p className="text-xs text-red-500">{errors.month}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Total Month <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={toatalmonth}
                readOnly
                isDisabled={!toatalmonth}
                placeholder="Total Month"
                className="w-full px-3 py-2 mt-2 border rounded cursor-not-allowed"
              />
              {errors.toatalmonth && (
                <p className="text-xs text-red-500">{errors.toatalmonth}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium">
                NFT Url <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nfTurL}
                onChange={(e) => {
                  setnfTurL(e.target.value)
                  if (errors.nfTurL) {
                    setErrors((prev) => ({ ...prev, nfTurL: '' }))
                  }
                }}
                placeholder="NFT Url"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.nfTurL ? 'border-red-500' : ''}`}
              />
              {errors.nfTurL && (
                <p className="text-xs text-red-500">{errors.nfTurL}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: '' }))
                  }
                }}
                placeholder="Enter product description"
                className={`w-full px-3 py-2 mt-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Choose Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-2"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
              )}
            </div>

            <div className="flex flex-row justify-start gap-10 mt-4 md:col-span-3">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isNewArrial}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="w-5 h-5 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium">New Arrival</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-5 h-5 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium">Best Seller</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  className="w-5 h-5 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium">Recommended</label>
              </div>
            </div>
          </div>
          <div className='mt-4'>
              <div className="flex items-center gap-3 mt-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  Add Specification <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  aria-label="Add Specification"
                  className="flex items-center justify-center w-8 h-8 text-2xl font-bold text-black transition-all duration-200 border border-blue-300 rounded-full shadow-md bg-gradient-to-tr focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setShowSpecificationEditor((prev) => !prev)}
                  title="Add Specification"
                >
                  <AiOutlinePlusCircle />
                </button>
              </div>
              {showSpecificationEditor && (
                <div className="mt-2 ">
                  <Tiptap
                    content={specification}
                    onChange={setSpecification}
                  />
                </div>
              )}
              {errors.specification && (
                <p className="text-xs text-red-500">{errors.specification}</p>
              )}
            </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      ) : activeTab === 'addSimilarProduct' && newProductId ? (
        <SimilarProduct 
          productId={newProductId} 
          data={similarProductData} 
          setActiveTab={setActiveTab} 
          onClose={onClose} 
        />
      ) : activeTab === 'addProductMetaTag' && newProductId ? (
        <ProductMetaTag 
          productId={newProductId} 
          setActiveTab={setActiveTab} 
          onClose={onClose} 
        />
      ) : null}
    </div>
  )
}

export default AddProduct