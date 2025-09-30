'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSidebarMenu,
  setSelectedPage,
  fetchMenuIcons,
} from '@/app/redux/sidebarSlice'
import { FaAngleDown, FaAngleUp, FaBars, FaTimes } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Loading from '@/app/common/loading'
import * as LucideIcons from 'lucide-react'
import {
  selectMenuItems,
  selectIcons,
  selectLoading,
  selectError,
} from './sidebar-selectors'
import Cookies from 'js-cookie'


const Sidebar = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const sidebarRef = useRef(null)

  const menuItems = useSelector(selectMenuItems)
  const icons = useSelector(selectIcons)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)

  const [openMenuId, setOpenMenuId] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [activeSubMenuId, setActiveSubMenuId] = useState(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
  const adminUserId = Cookies.get('adminUserId');
  if (!adminUserId) return;

  const storedIcons = sessionStorage.getItem(`icons_${adminUserId}`);
  if (storedIcons) {
    dispatch({
      type: "sidebar/setIconsFromSession",
      payload: JSON.parse(storedIcons),
    });
  } else {
    dispatch(fetchMenuIcons(adminUserId)).then((res) => {
      if (res.payload) {
        sessionStorage.setItem(`icons_${adminUserId}`, JSON.stringify(res.payload));
      }
    });
  }
}, [dispatch, mobileSidebarOpen, Cookies.get('adminUserId')]);



  const toggleSubMenu = (menuId, menuName, hasSubMenu) => {
    if (!hasSubMenu) {
      dispatch(setSelectedPage({ menuId, menuName }))
      router.push(`/pages/Dashboard`)
      setMobileSidebarOpen(false)
    } else {
      setOpenMenuId((prevMenuId) => (prevMenuId === menuId ? null : menuId))
    }
  }

  const handleSubMenuClick = (
    menuId,
    subMenuId,
    subMenuName,
    subMenuPageName,
    pageName
  ) => {
    setActiveSubMenuId(subMenuId)
    setOpenMenuId(menuId)
    router.push(`/pages/${pageName}/${subMenuPageName}`)
    setMobileSidebarOpen(false)
  }

  const menuIconsMap = useMemo(() => {
    const map = {}
    icons.forEach((icon) => {
      map[icon.menuId] = icon.menuIcon
    })
    return map
  }, [icons])

  const getMenuIcon = (menuId) => {
    const IconComponent = LucideIcons[menuIconsMap[menuId]] || LucideIcons.Circle
    return <IconComponent className="w-5 h-5 text-white group-hover:text-black" />
  }

  if (loading) return <Loading />

  return (
    <>
      <div className="fixed z-20 lg:hidden md:top-20 sm:top-20 xs:top-20 left-4">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="bg-white rounded-md mobile-menu-btn"
        >
          {mobileSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      <div
        ref={sidebarRef}
        className={`h-screen p-4 overflow-y-auto new-bg-admin-menu w-64 custom-scrollbar pb-[80px]
  fixed lg:relative left-0 z-40
  transform transition-transform duration-300 ease-in-out
  ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
  lg:translate-x-0`}

      >
        <div
          className="flex items-center justify-between p-2 text-white rounded cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span>Menu</span>
          {isMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
        </div>
        {isMenuOpen && (
          <div className="mt-4">
            {!loading &&
              !error &&
              icons.map((item) => {
                const isOpen = openMenuId === item.menuId
                return (
                  <div className="mt-2" key={item.menuId}>
                    <div
                      className="flex items-center justify-between p-2 font-semibold text-white rounded-md cursor-pointer group hover:bg-white"
                      onClick={() =>
                        toggleSubMenu(
                          item.menuId,
                          item.menuName,
                          item.subMenus?.length > 0
                        )
                      }
                    >
                      <span className="flex items-center gap-3 text-white menu-text group-hover:text-black">
                        {getMenuIcon(item.menuId)}
                        {item.menuName}
                      </span>
                      {item.subMenus?.length > 0 &&
                        (isOpen ? <FaAngleUp className="group-hover:fill-black" /> : <FaAngleDown className="group-hover:fill-black" />)}
                    </div>

                    {item.subMenus?.length > 0 && isOpen && (
                      <ul className="pl-4 space-y-2 ms-5 admint-submenu-ul">
                        {item.subMenus.map((sub) => (
                          <li
                            key={sub.subMenuId}
                            className={`radius-sm text-sm cursor-pointer font-normal hover:bg-white need-to-padding hover:text-black ${activeSubMenuId === sub.subMenuId
                              ? 'bg-gray-600 text-gray-100'
                              : 'text-white'
                              }`}
                            onClick={() =>
                              handleSubMenuClick(
                                item.menuId,
                                sub.subMenuId,
                                sub.subMenuName,
                                sub.subMenuPageName,
                                item.pageName
                              )
                            }
                          >
                            {sub.subMenuName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}

          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar

