import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const UserRoute = () => {
  const { userToken } = useSelector((state) => state.authReducer);
  return userToken ? <Outlet /> : <Navigate to="/user/login" />;
};
export default UserRoute;
