import { createSelector } from 'reselect';

const sidebarState = (state) => state.sidebar || {};

export const selectMenuItems = createSelector(
    [sidebarState],
    (sidebar) => sidebar.menuItems || []
);

export const selectIcons = createSelector(
    [sidebarState],
    (sidebar) => sidebar.icons || []
);

export const selectLoading = createSelector(
    [sidebarState],
    (sidebar) => sidebar.loading
);

export const selectError = createSelector(
    [sidebarState],
    (sidebar) => sidebar.error
);
