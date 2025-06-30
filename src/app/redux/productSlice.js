import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest, postCreate, postUpdate, postImageRequest, postRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/product-constant'
import SimilarProduct from '../pages/agent-management/main-product/similar-product/page';

// Fetch Brands (GET Request)
export const getProductList = createAsyncThunk(
  'product/getProduct',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_PRODUCT);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch product'
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_PRODUCT, productData);
      return response;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.DELETE_PRODUCT, productId);
      return response;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_PRODUCT, productId);
      return response;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete product'
      );
    }
  }
);

export const addProductImage = createAsyncThunk(
  'product/addProductImage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postImageRequest(API_ENDPOINTS.ADD_PRODUCT_IMAGE, formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch product'
      );
    }
  }
);

export const getByIdProduct = createAsyncThunk(
  'product/getByIdProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.GET_BY_ID_PRODUCT, productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch product'
      );
    }
  }
);

export const getByIdImage = createAsyncThunk(
  'product/getByIdImage',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.GET_BY_ID_IMAGE}?productId=${productId}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch product'
      );
    }
  }
);

export const addProductMetaTag = createAsyncThunk(
  'product/addProductMetaTag',
  async (metaTagData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.UPDATE_METATAGS_BY_PRODUCTID, metaTagData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Coupon'
      );
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  'product/deleteProductImage',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.DELETE_PRODUCT_IMAGE, payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete product image'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    imageData: [],
    productDetails: null,
    faq: [],
    similarProduct: [],
    skin: [],
    productMetaData: [],
    imageDetails: null,
    loading: false,
    error: null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      //  Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.productDetails = action.payload
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(product => product.productId !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(product => product.productId !== action.payload);
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    builder
      .addCase(addProductImage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addProductImage.fulfilled, (state, action) => {
        state.imageData = action.payload
        state.loading = false
      })
      .addCase(addProductImage.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      .addCase(getByIdProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetails = null;
        state.faq = [];
        state.similarProduct = [];
        state.skin = [];
      })
      .addCase(getByIdProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action?.payload?.data?.productDetail || null;
        const { faq = [], faqIngredient = [], faqWithProduct = [] } = action?.payload?.data || {};
        state.faqCombined = [...faq, ...faqIngredient, ...faqWithProduct];
        state.similarProduct = action?.payload?.data?.similarProduct || [];
        state.skin = action?.payload?.data.skin || [];

      })
      .addCase(getByIdProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getByIdImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.imageDetails = null;
      })
      .addCase(getByIdImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageDetails = action.payload.data || [];
      })
      .addCase(getByIdImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProductMetaTag.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addProductMetaTag.fulfilled, (state, action) => {
        state.loading = false;
        state.productMetaData = action.payload;
      })
      .addCase(addProductMetaTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.imageDetails && action.payload?.imageId) {
          state.imageDetails = state.imageDetails.filter(img => img.imageId !== action.payload.imageId);
        }
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
})

export default productSlice.reducer;