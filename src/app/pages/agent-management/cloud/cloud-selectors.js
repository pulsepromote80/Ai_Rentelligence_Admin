import { createSelector } from "reselect";

const cloudState = (state) => state.cloud;

export const cloudData = createSelector(
  [cloudState],
  (cloud) => cloud.data || []
);

export const cloudLoading = createSelector(
  [cloudState],
  (cloud) => cloud.loading || false
);
export const cloudDeleteLoading = (state) => state.cloud.deleteLoading;
export const cloudDeleteSuccess = (state) => state.cloud.deleteSuccess;
export const cloudDeleteError = (state) => state.cloud.deleteError;
export const cloudEditingItem = (state) => state.cloud.editingItem;
