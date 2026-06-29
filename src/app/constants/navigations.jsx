import { Building2, CircleUserRound, ClipboardList, LayoutDashboard, MessageSquareText, PersonStanding, Presentation, ScrollText, Settings, UsersRound } from "lucide-react";

export const EmployeeNavigation = [
  { to: "/home", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/home/myTask", label: "Tasks", Icon: ClipboardList },
  { to: "/home/chat", label: "Chats", Icon: MessageSquareText },
  { to: "/home/attendance", label: "Attendance", Icon: Presentation },
  { to: "/home/profile", label: "Profile", Icon: CircleUserRound },
  { to: "/home/settings", label: "Settings", Icon: Settings },
];

export const AdminNavigation = [
  { to: "/home", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/home/task", label: "Tasks", Icon: ClipboardList },
  { to: "/home/chat", label: "Chats", Icon: MessageSquareText },
  { to: "/home/employee", label: "Employees", Icon: UsersRound },
  { to: "/home/document", label: "Documents", Icon: ScrollText },
  { to: "/home/department", label: "Departments", Icon: Building2 },
  { to: "/home/settings", label: "Settings", Icon: Settings },
];