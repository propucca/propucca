"use client";
import React, { useState, useContext, useEffect } from "react";
import RespNavBar from "@/components/navbar";
import SideMenus from "@/components/sidemenus";
import { UserDataContext } from "@/utils/contexts";
import { CONFIG } from "@/config";
import { MENU_ITEMS } from "@/config/menu";
import { filterMenuByPermissions } from "@/utils/rbac";
import { IMenuItem } from "@/types/rbac";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  const [isOpen, setOpen] = useState(true);
  const [menu, setMenu] = useState<IMenuItem[]>([]);

  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    if (userData && userData.permissions && userData.permissions.role) {
      // Filter menu items based on user permissions
      let filteredMenu = filterMenuByPermissions(
        MENU_ITEMS,
        userData.permissions,
      );

      // Apply config-based feature disabling
      filteredMenu = filteredMenu
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter(
            (subItem) => !CONFIG.DISABLED_FEATURES.includes(subItem.title),
          ),
        }))
        .filter(
          (item) =>
            // Keep items that have no subItems (direct links) or have at least one enabled subItem
            !item.subItems || item.subItems.length > 0,
        );

      setMenu(filteredMenu);
    } else {
      // No permissions loaded yet, show empty menu
      setMenu([]);
    }
  }, [userData, userData?.permissions]);

  return (
    <div>
      <RespNavBar setOpen={setOpen} isOpen={isOpen} />
      <div className="flex">
        <div className="mt-5  hidden sm:flex">
          <SideMenus menuItems={menu} isOpen={isOpen} />
        </div>
        <div className="p-5 w-full">{children}</div>
      </div>
    </div>
  );
}
