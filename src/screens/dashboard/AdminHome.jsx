import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/reducer/authReducer";
import {
  useUserLogoutMutation,
  useUseGetInfoUserQuery,
} from "../../store/service/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState } from "react";

const AdminHome = ({ children, loadGetPro }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSelect, setIsSelect] = useState("");
  const [plusIcon, setPlusIcon] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutServer, { isLoading, isError }] = useUserLogoutMutation();
  const { data, isSuccess } = useUseGetInfoUserQuery();
  const role = useSelector((state) => state.authReducer.adminInfo);
  // console.log("role", role);
  const allowedRoles = ["admin", "employee"];

  const adminLogout = async () => {
    try {
      await logoutServer();
      dispatch(logout("admin-token"));
      navigate("/auth/admin-login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-200 z-10 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-white p-4 content-center">
          <div className="p-4 flex flex-col justify-center">
            <Link to="/">
              <img
                src="/image/abc.png"
                alt="logo"
                className="w-full object-cover"
              />
            </Link>
            <div className="flex flex-col justify-center mt-2 text-center">
              <p className="font-semibold text-lg text-gray-600 mr-2">
                {data?.data?.fullName}
              </p>
              <p className="text-sm text-gray-600 text-center capitalize">
                {role?.role === "admin" ? "Quản lý" : "Nhân viên"}
              </p>
            </div>
          </div>
        </div>
        <ul className="mt-0 bg-slate-200">
          {/* Sidebar menu items */}
          {/* manager product  --- insert, list-stock: product sắp hết*/}
          {allowedRoles.includes(role.role) && (
            <Link to="/dashboard/products" className="text-base capitalize">
              <li
                className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
                  isSelect === "1" ? "bg-gray-400" : ""
                } hover:bg-gray-400 hover:text-white`}
                onClick={() => {
                  setIsSelect("1");
                }}
              >
                <i className="bi bi-book mr-2 inline-block text-lg "></i> Quản
                lý sản phẩm
              </li>
            </Link>
          )}
          {/* Coupons-thieu ảnh, thêm/sửa/xóa,...list sp */}
          {allowedRoles.includes(role.role) && (
            <Link to="/dashboard/coupons" className="text-base ">
              <li
                className={`px-4 cursor-pointer transition-all capitalize py-3 text-gray-800 flex items-center ${
                  isSelect === "2" ? "bg-gray-400" : ""
                } hover:bg-gray-400 hover:text-white`}
                onClick={() => {
                  setIsSelect("2");
                }}
              >
                <i className="bi bi-bag-check mr-2 inline-block text-lg"></i>{" "}
                Quản lý khuyến mãi
              </li>
            </Link>
          )}
          {/* Brands----ổn : dư tg-> thêm ảnh, link sp */}
          {role.role === "admin" && (
            <Link to="/dashboard/brands" className="text-base ">
              <li
                className={`px-4 cursor-pointer capitalize transition-all py-3 text-gray-800 flex items-center ${
                  isSelect === 3 ? "bg-gray-400" : ""
                } hover:bg-gray-400 hover:text-white`}
                onClick={() => {
                  setIsSelect("3");
                }}
              >
                <i className="bi bi-buildings mr-2 inline-block text-lg"></i>{" "}
                Quản lý nhà cung cấp
              </li>
            </Link>
          )}
          {/* Category - ổn */}
          {role.role === "admin" && (
            <Link to="/dashboard/category" className="text-base ">
              <li
                className={`px-4 cursor-pointer transition-all capitalize py-3 text-gray-800 flex items-center ${
                  isSelect === 4 ? "bg-gray-400" : ""
                } hover:bg-gray-400 hover:text-white`}
                onClick={() => {
                  setIsSelect("4");
                }}
              >
                <i className="bi bi-collection mr-2 inline-block text-lg "></i>{" "}
                Quản lý danh mục
              </li>
            </Link>
          )}
          {/* SLider: ----chưa có gì------ */}
          {/* {role.role === "admin" && (
            <li
              className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
                isSelect === "5" ? "bg-gray-400" : ""
              } hover:bg-gray-400 hover:text-white`}
              onClick={() => {
                setIsSelect("5");
              }}
            >
              <Link to="/dashboard/slider" className="text-base capitalize">
                <i className="bi bi-collection-play-fill mr-2 inline-block text-lg text-gray-600"></i>{" "}
                Slider
              </Link>
            </li>
          )} */}
          {/* Order----ổn---- */}
          {allowedRoles.includes(role.role) && (
            <Link to="/dashboard/category" className="text-base ">
              <li
                className={`px-4 cursor-pointer transition-all capitalize py-3 text-gray-800 flex items-center ${
                  isSelect === "6" ? "bg-gray-400" : ""
                } hover:bg-gray-400 hover:text-white`}
                onClick={() => {
                  setIsSelect("6");
                }}
              >
                <i className="bi bi-card-list mr-2 inline-block text-lg"></i>{" "}
                Quản lý đơn hàng
              </li>
            </Link>
          )}
          {/* bill */}
          {allowedRoles.includes(role.role) && (
            <Link to="/dashboard/bills" className="text-base ">
              <li
                className={`px-4 cursor-pointer transition-all capitalize py-3 text-gray-800 flex items-center ${
                  isSelect === "7" ? "bg-gray-400" : ""
                } hover:bg-gray-400 hover:text-white`}
                onClick={() => {
                  setIsSelect("7");
                }}
              >
                <i className="bi bi-card-checklist mr-2 inline-block text-lg"></i>{" "}
                Quản lý hóa đơn
              </li>
            </Link>
          )}

          {/* Thống kê-----có doanh thu-order */}
          {role.role === "admin" && (
            <li
              className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center flex-col ${
                isSelect === "8" ? "bg-gray-400" : ""
              } hover:bg-gray-400 hover:text-white`}
              onClick={() => {
                setIsSelect("8");
              }}
            >
              {/* <Link to="#" className="text-base capitalize"> */}
              <div className="w-full flex justify-between items-center text-lg">
                <div className="w-full flex flex-row items-center text-base capitalize">
                  <i className="bi bi-bar-chart-line mr-2 inline-block text-lg"></i>{" "}
                  <p>Thống kê</p>
                </div>
                <div>
                  <i
                    className={!plusIcon ? "bi bi-dash" : "bi bi-plus"}
                    onClick={() => {
                      setPlusIcon(!plusIcon);
                    }}
                  ></i>
                </div>
              </div>
              {plusIcon ? (
                ""
              ) : (
                <div className="w-full flex flex-col items-start p-2 ">
                  {/* <div className="w-full  rounded-md p-2 text-base  line-clamp-2 text-gray-800 hover:bg-slate-200 hover:text-gray-900">
                  <Link to="/dashboard/statistical">Thống kê sản phẩm</Link>
                </div> */}
                  <div className="w-full  rounded-md p-2 text-base  mb-1 line-clamp-2 text-gray-800 hover:bg-slate-100 hover:text-gray-900">
                    <Link to="/dashboard/statistical/line-chart">
                      Thống kê doanh thu
                    </Link>
                  </div>
                  {/* <div className="w-full  rounded-md p-2 text-base  mb-1 line-clamp-2 text-gray-800 hover:bg-slate-100 hover:text-gray-900">
                  <Link to="/dashboard/statistical/product">Thống kê </Link>
                </div> */}
                </div>
              )}

              {/* </Link> */}
            </li>
          )}
          {role.role === "admin" && (
            <Link to="/dashboard/account" className="text-base capitalize">
              <li
                className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
                  isSelect === "9" ? "bg-gray-400" : ""
                } hover:bg-gray-400 hover:text-white`}
                onClick={() => {
                  setIsSelect("9");
                }}
              >
                <i className="bi bi-people-fill mr-2 inline-block text-lg"></i>{" "}
                Quản lý tài khoản
              </li>
            </Link>
          )}
        </ul>
      </div>

      {/* Navigation Bar */}
      <div
        className={`fixed top-0 left-0 transition-transform ${
          isSidebarOpen ? "sm:left-64" : "left-0"
        } right-0 mx-4 p-4 mt-3 bg-slate-300 shadow-md flex justify-between items-center z-20`}
      >
        <button
          className="py-2 px-4 bg-indigo-600 text-white rounded-md capitalize hover:bg-indigo-500 hover:text-black"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i className="bi bi-blockquote-left text-2xl"></i>
        </button>
        <button
          className="py-2 px-4 bg-indigo-600 text-white rounded-md capitalize hover:bg-indigo-500 hover:text-black"
          onClick={adminLogout}
          disabled={loadGetPro}
        >
          <i className="bi bi-power text-2xl"></i>
        </button>
      </div>

      {/* Main Content */}
      <section
        className={`transition-transform ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } bg-gray-50 min-h-screen pt-16 sm:pt-20 px-4`}
      >
        <div className="bg-white text-gray-800 px-4 py-6 max-h-[calc(100vh-8rem)] overflow-y-auto shadow-inner">
          {children}
        </div>
      </section>
    </>
  );
};

export default AdminHome;
