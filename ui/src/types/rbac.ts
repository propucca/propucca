// RBAC Types and Interfaces
export type Permission =
  | "dashboard.read"
  | "users.read"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "roles.read"
  | "roles.create"
  | "roles.update"
  | "roles.delete";

export type RoleName = "super_admin" | "admin" | "member";

export interface IRoleForm {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface IRole {
  name: RoleName;
  description: string;
  permissions: Permission[];
}

export interface IUserPermissions {
  role: IRole;
  custom_permissions?: Permission[]; // Additional permissions beyond role
}

export interface IMenuItem {
  id: string;
  title: string;
  route?: string;
  icon?: string;
  permissions: Permission[];
  subItems?: IMenuItem[];
  attrRef?: string;
}

export interface IPermissionGroup {
  name: string;
  permissions: {
    key: Permission;
    label: string;
  }[];
}

// Predefined roles with their permissions
export const DEFAULT_ROLES: Record<
  RoleName,
  Omit<IRole, "id" | "created_on" | "modified_on">
> = {
  super_admin: {
    name: "super_admin",
    description: "Full access to all features and settings",
    permissions: [
      "dashboard.read",
      "users.read",
      "users.create",
      "users.update",
      "users.delete",
      "roles.read",
      "roles.create",
      "roles.update",
      "roles.delete",
    ],
  },
  admin: {
    name: "admin",
    description: "Access to most features except user management",
    permissions: [
      "dashboard.read",
      "users.read",
      "users.create",
      "users.update",
      "roles.read",
      "roles.create",
      "roles.update",
    ],
  },
  member: {
    name: "member",
    description: "Read-only access to most features",
    permissions: ["dashboard.read"],
  },
};

// Permission groups for UI organization
export const PERMISSION_GROUPS: IPermissionGroup[] = [
  {
    name: "Dashboard",
    permissions: [{ key: "dashboard.read", label: "View Dashboard" }],
  },
  {
    name: "Administration",
    permissions: [
      { key: "users.read", label: "View users" },
      { key: "users.create", label: "Create users" },
      { key: "users.update", label: "Update users" },
      { key: "users.delete", label: "Delete users" },
    ],
  },
  {
    name: "Roles & Permissions",
    permissions: [
      { key: "roles.read", label: "View Roles" },
      { key: "roles.create", label: "Create Roles" },
      { key: "roles.update", label: "Update Roles" },
      { key: "roles.delete", label: "Delete Roles" },
    ],
  },
];
