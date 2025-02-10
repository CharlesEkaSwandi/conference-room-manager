"use client";

import usePermissions from "@/hooks/usePermissions";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  const allowModifyOwnBookings = usePermissions('canModifyOwnBookings');

  if (!allowModifyOwnBookings) {
    return <div className="flex justify-center items-center h-screen">You are not allowed to view this page</div>;
  }

  return <>{children}</>;
};

export default UsersLayout;
