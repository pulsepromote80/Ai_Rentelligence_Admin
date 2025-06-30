import { createSelector } from 'reselect';

const subCategoryState = (state) => state.subCategory;

export const subCategoryData = createSelector(
    [subCategoryState],
    (subCategory) => subCategory.data || []
);

export const subCategoryLoading = createSelector(
    [subCategoryState],
    (subCategory) => subCategory.loading
);
