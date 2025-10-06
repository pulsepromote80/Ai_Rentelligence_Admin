// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllAdminListbyPermission,
//   MenusmenuAndSubMenuPermisiom,
// } from "@/app/redux/menuSlice";

// export default function MenuPermission() {
//   const dispatch = useDispatch();
//   const { fetchAdminList, menuAndSubMenuPermission, loading } = useSelector(
//     (state) => state.menu
//   );
//   const [selectedAdmin, setSelectedAdmin] = useState("");

//   useEffect(() => {
//     dispatch(getAllAdminListbyPermission());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const adminId = e.target.value;
//     setSelectedAdmin(adminId);
//     if (adminId) {
//       dispatch(MenusmenuAndSubMenuPermisiom(adminId));
//     }
//   };

//   const handleMenuPermissionToggle = (menuId) => {
//     const updatedPermissions = menuAndSubMenuPermission.map((menu) =>
//       menu.menuId === menuId
//         ? { ...menu, HasMenuPermission: menu.HasMenuPermission === 1 ? 0 : 1 }
//         : menu
//     );
//     console.log("Updated Permissions:", updatedPermissions);
//   };

//   return (
//     <div className="p-2">
//       <div className="max-w-6xl p-6 mx-auto bg-white shadow-lg rounded-2xl">
//         <h1 className="pb-3 mb-6 text-2xl font-bold text-gray-800 border-b">
//           🔑 Menu Permission
//         </h1>

//         {/* Admin Dropdown */}
//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : (
//           <div className="mb-6">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Select Admin
//             </label>
//             <select
//               value={selectedAdmin}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg shadow-sm w-72 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             >
//               <option value="">-- Select Admin --</option>
//               {fetchAdminList?.map((admin) => (
//                 <option key={admin.adminUserId} value={admin.adminUserId}>
//                   {admin.username}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Permission Table */}
//         {menuAndSubMenuPermission?.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-200 rounded-lg shadow-sm">
//               <thead>
//                 <tr className="text-white bg-gradient-to-r from-indigo-500 to-purple-500">
//                   <th className="p-3 text-left">#</th>
//                   <th className="p-3 text-center">Menu Permission</th>
//                   <th className="p-3 text-left">Menu Name</th>
//                   <th className="p-3 text-center">SubMenu Permission</th>
//                   <th className="p-3 text-left">Sub Menus</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {menuAndSubMenuPermission.map((menu, index) => (
//                   <tr
//                     key={menu.SNo}
//                     className={`transition hover:bg-indigo-50 ${
//                       index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                     }`}
//                   >
//                     <td className="p-3 text-sm text-center text-gray-700">
//                       {index + 1}
//                     </td>
//                     <td className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={menu.HasMenuPermission === 1}
//                         onChange={() => handleMenuPermissionToggle(menu.menuId)}
//                         className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-400"
//                       />
//                     </td>
//                     <td className="p-3 font-medium text-gray-800">
//                       {menu.menuName}
//                     </td>
//                     <td className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={menu.HasSubMenuPermission === 1}
//                         className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
//                       />
//                     </td>
//                     <td className="p-3 text-gray-600">{menu.subMenuName}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllAdminListbyPermission,
//   MenusmenuAndSubMenuPermisiom,
//   addPermission,
// } from "@/app/redux/menuSlice";

// export default function MenuPermission() {
//   const dispatch = useDispatch();
//   const { fetchAdminList, menuAndSubMenuPermission, loading } = useSelector(
//     (state) => state.menu
//   );
//   const [selectedAdmin, setSelectedAdmin] = useState("");
//   const [permissions, setPermissions] = useState([]);

//   // Fetch admin list on mount
//   useEffect(() => {
//     dispatch(getAllAdminListbyPermission());
//   }, [dispatch]);

//   // Fetch permissions for selected admin
//   const handleChange = (e) => {
//     const adminId = e.target.value;
//     setSelectedAdmin(adminId);
//     if (adminId) {
//       dispatch(MenusmenuAndSubMenuPermisiom(adminId));
//     } else {
//       setPermissions([]);
//     }
//   };

//   // Update local state when API data comes
//   useEffect(() => {
//     if (menuAndSubMenuPermission?.length > 0) {
//       setPermissions(menuAndSubMenuPermission);
//     }
//   }, [menuAndSubMenuPermission]);

//   // Toggle local permission state
//   const handlePermissionChange = (id, type) => {
//     setPermissions((prev) =>
//       prev.map((menu) => {
//         if ((type === "menu" && menu.menuId === id) || (type === "submenu" && menu.subMenuId === id)) {
//           if (type === "menu") {
//             return { ...menu, HasMenuPermission: menu.HasMenuPermission === 1 ? 0 : 1 };
//           } else {
//             return { ...menu, HasSubMenuPermission: menu.HasSubMenuPermission === 1 ? 0 : 1 };
//           }
//         }
//         return menu;
//       })
//     );
//   };

//   // ✅ Save all permissions at once
//   const handleSavePermissions = () => {
//     if (!selectedAdmin) return alert("Please select an admin");

//     // Prepare API request body for each row
//     permissions.forEach((menu) => {
//       const requestBody = {
//         menuId: menu.menuId,
//         menuName: menu.menuName,
//         displayOrder: menu.MenuDisplayOrder || 0,
//         createdBy: selectedAdmin,
//         menuIcon: menu.menuIcon,
//         pageName: menu.menuPageName,
//         subMenuId: menu.subMenuId,
//         subMenuName: menu.subMenuName,
//         subMenuPageName: menu.subMenuPageName,
//         displayOrderSubMenu: menu.subMenuDisplayOrder || 0,
//         appRoleId: selectedAdmin,
//         active: menu.HasMenuPermission === 1 || menu.HasSubMenuPermission === 1,
//       };

//       dispatch(addPermission(requestBody)); 
//       console.log("testt-->",requestBody);
//     });

//     alert("Permissions saved successfully!");
//   };

//   return (
//     <div className="p-2">
//       <div className="max-w-6xl p-6 mx-auto bg-white shadow-lg rounded-2xl">
//         <h1 className="pb-3 mb-6 text-2xl font-bold text-gray-800 border-b">
//           🔑 Menu Permission
//         </h1>

//         {/* Admin Dropdown */}
//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : (
//           <div className="mb-6">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Select Admin
//             </label>
//             <select
//               value={selectedAdmin}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg shadow-sm w-72 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             >
//               <option value="">-- Select Admin --</option>
//               {fetchAdminList?.map((admin) => (
//                 <option key={admin.adminUserId} value={admin.adminUserId}>
//                   {admin.username}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Permission Table */}
//         {permissions?.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-200 rounded-lg shadow-sm">
//               <thead>
//                 <tr className="text-white bg-gradient-to-r from-indigo-500 to-purple-500">
//                   <th className="p-3 text-left">#</th>
//                   <th className="p-3 text-center">Menu Permission</th>
//                   <th className="p-3 text-left">Menu Name</th>
//                   <th className="p-3 text-center">SubMenu Permission</th>
//                   <th className="p-3 text-left">Sub Menus</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {permissions.map((menu, index) => (
//                   <tr
//                     key={menu.SNo || index}
//                     className={`transition hover:bg-indigo-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
//                   >
//                     <td className="p-3 text-sm text-center text-gray-700">{index + 1}</td>

//                     <td className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={menu.HasMenuPermission === 1}
//                         onChange={() => handlePermissionChange(menu.menuId, "menu")}
//                         className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-400"
//                       />
//                     </td>

//                     <td className="p-3 font-medium text-gray-800">{menu.menuName}</td>

//                     <td className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={menu.HasSubMenuPermission === 1}
//                         onChange={() => handlePermissionChange(menu.subMenuId, "submenu")}
//                         className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
//                       />
//                     </td>

//                     <td className="p-3 text-gray-600">{menu.subMenuName}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Save Permissions Button */}
//             <div className="mt-6 text-right">
//               <button
//                 onClick={handleSavePermissions}
//                 className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
//               >
//                 Save Permissions
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllAdminListbyPermission,
//   MenusmenuAndSubMenuPermisiom,
//   addPermission,
// } from "@/app/redux/menuSlice";

// export default function MenuPermission() {
//   const dispatch = useDispatch();
//   const { fetchAdminList, menuAndSubMenuPermission, loading } = useSelector(
//     (state) => state.menu
//   );
//   const [selectedAdmin, setSelectedAdmin] = useState("");
//   const [permissions, setPermissions] = useState([]);

//   // Fetch admin list on mount
//   useEffect(() => {
//     dispatch(getAllAdminListbyPermission());
//   }, [dispatch]);

//   // Fetch permissions for selected admin
//   const handleChange = (e) => {
//     const adminId = e.target.value;
//     setSelectedAdmin(adminId);
//     if (adminId) {
//       dispatch(MenusmenuAndSubMenuPermisiom(adminId));
//     } else {
//       setPermissions([]);
//     }
//   };

//   // Update local state when API data comes
//   useEffect(() => {
//     if (menuAndSubMenuPermission?.length > 0) {
//       setPermissions(menuAndSubMenuPermission);
//     } else {
//       setPermissions([]);
//     }
//   }, [menuAndSubMenuPermission]);

//   // Toggle local permission state
// //   const handlePermissionChange = (menuId, subMenuId = null) => {
// //   setPermissions((prev) =>
// //     prev.map((menu) => {
// //       // Ensure required fields exist
// //       const updatedMenu = {
// //         ...menu,
// //         menuName: menu.menuName || "Unknown Menu",
// //         menuIcon: menu.menuIcon || "default-icon",
// //         menuPageName: menu.pageName || "default-page",
// //         subMenuName: menu.subMenuName || (menu.subMenuId ? "Unknown Submenu" : null),
// //         subMenuPageName: menu.subMenuPageName || (menu.subMenuId ? "default-subpage" : null),
// //       };

// //       if (subMenuId === null && menu.menuId === menuId) {
// //         updatedMenu.HasMenuPermission = menu.HasMenuPermission === 1 ? 0 : 1;
// //       } else if (subMenuId !== null && menu.menuId === menuId && menu.subMenuId === subMenuId) {
// //         updatedMenu.HasSubMenuPermission = menu.HasSubMenuPermission === 1 ? 0 : 1;
// //       }
// //       return updatedMenu;
// //     })
// //   );
// // };
// const handlePermissionChange = (menuId, subMenuId = null) => {
//   setPermissions((prev) =>
//     prev.map((menu) => {
//       if (menu.menuId === menuId) {
//         // Agar menu checkbox toggle ho raha hai
//         if (subMenuId === null) {
//           return {
//             ...menu,
//             HasMenuPermission: menu.HasMenuPermission === 1 ? 0 : 1,
//           };
//         }

//         // Agar submenu checkbox toggle ho raha hai
//         return {
//           ...menu,
//           subMenus: menu.subMenus.map((sub) =>
//             sub.subMenuId === subMenuId
//               ? {
//                   ...sub,
//                   HasSubMenuPermission:
//                     sub.HasSubMenuPermission === 1 ? 0 : 1,
//                 }
//               : sub
//           ),
//         };
//       }
//       return menu;
//     })
//   );
// };



// // const handleSavePermissions = () => {
// //   if (!selectedAdmin) return alert("Please select an admin");

// //   // Filter only checked menus or submenus
// //   const checkedPermissions = permissions.filter(
// //     (item) => item.HasMenuPermission === 1 || item.HasSubMenuPermission === 1
// //   );

// //   if (checkedPermissions.length === 0) {
// //     return alert("No permissions selected.");
// //   }

// //   // Group by menuId
// //   const groupedMenus = checkedPermissions.reduce((acc, curr) => {
// //     if (!acc[curr.menuId]) acc[curr.menuId] = { ...curr, subMenus: [] };
    
// //     if (curr.subMenuId) {
// //       acc[curr.menuId].subMenus.push({
// //         subMenuId: curr.subMenuId,
// //         subMenuName: curr.subMenuName || "",
// //         subMenuPageName: curr.subMenuPageName || "",
// //         displayOrderSubMenu: curr.subMenuDisplayOrder || 0,
// //         active: curr.HasSubMenuPermission === 1,
// //       });
// //     } else {
// //       acc[curr.menuId].active = curr.HasMenuPermission === 1;
// //     }

// //     return acc;
// //   }, {});

// //   // Convert grouped object to array for payload
// //   const requestBody = Object.values(groupedMenus).map((menu) => ({
// //     menuId: menu.menuId,
// //     menuName: menu.menuName || "",
// //     menuIcon: menu.menuIcon || "",
// //     menuPageName: menu.pageName || "default-page",
// //     displayOrder: menu.MenuDisplayOrder || 0,
// //     createdBy: selectedAdmin, 
// //     appRoleId: selectedAdmin,
// //     active: menu.active || false,
// //     subMenus: menu.subMenus, 
// //   }));

// //   console.log("Final Payload --->", requestBody);

// //   // Dispatch API call
// //   dispatch(addPermission({ permissions: requestBody }));
// //   alert("Permissions saved successfully!");
// // };

// const handleSavePermissions = () => {
//   if (!selectedAdmin) return alert("Please select an admin");

//   const requestBody = [];

//   permissions.forEach((menu) => {
//     // --- Menu Level Permission ---
//     requestBody.push({
//       menuId: menu.menuId,
//       menuName: menu.menuName || "",
//       displayOrder: menu.menuDisplayOrder || 0,
//       createdBy: selectedAdmin,
//       menuIcon: menu.menuIcon || "",
//       pageName: menu.pageName || "default-page",
//       subMenuId: null, 
//       subMenuName: null,
//       subMenuPageName: null,
//       displayOrderSubMenu: menu.displayOrder,
//       appRoleId: selectedAdmin,
//       activeSubmenu: false,
//       activemenu: menu.HasMenuPermission === 1, // true/false
//     });

//     // --- SubMenu Level Permission ---
//     menu.subMenus?.forEach((sub) => {
//       requestBody.push({
//         menuId: menu.menuId,
//         menuName: menu.menuName || "",
//         displayOrder: menu.menuDisplayOrder || 0,
//         createdBy: selectedAdmin,
//         menuIcon: menu.menuIcon || "",
//         pageName: menu.pageName || "default-page",
//         subMenuId: sub.subMenuId,
//         subMenuName: sub.subMenuName || "",
//         subMenuPageName: sub.subMenuPageName || "default-subpage",
//         displayOrderSubMenu: sub.displayOrder || 0,
//         appRoleId: selectedAdmin,
//         activeSubmenu: sub.HasSubMenuPermission === 1, 
//         activemenu: menu.HasMenuPermission === 1, 
//       });
//     });
//   });

//   console.log("🚀 Final Payload --->", requestBody);

//   // API call
//   dispatch(addPermission({ permissions: requestBody }));
//   alert("Permissions saved successfully!");
// };




//   return (
//     <div className="p-2">
//       <div className="max-w-6xl p-6 mx-auto bg-white shadow-lg rounded-2xl">
//         <h1 className="pb-3 mb-6 text-2xl font-bold text-gray-800 border-b">
//           🔑 Menu Permission
//         </h1>

//         {/* Admin Dropdown */}
//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : (
//           <div className="mb-6">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Select Admin
//             </label>
//             <select
//               value={selectedAdmin}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg shadow-sm w-72 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             >
//               <option value="">-- Select Admin --</option>
//               {fetchAdminList?.map((admin) => (
//                 <option key={admin.adminUserId} value={admin.adminUserId}>
//                   {admin.username}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Permission Table */}
//         {permissions?.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-200 rounded-lg shadow-sm">
//               <thead>
//                 <tr className="text-white bg-gradient-to-r from-indigo-500 to-purple-500">
//                   <th className="p-3 text-left">#</th>
//                   <th className="p-3 text-center">Menu Permission</th>
//                   <th className="p-3 text-left">Menu Name</th>
//                   <th className="p-3 text-center">SubMenu Permission</th>
//                   <th className="p-3 text-left">Sub Menus</th>
//                 </tr>
//               </thead>
//               {/* <tbody>
//                 {permissions.map((menu, index) => (
//                   <tr
//                     key={menu.SNo || index}
//                     className={`transition hover:bg-indigo-50 ${
//                       index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                     }`}
//                   >
//                     <td className="p-3 text-sm text-center text-gray-700">
//                       {index + 1}
//                     </td>

//                     <td className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={menu.HasMenuPermission === 1}
//                         onChange={() => handlePermissionChange(menu.menuId)}
//                         className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-400"
//                       />
//                     </td>

//                     <td className="p-3 font-medium text-gray-800">
//                       {menu.menuName}
//                     </td>

//                     <td className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={menu.HasSubMenuPermission === 1}
//                         onChange={() =>
//                           handlePermissionChange(menu.menuId, menu.subMenuId)
//                         }
//                         className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
//                       />
//                     </td>

//                     <td className="p-3 text-gray-600">{menu.subMenuName}</td>
//                   </tr>
//                 ))}
//               </tbody> */}
//           <tbody>
//   {permissions.map((menu, menuIndex) => (
//     <React.Fragment key={menu.menuId}>
//       {/* Menu Row */}
//       <tr
//         className={`transition hover:bg-indigo-50 ${
//           menuIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
//         }`}
//       >
//         <td className="p-3 text-sm text-center text-gray-700">
//           {menuIndex + 1}
//         </td>

//         <td className="p-3 text-center">
//   <input
//     type="checkbox"
//     checked={menu.HasMenuPermission === 1}
//     onChange={() => handlePermissionChange(menu.menuId)}
//     className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-400"
//   />
// </td>


//         <td className="p-3 font-medium text-gray-800">{menu.menuName}</td>

//         {/* SubMenu columns ke liye -- mat dikhana */}
//         <td className="p-3 text-center"></td>
//         <td className="p-3 text-gray-600"></td>
//       </tr>

//       {/* SubMenus Rows */}
//       {menu.subMenus?.map((sub) => (
//         <tr key={sub.subMenuId} className="bg-gray-50 hover:bg-indigo-50">
//           {/* Submenu row me number mat dikhana */}
//           <td className="p-3 text-sm text-center text-gray-700"></td>

//           <td className="p-3 text-center"></td>

//           <td className="p-3"></td>

//           <td className="p-3 text-center">
//   <input
//     type="checkbox"
//     checked={sub.HasSubMenuPermission === 1}
//     onChange={() =>
//       handlePermissionChange(menu.menuId, sub.subMenuId)
//     }
//     className="w-5 h-5 text-purple-600 rounded focus:ring-purple-400"
//   />
// </td>


//           <td className="p-3 text-gray-600">{sub.subMenuName}</td>
//         </tr>
//       ))}
//     </React.Fragment>
//   ))}
// </tbody>


//             </table>

//             {/* Save Permissions Button */}
//             <div className="mt-6 text-right">
//               <button
//                 onClick={handleSavePermissions}
//                 className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
//               >
//                 Save Permissions
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
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

  // Toggle permission state
  const handlePermissionChange = (menuId, subMenuId = null) => {
    setPermissions((prev) =>
      prev.map((menu) => {
        if (menu.menuId === menuId) {
          if (subMenuId === null) {
            // Toggle menu permission
            return {
              ...menu,
              hasMenuPermission: !menu.hasMenuPermission,
            };
          } else {
            // Toggle submenu permission
            const updatedSubMenus = menu.subMenus.map((sub) =>
              sub.subMenuId === subMenuId
                ? {
                    ...sub,
                    hasSubMenuPermission: !sub.hasSubMenuPermission,
                  }
                : sub
            );
            return {
              ...menu,
              subMenus: updatedSubMenus,
            };
          }
        }
        return menu;
      })
    );
  };

 



// const handleSavePermissions = async () => {
//   if (!selectedAdmin) {
//     toast.warning("⚠️ Please select an admin first");
//     return;
//   }

//   setSaving(true);

//   try {
//     const promises = permissions.map(async (menu) => {
//       const requestBody = {
//         appRoleId: selectedAdmin,
//         menuId: menu.menuId,
//         menuName: menu.menuName,
//         pageName: menu.menuPageName,
//         displayOrder: menu.menuDisplayOrder,
//         createdBy: selectedAdmin,
//         menuIcon: menu.menuIcon,
//         activemenu: menu.hasMenuPermission,
//         subMenuList:
//           menu.subMenus?.map((sub) => ({
//             subMenuId: sub.subMenuId,
//             subMenuName: sub.subMenuName,
//             subMenuPageName: sub.subMenuPageName,
//             displayOrderSubMenu: sub.displayOrder,
//             activeSubmenu: sub.hasSubMenuPermission,
//           })) || [],
//       };

//       const response = await dispatch(addPermission(requestBody)).unwrap();

//       // ✅ यहाँ statusCode check करें
//       if (response?.statusCode === 200) {
//         toast.success("Insert successfully!");
//       } else if (response?.statusCode === 417) {
//         toast.error(" Please select/insert parent menu first for the submenu.");
//       } else {
//         toast.error("❌ Failed to insert permission.");
//       }

//       return response;
//     });

//     await Promise.all(promises);
//   } catch (error) {
//     console.error("❌ Failed to save permissions:", error);
//     toast.error("Some permissions could not be saved. Please try again.");
//   } finally {
//     setSaving(false);
//   }
// };

const handleSavePermissions = async () => {
  if (!selectedAdmin) {
    toast.warning("⚠️ Please select an admin first");
    return;
  }

  setSaving(true);

  try {
    // सभी API calls एक साथ
    const apiCalls = permissions.map(menu => 
      dispatch(addPermission({
        appRoleId: selectedAdmin,
        menuId: menu.menuId,
        menuName: menu.menuName,
        pageName: menu.menuPageName,
        displayOrder: menu.menuDisplayOrder,
        createdBy: selectedAdmin,
        menuIcon: menu.menuIcon,
        activemenu: menu.hasMenuPermission,
        subMenuList: menu.subMenus?.map(sub => ({
          subMenuId: sub.subMenuId,
          subMenuName: sub.subMenuName,
          subMenuPageName: sub.subMenuPageName,
          displayOrderSubMenu: sub.displayOrder,
          activeSubmenu: sub.hasSubMenuPermission,
        })) || [],
      })).unwrap()
    );

    await Promise.all(apiCalls);
    toast.success("All Menu and SubMenu Permissions saved successfully!");
    
  } catch (error) {
    console.error("❌ Failed to save permissions:", error);
    toast.error("Failed to save permissions. Please try again.");
  } finally {
    setSaving(false);
  }
};

// const handleSavePermissions = async () => {
//   if (!selectedAdmin) {
//     alert("Please select an admin");
//     return;
//   }

//   setSaving(true);

//   try {
//     const requestBody = {
//       appRoleId: selectedAdmin,
//       createdBy: selectedAdmin,
//       menuPermissions: permissions.map((menu) => ({
//         menuId: menu.menuId,
//         menuName: menu.menuName,
//         pageName: menu.menuPageName,
//         displayOrder: menu.menuDisplayOrder,
//         menuIcon: menu.menuIcon,
//         activemenu: menu.hasMenuPermission,
//         subMenuList: menu.subMenus?.map((sub) => ({
//           subMenuId: sub.subMenuId,
//           subMenuName: sub.subMenuName,
//           subMenuPageName: sub.subMenuPageName,
//           displayOrderSubMenu: sub.displayOrder,
//           activeSubmenu: sub.hasSubMenuPermission
//         })) || []
//       }))
//     };

//     // सिर्फ एक API call
//     await dispatch(addPermission(requestBody)).unwrap();
//     alert("All permissions saved successfully!");
    
//   } catch (error) {
//     console.error("❌ Failed to save permissions:", error);
//     alert("Failed to save permissions. Please try again.");
//   } finally {
//     setSaving(false);
//   }
// };

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