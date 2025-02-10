import { useAuth } from "./useAuth";

const PERMISSIONS = {
  user: {
    canViewRooms: true,
    canBookRooms: true,
    canModifyOwnBookings: true,
  },
  admin: {
    canViewRooms: true,
    canBookRooms: true,
    canModifyOwnBookings: true,
    canModifyRooms: true,
    canManageUsers: true,
    canViewAnalytics: true,
  },
};

type Role = keyof typeof PERMISSIONS;
type Permission = keyof typeof PERMISSIONS['admin'];
type RolePermissions = Record<Role, Record<Permission, boolean>>

const usePermissions = (action: Permission) => {
  const permissions = PERMISSIONS as RolePermissions;
  const userRole = useAuth().role as Role;
  
  const hasPermission = () => {
    if (!userRole || !permissions[userRole]) {
      return false;
    }
    
    return permissions[userRole][action] || false;
  };

  return hasPermission();
};

export default usePermissions;