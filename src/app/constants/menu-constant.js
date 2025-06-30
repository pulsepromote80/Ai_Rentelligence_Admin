export const API_ENDPOINTS = {
    GET_MENU_BY_ID: "/Menu/getByIdMenu", 
    GET_MENU_BY_USER_ROLE: "/Menu/getMenuByUserRole",
    GET_ALL_MENU: "/Menu/getAllMenu",
    ADD_MENU: "/Menu/addMenu",
    UPDATE_MENU: "/Menu/updateMenu",
    DELETE_MENU: "/Menu/deleteMenu",
    GET_ALL_MENU_WITH_SUBMENU: "/Menu/getAllMenuOfSubMenu"
};

export const Columns = [
    { key: 'id', label: 'S.No' },
    { key: 'menuName', label: 'Menu Name' },
    { key: 'menuIcon', label: 'Menu Icon' },
    { key: 'pageName', label: 'Page Name' },
    { key: 'controllerName', label: 'Controller Name' },
    { key: 'actionName', label: 'Action Name' },
    { key: 'displayOrder', label: 'Display Order' },
    { key: 'status', label: 'Status' }
,
];
