import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/reducer/authReducer";
import {
  useUserLogoutMutation,
  useUseGetInfoUserQuery,
} from "../../store/service/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

const AdminHome = ({ children, loadGetPro }) => {
  const location = useLocation();
  const isProducts = location.pathname.includes("/products");
  const isCoupons = location.pathname.includes("/coupons");
  const isBrands = location.pathname.includes("/brands");
  const isCategory = location.pathname.includes("/category");
  const isOrders = location.pathname.includes("/orders");
  const isBills = location.pathname.includes("/bills");
  const isStatistical = location.pathname.includes("/statistical");
  const isAccount = location.pathname.includes("/account");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [plusIcon, setPlusIcon] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutServer, { isLoading, isError }] = useUserLogoutMutation();
  const { data, isSuccess } = useUseGetInfoUserQuery();
  const role = useSelector((state) => state.authReducer.adminInfo);
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
                  isProducts ? "bg-gray-400 text-white" : ""
                } hover:bg-gray-400 hover:text-white`}
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
                  isCoupons ? "bg-gray-400 text-white" : ""
                } hover:bg-gray-400 hover:text-white`}
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
                  isBrands ? "bg-gray-400 text-white" : ""
                } hover:bg-gray-400 hover:text-white`}
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
                  isCategory ? "bg-gray-400 text-white" : ""
                } hover:bg-gray-400 hover:text-white`}
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
                selectedLiRef.current === "5" ? "bg-gray-400" : ""
              } hover:bg-gray-400 hover:text-white`}
            >
              <Link to="/dashboard/slider" className="text-base capitalize">
                <i className="bi bi-collection-play-fill mr-2 inline-block text-lg text-gray-600"></i>{" "}
                Slider
              </Link>
            </li>
          )} */}
          {/* Order----ổn---- */}
          {allowedRoles.includes(role.role) && (
            <Link to="/dashboard/orders" className="text-base ">
              <li
                className={`px-4 cursor-pointer transition-all capitalize py-3 text-gray-800 flex items-center ${
                  isOrders ? "bg-gray-400 text-white" : ""
                } hover:bg-gray-400 hover:text-white`}
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
                  isBills ? "bg-gray-400 text-white" : ""
                } hover:bg-gray-400 hover:text-white`}
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
                isStatistical ? "bg-gray-400 text-white" : ""
              } hover:bg-gray-400 hover:text-white`}
              onClick={() => {
                setPlusIcon(!plusIcon);
              }}
            >
              {/* <Link to="#" className="text-base capitalize"> */}
              <div className="w-full flex justify-between items-center text-lg">
                <div className="w-full flex flex-row items-center text-base capitalize">
                  <i className="bi bi-bar-chart-line mr-2 inline-block text-lg"></i>{" "}
                  <p>Thống kê</p>
                </div>
                <div>
                  <i className={!plusIcon ? "bi bi-dash" : "bi bi-plus"}></i>
                </div>
              </div>
              {!plusIcon || isStatistical ? (
                <div className="w-full flex flex-col items-start p-2 ">
                  {/* <div className="w-full  rounded-md p-2 text-base  line-clamp-2 text-gray-800 hover:bg-slate-200 hover:text-gray-900">
                  <Link to="/dashboard/statistical">Thống kê sản phẩm</Link>
                </div> */}
                  <div
                    className={`w-full rounded-md p-2 text-base mb-1 line-clamp-2
                   bg-slate-100 text-gray-900`}
                  >
                    <div>
                      <Link to="/dashboard/statistical/line-chart">
                        <i class="bi bi-cash-coin mr-2"></i>
                        Thống kê doanh thu
                      </Link>
                    </div>
                  </div>
                  {/* <div
                    className={`w-full rounded-md p-2 text-base  mb-1 line-clamp-2 text-gray-800
                    ${
                      selectedLiRef.current === "8.2"
                        ? "bg-slate-100 text-gray-900"
                        : ""
                    }
                     hover:bg-slate-100 hover:text-gray-900`}
                    onClick={() => {
                      handleSelect("8.2");
                    }}
                  >
                    <Link to="/dashboard/statistical/line-chart">
                      <i class="bi bi-cash-coin mr-2"></i>
                      Thống kê tài khoản
                    </Link>
                  </div> */}
                  {/* <div className="w-full  rounded-md p-2 text-base  mb-1 line-clamp-2 text-gray-800 hover:bg-slate-100 hover:text-gray-900">
                  <Link to="/dashboard/statistical/product">Thống kê </Link>
                </div> */}
                </div>
              ) : (
                ""
              )}

              {/* </Link> */}
            </li>
          )}
          {role.role === "admin" && (
            <Link to="/dashboard/account" className="text-base capitalize">
              <li
                className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
                  isAccount ? "bg-gray-400 text-white" : ""
                } hover:bg-gray-400 hover:text-white`}
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
