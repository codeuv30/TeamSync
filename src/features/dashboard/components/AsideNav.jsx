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

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", Icon: ClipboardList },
  { to: "/team", label: "Team", Icon: Users },
  { to: "/chat", label: "Chat", Icon: MessageSquareText },
  { to: "/settings", label: "Settings", Icon: Settings },
];

const AsideNav = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dark = theme === "dark";

  return (
    <aside
      className="h-full w-full font-mono pt-4"
      style={{ background: dark ? "#16131e" : "#ffffff" }}
    >
      <div className="h-[15%] w-full pl-4">
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

      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col items-start">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "w-full flex justify-start items-center space-x-2.5 py-2 pl-4 transition-colors"
              }
              style={({ isActive }) => ({
                opacity: isActive ? 1 : 0.8,
                background: isActive
                  ? dark
                    ? "#241d31"
                    : "#f3eefc"
                  : "transparent",
                borderRight: isActive
                  ? `3px solid ${dark ? "#76629d" : "#9b7bd4"}`
                  : "3px solid transparent",
                color: isActive
                  ? dark
                    ? "#ccb2ff"
                    : "#6d28d9"
                  : dark
                  ? "#f3f4f6"
                  : "#1f2937",
              })}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.background = dark ? "#241d31" : "#f3eefc";
                e.currentTarget.style.borderRight = `3px solid ${
                  dark ? "#76629d" : "#9b7bd4"
                }`;
                e.currentTarget.style.color = dark ? "#ccb2ff" : "#6d28d9";
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                if (isActive) return;
                e.currentTarget.style.opacity = "0.8";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderRight = "3px solid transparent";
                e.currentTarget.style.color = dark ? "#f3f4f6" : "#1f2937";
              }}
            >
              <Icon size={22} />
              <h3>{label}</h3>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AsideNav;