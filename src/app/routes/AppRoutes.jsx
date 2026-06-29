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
import { commanRoutes } from "./CommonRoutes";
import { employeeRoutes } from "./EmployeeRoutes";
import { adminRoutes } from "./AdminRoutes";
import RoleBasedRoute from "../../app/protectedRoutes/RoleBasedRoute";

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
            ...commanRoutes,
            {
              element: <RoleBasedRoute allowedRoles={"admin"} />,
              children: adminRoutes,
            },
            {
              element: <RoleBasedRoute allowedRoles={["admin", "employee"]} />,
              children: employeeRoutes,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRoutes;
