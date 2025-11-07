import { createSelector } from "reselect";

const eventState = (state) => state.event;

export const eventData = createSelector(
  [eventState],
  (event) => event.data || []
);

export const eventLoading = createSelector(
  [eventState],
  (event) => event.loading || false
);
