import { useDispatch } from "react-redux";
import { logout } from "../../store/reducer/authReducer";
import { useUserLogoutMutation } from "../../store/service/authService";
import { useNavigate } from "react-router-dom";
const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutServer, { isLoading, isError }] = useUserLogoutMutation();
  const adminLogout = async () => {
    try {
      //unwrap() trực tiếp trả về dữ liệu hoặc ném lỗi, thay vì phải kiểm tra trạng thái và dữ liệu từ đối tượng kết quả.
      await logoutServer().unwrap();
      dispatch(logout("admin-token"));
      navigate("/auth/admin-login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="fixed left-0 sm:left-64 top-4 right-0 mx-4">
      <div className="bg-gray-800 w-full flex justify-between sm:justify-end items-center p-4">
        {/* <i className="bi bi-filter-left text-white text-2xl cursor-pointer sm:hidden block" onClick={openSidebar}></i> */}
        <button
          className="py-2 px-4 bg-indigo-600 text-white rounded-md capitalize"
          onClick={() => adminLogout}
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng xuất..." : " Đăng xuất "}
        </button>
      </div>
    </nav>
  );
};
export default Nav;
