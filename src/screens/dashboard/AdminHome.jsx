import { useDispatch } from "react-redux";
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
  const [isSelect, setIsSelect] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutServer, { isLoading, isError }] = useUserLogoutMutation();
  const { data, isSuccess } = useUseGetInfoUserQuery();

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
            <img
              src="../image/Hieusach.png"
              alt="logo"
              className="w-full object-cover"
            />
            <div className="flex flex-col justify-center mt-2 text-center">
              <p className="font-semibold text-lg text-gray-600 mr-2">
                {data?.data?.fullName}
              </p>
              <p className="text-sm text-gray-600 text-center">
                {data?.data?.role}
              </p>
            </div>
          </div>
        </div>
        <ul className="mt-0">
          {/* Sidebar menu items */}
          <li
            className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
              isSelect === 1 ? "bg-gray-400" : ""
            } hover:bg-gray-400 hover:text-white`}
            onClick={() => {
              setIsSelect(1);
            }}
          >
            <Link to="/dashboard/products" className="text-base capitalize">
              <i className="bi bi-card-list mr-2 inline-block text-lg text-gray-600"></i>{" "}
              Products
            </Link>
          </li>
          <li
            className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
              isSelect === 2 ? "bg-gray-400" : ""
            } hover:bg-gray-400 hover:text-white`}
            onClick={() => {
              setIsSelect(2);
            }}
          >
            <Link to="/dashboard/coupons" className="text-base capitalize">
              <i className="bi bi-bag-check mr-2 inline-block text-lg text-gray-600"></i>{" "}
              Coupons
            </Link>
          </li>
          <li
            className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
              isSelect === 3 ? "bg-gray-400" : ""
            } hover:bg-gray-400 hover:text-white`}
            onClick={() => {
              setIsSelect(3);
            }}
          >
            <Link to="/dashboard/brands" className="text-base capitalize">
              <i className="bi bi-people-fill mr-2 inline-block text-lg text-gray-600"></i>{" "}
              Brands
            </Link>
          </li>
          <li
            className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
              isSelect === 4 ? "bg-gray-400" : ""
            } hover:bg-gray-400 hover:text-white`}
            onClick={() => {
              setIsSelect(4);
            }}
          >
            <Link to="/dashboard/category" className="text-base capitalize">
              <i className="bi bi-bar-chart mr-2 inline-block text-lg text-gray-600"></i>{" "}
              Categories
            </Link>
          </li>
          <li
            className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
              isSelect === 5 ? "bg-gray-400" : ""
            } hover:bg-gray-400 hover:text-white`}
            onClick={() => {
              setIsSelect(5);
            }}
          >
            <Link to="/dashboard/slider" className="text-base capitalize">
              <i className="bi bi-people-fill mr-2 inline-block text-lg text-gray-600"></i>{" "}
              Slider
            </Link>
          </li>
          <li
            className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
              isSelect === 6 ? "bg-gray-400" : ""
            } hover:bg-gray-400 hover:text-white`}
            onClick={() => {
              setIsSelect(6);
            }}
          >
            <Link to="/dashboard/orders" className="text-base capitalize">
              <i className="bi bi-people-fill mr-2 inline-block text-lg text-gray-600"></i>{" "}
              Order
            </Link>
          </li>
          <li
            className={`px-4 cursor-pointer transition-all py-3 text-gray-800 flex items-center ${
              isSelect === 7 ? "bg-gray-400" : ""
            } hover:bg-gray-400 hover:text-white`}
            onClick={() => {
              setIsSelect(7);
            }}
          >
            <Link to="/dashboard/account" className="text-base capitalize">
              <i className="bi bi-people-fill mr-2 inline-block text-lg text-gray-600"></i>{" "}
              Account
            </Link>
          </li>
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
