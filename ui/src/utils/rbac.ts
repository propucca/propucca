import React from "react";
import { Permission, IUserPermissions, IMenuItem } from "@/types/rbac";

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  userPermissions: IUserPermissions | null,
  permission: Permission,
): boolean => {
  if (!userPermissions) return false;

  // Check role permissions
  const hasRolePermission =
    userPermissions.role.permissions.includes(permission);

  // Check custom permissions (additional permissions beyond role)
  const hasCustomPermission =
    userPermissions.custom_permissions?.includes(permission) || false;

  return hasRolePermission || hasCustomPermission;
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  userPermissions: IUserPermissions | null,
  permissions: Permission[],
): boolean => {
  if (!userPermissions || permissions.length === 0) return false;

  return permissions.some((permission) =>
    hasPermission(userPermissions, permission),
  );
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (
  userPermissions: IUserPermissions | null,
  permissions: Permission[],
): boolean => {
  if (!userPermissions || permissions.length === 0) return false;

  return permissions.every((permission) =>
    hasPermission(userPermissions, permission),
  );
};

/**
 * Filter menu items based on user permissions
 */
export const filterMenuByPermissions = (
  menuItems: IMenuItem[],
  userPermissions: IUserPermissions | null,
): IMenuItem[] => {
  if (!userPermissions) return [];

  const filteredItems: IMenuItem[] = [];

  for (const item of menuItems) {
    // Filter sub-items first
    const filteredSubItems = item.subItems
      ? item.subItems.filter((subItem) =>
          hasAnyPermission(userPermissions, subItem.permissions),
        )
      : undefined;

    // Check if current item has required permissions
    const hasItemPermission = hasAnyPermission(
      userPermissions,
      item.permissions,
    );

    // Include item if it has permission or has valid sub-items
    if (
      hasItemPermission ||
      (filteredSubItems && filteredSubItems.length > 0)
    ) {
      filteredItems.push({
        ...item,
        subItems: filteredSubItems,
      });
    }
  }

  return filteredItems;
};

/**
 * Get all permissions for a user (role + custom permissions)
 */
export const getAllUserPermissions = (
  userPermissions: IUserPermissions | null,
): Permission[] => {
  if (!userPermissions) return [];

  const rolePermissions = userPermissions.role.permissions;
  const customPermissions = userPermissions.custom_permissions || [];

  // Combine and deduplicate permissions
  return Array.from(new Set([...rolePermissions, ...customPermissions]));
};

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (
  userPermissions: IUserPermissions | null,
  routePermissions: Permission[],
): boolean => {
  if (!userPermissions || routePermissions.length === 0) return false;

  return hasAnyPermission(userPermissions, routePermissions);
};

/**
 * Get permission level for a resource (read, create, update, delete)
 */
export const getPermissionLevel = (
  userPermissions: IUserPermissions | null,
  resource: string,
): {
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
} => {
  if (!userPermissions) {
    return {
      canRead: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    };
  }

  return {
    canRead: hasPermission(userPermissions, `${resource}.read` as Permission),
    canCreate: hasPermission(
      userPermissions,
      `${resource}.create` as Permission,
    ),
    canUpdate: hasPermission(
      userPermissions,
      `${resource}.update` as Permission,
    ),
    canDelete: hasPermission(
      userPermissions,
      `${resource}.delete` as Permission,
    ),
  };
};

/**
 * Create a higher-order component for permission-based rendering
 */
export const withPermission = <T extends object>(
  Component: React.ComponentType<T>,
  requiredPermissions: Permission[],
  fallback?: React.ComponentType<T> | null,
) => {
  return (props: T & { userPermissions: IUserPermissions | null }) => {
    const { userPermissions, ...componentProps } = props;

    if (hasAnyPermission(userPermissions, requiredPermissions)) {
      return React.createElement(Component, componentProps as T);
    }

    if (fallback) {
      return React.createElement(fallback, componentProps as T);
    }

    return null;
  };
};

/**
 * Hook for permission checking in components
 */
export const usePermissions = (userPermissions: IUserPermissions | null) => {
  return {
    hasPermission: (permission: Permission) =>
      hasPermission(userPermissions, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(userPermissions, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(userPermissions, permissions),
    canAccessRoute: (routePermissions: Permission[]) =>
      canAccessRoute(userPermissions, routePermissions),
    getPermissionLevel: (resource: string) =>
      getPermissionLevel(userPermissions, resource),
    getAllPermissions: () => getAllUserPermissions(userPermissions),
  };
};
