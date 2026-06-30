import React from "react";
import { Outlet } from "react-router";
import ChangeTheme from "../../components/ChangeTheme";
import AsideNav from "../../features/dashboard/components/AsideNav";
import TopNav from "../../features/dashboard/components/TopNav";

const DashboardLayout = () => {
  return (
    <>
      <main className="h-screen grid grid-cols-[1.22fr_5fr] overflow-hidden">
        <div className="h-screen overflow-y-auto">
          <AsideNav />
        </div>
        <div className="flex flex-col h-screen min-h-0">
          <TopNav />
          <div className="w-full flex-1 min-h-0 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <ChangeTheme />
    </>
  );
};

export default DashboardLayout;