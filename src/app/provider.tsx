"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "../hooks/useAuth";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/") {
      router.push("/");
    }
  }, [user, router, pathname, loading]);

  return (
    <>
      {children}
    </>
  );
}

export default Provider;
