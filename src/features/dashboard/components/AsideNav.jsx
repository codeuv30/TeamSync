import {
  ClipboardList,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import NavigationTab from "./NavigationTab";
import { AdminNavigation, EmployeeNavigation } from "../../../app/constants/navigations";

const AsideNav = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dark = theme === "dark";

  const employee = useSelector(state => state.auth.employee);

  const NAV_ITEMS = employee.role === "admin" ? [...AdminNavigation] : [...EmployeeNavigation];

  return (
    <aside
      className="h-full w-full font-mono pt-4 border-r border-gray-500/70"
      style={{ background: dark ? "#16131e" : "#ffffff" }}
    >
      <div className="h-[10.5%] w-full pl-4 border-b border-gray-500/70">
        <h1 className="text-3xl font-semibold text-[var(--primary)]">
          TeamSync
        </h1>
        <p
          className="opacity-80"
          style={{ color: dark ? "#e5e7eb" : "#4b5563" }}
        >
          Enterprise Workspace
        </p>
      </div>

      <div className="h-full w-full pt-3">
        <div className="h-full w-full flex flex-col items-start">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavigationTab path={to} title={label} Icon={Icon} dark={dark} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AsideNav;