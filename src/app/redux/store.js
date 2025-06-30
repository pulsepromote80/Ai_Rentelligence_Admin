import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import sidebarReducer from './sidebarSlice';
import categoryReducer from './categorySlice';
import subCategoryReducer from './subcategorySlice'
import dashboardReducer from './dashboardSlice';
import adminReducer from './adminUserSlice';
import subCategoryTypeReducer from './subcategoryTypeSlice';
import regionReducer from "./regionSlice"
import menuReducer from './menuSlice';
import subMenuReducer from './submenuSlice'
import supportReducer from './supportSlice';
import productReducer from './productSlice';
import similarProductReducer from './similarProductSlice';
import sellerReducer from './sellerSlice';
import productSearchFilterReducer from './productSearchByFilterSlice';
import adminManageFundReducer from './adminManageFundSlice';
import communityReducer from './communitySlice';
import adminManageUserReducer from './adminMangeUserSlice';
import adminMasterReducer from './adminMasterSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        dashboard: dashboardReducer,
        admin: adminReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        subCategoryType: subCategoryTypeReducer,
        region: regionReducer,
        menu: menuReducer,
        submenu: subMenuReducer,
        support:supportReducer,
        product: productReducer,
        similarProduct: similarProductReducer,
        sellers: sellerReducer,
        searchFilter: productSearchFilterReducer,
        adminManageFund: adminManageFundReducer,
        community: communityReducer,
        adminManageUser: adminManageUserReducer,
        adminMaster: adminMasterReducer
    },
});