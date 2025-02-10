"use client";

import { Button, message, Layout } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import usePermissions from "@/hooks/usePermissions";

const { Header, Content } = Layout;

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const allowManageUsers = usePermissions('canManageUsers');
  const allowModifyOwnBookings = usePermissions('canModifyOwnBookings');
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    message.success("Logged out!");
    router.push("/login");
  };

  return (
    <Layout>
      <Header className="bg-purple-500">
        <div className="flex justify-between items-center">
          <h1 className="text-white">Welcome {user?.email}</h1>
          <div>
            <Link href="/dashboard">
              <Button type="text" className="text-white">
                Dashboard
              </Button>
            </Link>
            {allowModifyOwnBookings && (
              <Link href="/bookings">
                <Button type="text" className="text-white">
                  My Bookings
                </Button>
              </Link>
            )}
            {allowManageUsers && (
              <Link href="/users">
                <Button type="text" className="text-white">
                  Users
                </Button>
              </Link>
            )}
            <Button type="text" className="text-white" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Header>
      <Content className="p-4">
        {children}
      </Content>
    </Layout>
  );
};

export default Dashboard;