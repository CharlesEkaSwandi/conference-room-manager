"use client";

import usePermissions from "@/hooks/usePermissions";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const allowViewRooms = usePermissions('canViewRooms');

  if (!allowViewRooms) {
    return <div className="flex justify-center items-center h-screen">You are not allowed to view this page</div>;
  }

  return <>{children}</>;
};

export default DashboardLayout;
