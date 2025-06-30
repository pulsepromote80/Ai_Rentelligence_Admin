export const API_ENDPOINTS = {
  GET_SUB_MENU_BY_MENU_ID: "/SubMenu/getSubMenubyMenuId",
  GET_ALL_MENU: "/Menu/getAllMenu",
  ADD_SUB_MENU: "/SubMenu/addSubMenu",
  DELETE_SUB_MENU: "/SubMenu/deleteSubMenu",
  UPDATE_SUBMENU: "/SubMenu/updateSubMenu"
};
  
  export const Columns = [
    { key: 'id', label: 'S.No' },
    { key: 'subMenuName', label: 'Sub Menu Name' },
    { key: 'subMenuPageName', label: 'Sub Menu Page Name' },
    { key: 'displayOrder', label: 'Display Order' },
    { key: 'status', label: 'Status' }
  ];
  
