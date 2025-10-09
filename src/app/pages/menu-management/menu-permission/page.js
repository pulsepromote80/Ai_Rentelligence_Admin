
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAdminListbyPermission,
  MenusmenuAndSubMenuPermisiom,
  addPermission,
} from "@/app/redux/menuSlice";
import { toast } from "react-toastify";

export default function MenuPermission() {
  const dispatch = useDispatch();
  const { fetchAdminList, menuAndSubMenuPermission, loading } = useSelector(
    (state) => state.menu
  );
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  let toastShown = false;

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
      <div className="max-w-6xl p-6 mx-auto bg-white shadow-lg rounded-2xl">
        <h1 className="pb-3 mb-6 text-xl font-bold text-gray-800 border-b">
          🔑 Menu Permission
        </h1>

        {/* Admin Dropdown */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Admin
            </label>
            <select
              value={selectedAdmin}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg shadow-sm w-72 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
                        <input
                          type="checkbox"
                          checked={menu.hasMenuPermission || false}
                          onChange={() => handlePermissionChange(menu.menuId)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-400"
                        />
                      </td>

                      <td className="p-3 font-medium text-gray-800">
                        {menu.menuName}
                      </td>

                      
                    
                    </tr>

                    {/* SubMenus Rows */}
                    {menu.subMenus?.map((sub) => (
                      <tr key={sub.subMenuId} className="bg-gray-50 hover:bg-indigo-50">
                        <td className="p-3 text-sm text-center text-gray-700"></td>
                        <td className="p-3 text-center"></td>
                        <td className="p-3"></td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={sub.hasSubMenuPermission || false}
                            onChange={() =>
                              handlePermissionChange(menu.menuId, sub.subMenuId)
                            }
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
                          />
                        </td>
                        <td className="p-3 text-gray-600">{sub.subMenuName}</td>
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
                className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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