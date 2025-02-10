"use client";

import usePermissions from "@/hooks/usePermissions";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  const allowManageUsers = usePermissions('canManageUsers');

  if (!allowManageUsers) {
    return <div className="flex justify-center items-center h-screen">You are not allowed to view this page</div>;
  }

  return <>{children}</>;
};

export default UsersLayout;
