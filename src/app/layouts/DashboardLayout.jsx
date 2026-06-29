import React from "react";
import { Outlet } from "react-router";
import ChangeTheme from "../../components/ChangeTheme";
import AsideNav from "../../features/dashboard/components/AsideNav";
import TopNav from "../../features/dashboard/components/TopNav";

const DashboardLayout = () => {
  return (
    <>
      <main className="h-screen grid grid-cols-[1.22fr_5fr]">
        <div><AsideNav /></div>
        <div className="flex flex-col">
          <TopNav />
          <div className="w-full h-full p-4">
            <Outlet />
          </div>
        </div>
      </main>

      <ChangeTheme />
    </>
  );
};

export default DashboardLayout;
