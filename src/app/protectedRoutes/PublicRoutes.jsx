import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicRoutes = () => {
  const employee = useSelector((state) => state.auth.employee);
  const isLoading = useSelector((state) => state.auth.isLoading);

  if(isLoading) {
    return <h1>Loading...</h1>
  }

  if (employee) {
    return <Navigate to={"/home"} />;
  }
  return <Outlet />;
};

export default PublicRoutes;
