import Settings from "../../features/settings/ui/pages/Settings";
import Chat from "../../features/chats/ui/pages/Chat";
import Home from "../../features/dashboard/ui/pages/Home";

export const commanRoutes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "chat",
    element: <Chat />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
];
