
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAdminListbyPermission,
  MenusmenuAndSubMenuPermisiom,
  addPermission,
} from "@/app/redux/menuSlice";
import { toast } from "react-toastify";
import { FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';

export default function MenuPermission() {
  const dispatch = useDispatch();
  const { fetchAdminList, menuAndSubMenuPermission, loading } = useSelector(
    (state) => state.menu
  );
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  let toastShown = false;

  // Calculate selected permissions count
  const getSelectedCounts = () => {
    const menuCount = permissions.filter((m) => m.hasMenuPermission).length;
    const subMenuCount = permissions.reduce(
      (count, menu) =>
        count + menu.subMenus?.filter((sub) => sub.hasSubMenuPermission).length,
      0
    );
    return { menuCount, subMenuCount };
  };

  // Fetch admin list on mount
  useEffect(() => {
    dispatch(getAllAdminListbyPermission());
  }, [dispatch]);

  // Fetch permissions for selected admin
  const handleChange = (e) => {
    const adminId = e.target.value;
    setSelectedAdmin(adminId);
    if (adminId) {
      dispatch(MenusmenuAndSubMenuPermisiom(adminId));
    } else {
      setPermissions([]);
    }
  };

  // Update local state when API data comes
  useEffect(() => {
    if (menuAndSubMenuPermission?.length > 0) {
      setPermissions(menuAndSubMenuPermission);
    } else {
      setPermissions([]);
    }
  }, [menuAndSubMenuPermission]);

 const handlePermissionChange = (menuId, subMenuId = null) => {
  setPermissions((prev) =>
    prev.map((menu) => {
      if (menu.menuId === menuId) {
        if (subMenuId === null) {
          return {
            ...menu,
            hasMenuPermission: !menu.hasMenuPermission,
          };
        } else {
          if (!menu.hasMenuPermission) {
            if (!toastShown) {
              toastShown = true;
              toast.warning("Please select Menu first!");
              setTimeout(() => (toastShown = false), 1000); 
            }
            return menu;
          }

          const updatedSubMenus = menu.subMenus.map((sub) =>
            sub.subMenuId === subMenuId
              ? { ...sub, hasSubMenuPermission: !sub.hasSubMenuPermission }
              : sub
          );
          return { ...menu, subMenus: updatedSubMenus };
        }
      }
      return menu;
    })
  );
};




const handleSavePermissions = async () => {
  if (!selectedAdmin) {
    toast.warning("⚠️ Please select an admin first");
    return;
  }

  // Validation: If menu checked, at least one submenu must be selected
  const invalidMenus = permissions.filter(
    (menu) =>
      menu.hasMenuPermission &&
      (!menu.subMenus || !menu.subMenus.some((sub) => sub.hasSubMenuPermission))
  );

  if (invalidMenus.length > 0) {
    toast.warning(
      `Please select at least one SubMenu for menu: ${invalidMenus
        .map((m) => m.menuName)
        .join(", ")}`
    );
    return;
  }

  setSaving(true);

  try {
    const apiCalls = permissions.map((menu) =>
      dispatch(
        addPermission({
          appRoleId: selectedAdmin,
          menuId: menu.menuId,
          menuName: menu.menuName,
          pageName: menu.menuPageName,
          displayOrder: menu.menuDisplayOrder,
          createdBy: selectedAdmin,
          menuIcon: menu.menuIcon,
          activemenu: menu.hasMenuPermission,
          subMenuList:
            menu.subMenus?.map((sub) => ({
              subMenuId: sub.subMenuId,
              subMenuName: sub.subMenuName,
              subMenuPageName: sub.subMenuPageName,
              displayOrderSubMenu: sub.displayOrder,
              activeSubmenu: sub.hasSubMenuPermission,
            })) || [],
        })
      ).unwrap()
    );

    await Promise.all(apiCalls);
    toast.success("✅ All Menu and SubMenu Permissions saved successfully!");
  } catch (error) {
    console.error("❌ Failed to save permissions:", error);
    toast.error("Failed to save permissions. Please try again.");
  } finally {
    setSaving(false);
  }
};



return (
    <div className="p-2">
      <div className="max-w-6xl px-4 pt-1 pb-4 mx-auto bg-white shadow-lg rounded-2xl">
        <h1 className="pb-2 mb-3 text-xl font-bold text-gray-800 border-b">
          🔑 Menu Permission
        </h1>

        {/* Admin Dropdown */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <label className="block mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 text-indigo-600" />
              Select Admin User
            </label>
            <select
              value={selectedAdmin}
              onChange={handleChange}
              className="p-3 border-2 border-indigo-200 rounded-lg shadow-sm w-72 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white font-medium"
            >
              <option value="">-- Select Admin --</option>
              {fetchAdminList?.map((admin) => (
                <option key={admin.adminUserId} value={admin.adminUserId}>
                  {admin.username}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Permission Count */}
        {permissions?.length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Selected Permissions:</span>
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold">
                  {getSelectedCounts().menuCount} Menu
                </span>
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
                  {getSelectedCounts().subMenuCount} SubMenu
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Permission Table */}
        {permissions?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="text-white bg-gradient-to-r from-indigo-500 to-purple-500">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-center">Menu Permission</th>
                  <th className="p-3 text-left">Menu Name</th>
                  <th className="p-3 text-center">SubMenu Permission</th>
                  <th className="p-3 text-left">Sub Menus</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((menu, menuIndex) => (
                  <React.Fragment key={menu.menuId}>
                    {/* Menu Row */}
                    <tr
                      className={`transition hover:bg-indigo-50 ${
                        menuIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-3 text-sm text-center text-gray-700">
                        {menuIndex + 1}
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          {menu.hasMenuPermission ? (
                            <FaCheckCircle className="w-6 h-6 text-green-600 cursor-pointer hover:scale-110 transition-transform" 
                              onClick={() => handlePermissionChange(menu.menuId)} 
                              title="Click to uncheck" />
                          ) : (
                            <FaRegCheckCircle className="w-6 h-6 text-gray-400 cursor-pointer hover:scale-110 transition-transform" 
                              onClick={() => handlePermissionChange(menu.menuId)} 
                              title="Click to check" />
                          )}
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-indigo-700 text-base">
                        {menu.menuName}
                      </td>

                      <td className="p-3 text-center">
                        {menu.subMenus?.length > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                            {menu.subMenus.filter((sub) => sub.hasSubMenuPermission).length} / {menu.subMenus.length}
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-gray-400">-</td>
                    </tr>

                    {/* SubMenus Rows */}
                    {menu.subMenus?.map((sub) => (
                      <tr key={sub.subMenuId} className="bg-purple-50 hover:bg-purple-100">
                        <td className="p-3 text-sm text-center text-gray-700"></td>
                        <td className="p-3 text-center"></td>
                        <td className="p-3 font-medium text-gray-400">
                          -
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center">
                            {sub.hasSubMenuPermission ? (
                              <FaCheckCircle className="w-5 h-5 text-purple-600 cursor-pointer hover:scale-110 transition-transform" 
                                onClick={() => handlePermissionChange(menu.menuId, sub.subMenuId)} 
                                title="Click to uncheck" />
                            ) : (
                              <FaRegCheckCircle className="w-5 h-5 text-gray-400 cursor-pointer hover:scale-110 transition-transform" 
                                onClick={() => handlePermissionChange(menu.menuId, sub.subMenuId)} 
                                title="Click to check" />
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-purple-700 font-medium">└─ {sub.subMenuName}</span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Save Permissions Button */}
            <div className="mt-6 text-right">
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
