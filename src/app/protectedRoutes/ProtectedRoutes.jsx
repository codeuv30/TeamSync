import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { SpinnerIcon } from "../../assets/icons";

const ProtectedRoutes = () => {
  const employee = useSelector((state) => state.auth.employee);
  const isLoading = useSelector((state) => state.auth.isLoading);

  
  if(isLoading) {
    return <h1>Loading...</h1>
  }

  if (!employee && !isLoading) {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
