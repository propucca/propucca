import { useContext } from "react";
import { UserDataContext } from "@/utils/contexts";
import { usePermissions } from "@/utils/rbac";

/**
 * Custom hook to access RBAC functionality
 */
export const useRBAC = () => {
  const { userData } = useContext(UserDataContext);
  const permissions = usePermissions(userData?.permissions || null);

  return {
    userData,
    userPermissions: userData?.permissions || null,
    ...permissions,
  };
};

export default useRBAC;
