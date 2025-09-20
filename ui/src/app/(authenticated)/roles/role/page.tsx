"use client";

import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input, Textarea } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { postCall } from "@/api_services";
import { ENDPOINTS } from "@/api_config";
import { errorMessage, successMessage } from "@/components/alert";
import {
  Permission,
  IRole,
  PERMISSION_GROUPS,
  DEFAULT_ROLES,
  RoleName,
  IRoleForm,
} from "@/types/rbac";

const RoleManagement: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");
  const isEdit = Boolean(roleId);

  const [roleForm, setRoleForm] = useState<IRoleForm>({
    name: "",
    description: "",
    permissions: [],
  });

  const [selectedPermissions, setSelectedPermissions] = useState<
    Set<Permission>
  >(new Set());

  // Load predefined role template
  const handleLoadTemplate = (templateName: RoleName) => {
    const template = DEFAULT_ROLES[templateName];
    if (template) {
      setRoleForm({
        name: template.name,
        description: template.description,
        permissions: template.permissions,
      });
      setSelectedPermissions(new Set(template.permissions));
    }
  };

  // Handle permission toggle
  const handlePermissionToggle = (permission: Permission) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permission)) {
      newSelected.delete(permission);
    } else {
      newSelected.add(permission);
    }
    setSelectedPermissions(newSelected);
    setRoleForm((prev) => ({
      ...prev,
      permissions: Array.from(newSelected),
    }));
  };

  // Select/Deselect all permissions in a group
  const handleGroupToggle = (
    groupPermissions: { key: Permission; label: string }[],
    allSelected: boolean,
  ) => {
    const newSelected = new Set(selectedPermissions);

    if (allSelected) {
      // Remove all permissions in this group
      groupPermissions.forEach((perm) => newSelected.delete(perm.key));
    } else {
      // Add all permissions in this group
      groupPermissions.forEach((perm) => newSelected.add(perm.key));
    }

    setSelectedPermissions(newSelected);
    setRoleForm((prev) => ({
      ...prev,
      permissions: Array.from(newSelected),
    }));
  };

  // Save role mutation
  const saveRoleMutation = useMutation({
    mutationFn: (data: IRoleForm) => {
      const endpoint = isEdit ? ENDPOINTS.ROLES_UPDATE : ENDPOINTS.ROLES_CREATE;
      return postCall(endpoint, {
        ...data,
        ...(isEdit && { id: roleId }),
      });
    },
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        successMessage(
          isEdit ? "Role updated successfully!" : "Role created successfully!",
        );
        router.push("/roles/roles-list");
      } else {
        errorMessage(resp?.message || "Failed to save role");
      }
    },
    onError: () => {
      errorMessage("Failed to save role");
    },
  });

  // Load existing role for editing
  const loadRoleMutation = useMutation({
    mutationFn: () => postCall(ENDPOINTS.ROLES_GET_BY_ID, { id: roleId }),
    onSuccess: (resp) => {
      if (resp && resp.success === 1 && resp.data) {
        const role = resp.data as IRole;
        setRoleForm({
          name: role.name || "",
          description: role.description || "",
          permissions: role.permissions || [],
        });
        setSelectedPermissions(new Set(role.permissions || []));
      }
    },
  });

  useEffect(() => {
    if (isEdit && roleId) {
      loadRoleMutation.mutate();
    }
  }, [isEdit, roleId]);

  const handleSubmit = () => {
    if (!roleForm.name.trim()) {
      errorMessage("Please fill in all required fields");
      return;
    }

    if (roleForm.permissions.length === 0) {
      errorMessage("Please select at least one permission");
      return;
    }

    saveRoleMutation.mutate(roleForm);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-medium text-2xl text-primary">
          {isEdit ? "Edit Role" : "Create New Role"}
        </h2>
        <Button
          variant="ghost"
          onClick={() => router.push("/roles/roles-list")}
        >
          Back to Roles
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Information */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">Role Information</h3>

            <div className="space-y-4">
              <Input
                label="Role Name"
                placeholder="e.g., manager"
                value={roleForm.name}
                onChange={(e) =>
                  setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                }
                isRequired
              />

              <Textarea
                label="Description"
                placeholder="Describe the role responsibilities..."
                value={roleForm.description}
                onChange={(e) =>
                  setRoleForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          {/* Quick Templates */}
          {!isEdit && (
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-4">Quick Templates</h3>
              <div className="space-y-2">
                {Object.entries(DEFAULT_ROLES).map(([key, role]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleLoadTemplate(key as RoleName)}
                  >
                    {role.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">
              Permissions ({selectedPermissions.size} selected)
            </h3>

            <div className="space-y-6">
              {PERMISSION_GROUPS.map((group) => {
                const groupPermissions = group.permissions;
                const selectedInGroup = groupPermissions.filter((perm) =>
                  selectedPermissions.has(perm.key),
                );
                const allSelected =
                  selectedInGroup.length === groupPermissions.length;
                const someSelected =
                  selectedInGroup.length > 0 &&
                  selectedInGroup.length < groupPermissions.length;

                return (
                  <div key={group.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-lg">{group.name}</h4>
                      <Checkbox
                        isSelected={allSelected}
                        isIndeterminate={someSelected}
                        onValueChange={() =>
                          handleGroupToggle(groupPermissions, allSelected)
                        }
                      >
                        Select All
                      </Checkbox>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupPermissions.map((permission) => (
                        <Checkbox
                          key={permission.key}
                          isSelected={selectedPermissions.has(permission.key)}
                          onValueChange={() =>
                            handlePermissionToggle(permission.key)
                          }
                          className="text-sm"
                        >
                          {permission.label}
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/roles/roles-list")}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          isLoading={saveRoleMutation.isPending}
        >
          {isEdit ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </div>
  );
};

export default RoleManagement;
