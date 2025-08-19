"use client";

import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React from "react";
import Sidebar from "@/components/AppSidebar";
import { useGetAuthUserQuery } from "@/state/api";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser } = useGetAuthUserQuery();
  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-100">
        <Navbar />
        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <Sidebar userType={authUser?.userRole.toLowerCase()} />
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
