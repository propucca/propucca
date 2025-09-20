import { IMenuItem } from "@/types/rbac";

export const MENU_ITEMS: IMenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    route: "/home",
    permissions: ["dashboard.read"],
  },
  {
    id: "administration",
    title: "Administration",
    permissions: ["users.read"],
    subItems: [
      {
        id: "users",
        title: "users",
        route: "/users/users-list",
        permissions: ["users.read"],
      },
      {
        id: "roles",
        title: "Roles",
        route: "/roles/roles-list",
        permissions: ["roles.read"],
      },
    ],
  },
];
