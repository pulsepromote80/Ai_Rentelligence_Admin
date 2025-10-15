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
