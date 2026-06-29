import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Register from "../../features/auth/ui/pages/Register";
import Login from "../../features/auth/ui/pages/Login";
import Home from "../../features/dashboard/ui/pages/Home";
import { useDispatch } from "react-redux";
import { currentLoggedIn } from "../../features/auth/state/auth/authAction";
import PublicRoutes from "../protectedRoutes/PublicRoutes";
import ProtectedRoutes from "../protectedRoutes/ProtectedRoutes";

const AppRoutes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      dispatch(currentLoggedIn());
    })();
  }, []);

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoutes />,
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            {
              path: "",
              element: <Login />,
            },
            {
              path: "/register",
              element: <Register />,
            },
          ],
        },
      ],
    },
    {
      path: "/home",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "",
          element: <DashboardLayout />,
          children: [
            {
              path: "",
              element: <Home />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRoutes;
