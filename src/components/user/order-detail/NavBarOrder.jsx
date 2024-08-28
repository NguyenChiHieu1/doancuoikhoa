import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../../screens/user/style_user_css/style/order-user/navbar.css";
import { useSelector } from "react-redux";

const NavBar = () => {
  const location = useLocation();
  const linkRefs = useRef([]);
  const info = useSelector((state) => state.authReducer.info);

  useEffect(() => {
    linkRefs.current.forEach((link) => {
      if (link) {
        if (link.getAttribute("href") === location?.pathname) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }, [location.pathname]);

  return (
    <nav className="customNavBar">
      {info && (
        <div className="customProfileSection">
          <img
            src={info?.avatar || ""}
            alt="Profile-Images"
            className="customProfileImage"
          />
          <span className="customNickname">{info?.fullName || ""}</span>
        </div>
      )}
      <ul className="customNavLinks">
        <li>
          <Link
            to="/personal-info"
            className="customNavLink"
            ref={(el) => (linkRefs.current[0] = el)}
          >
            Thông tin cá nhân
          </Link>
        </li>
        <li>
          <Link
            to="/order-detail"
            className="customNavLink"
            ref={(el) => (linkRefs.current[1] = el)}
          >
            Quản lý đơn hàng
          </Link>
        </li>
        {/* <li>
          <Link
            to="/change-password"
            className="customNavLink"
            ref={(el) => (linkRefs.current[2] = el)}
          >
            Đổi mật khẩu
          </Link>
        </li>
        <li>
          <Link
            to="/lock-account"
            className="customNavLink"
            ref={(el) => (linkRefs.current[3] = el)}
          >
            Khóa Tài khoản
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default NavBar;
