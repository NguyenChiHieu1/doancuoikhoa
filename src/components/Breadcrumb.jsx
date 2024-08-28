import { Link } from "react-router-dom";
import React from "react";
import { useParams, useLocation } from "react-router-dom";
const Breadcrumb = ({ pid, level1, level2, level3, colorBread }) => {
  const location = useLocation();
  const isCartPage = location.pathname.includes("/cart");
  const isInfoPage = location.pathname.includes("/personal-info");
  const isOrderPage = location.pathname.includes("/order-detail");

  return (
    <nav
      aria-label="breadcrumb"
      className={`rounded-md mb-3 text-base pt-3 ${
        colorBread ? "border border-gray-300 p-3" : ""
      }`}
    >
      <ol className="flex space-x-2 text-gray-700">
        <li className="flex items-center">
          <Link to="/" className="hover:text-red-500 transition-colors">
            Trang chủ
          </Link>
          {/* Dấu > */}
          {(level1?.id || isCartPage || isInfoPage || isOrderPage) && (
            <svg
              className="w-4 h-4 mx-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </li>
        {/* Giỏ hàng */}
        {isCartPage && (
          <li
            className={
              !level2?.id ? "text-red-500 font-semibold" : `flex items-center`
            }
          >
            <Link to={`/cart`} className="hover:text-red-500 transition-colors">
              Giỏ hàng
            </Link>
          </li>
        )}

        {/* Quản lý thông tin cá nhân*/}
        {isInfoPage && (
          <li
            className={
              !level2?.id ? "text-red-500 font-semibold" : `flex items-center`
            }
          >
            <Link
              to={`/personal-info`}
              className="hover:text-red-500 transition-colors"
            >
              Thông tin cá nhân
            </Link>
          </li>
        )}
        {/* Quản lý đơn hàng */}
        {isOrderPage && (
          <li
            className={
              !level2?.id ? "text-red-500 font-semibold" : `flex items-center`
            }
          >
            <Link
              to={`/order-detail`}
              className="hover:text-red-500 transition-colors"
            >
              Quản lý đơn hàng
            </Link>
          </li>
        )}
        {/* Chi tiết sản phẩm */}
        {level1?.id && (
          <li
            className={
              !level2?.id ? "text-red-500 font-semibold" : `flex items-center`
            }
          >
            <Link
              to={`/category/${level1?.id}`}
              className="hover:text-red-500 transition-colors"
            >
              {level1?.name}
            </Link>
            {level2?.id && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </li>
        )}
        {level2?.id && (
          <li
            className={
              !level3?.id ? "text-red-500 font-semibold" : `flex items-center`
            }
          >
            <Link
              to={`/category/${level2?.id}`}
              className="hover:text-red-500 transition-colors"
            >
              {level2?.name}
            </Link>
            {level3?.id && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </li>
        )}
        {level3?.id && (
          <li
            className={
              !pid ? "text-red-500 font-semibold" : `flex items-center`
            }
          >
            <Link
              to={`/category/${level3?.id}`}
              className="hover:text-red-500 transition-colors"
            >
              {level3?.name}
            </Link>
            {pid && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </li>
        )}
        {pid && (
          <li
            className="text-red-500 font-semibold truncate w-96 max-w-lg"
            aria-current="page"
          >
            {pid}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
