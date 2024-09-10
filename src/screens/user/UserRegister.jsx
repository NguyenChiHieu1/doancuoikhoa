import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style_user_css/UserRegister.css";
import { useUserRegisterMutation } from "../../store/service/authService";

import {
  validateEmail,
  validateFullName,
  validateName,
  validatePassword,
} from "../../validations/validateUser/user";
import Spinner from "../../components/Spinner";
import { useDispatch } from "react-redux";
import { setSuccess } from "../../store/reducer/globalReducer";

const UserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const [addCart, setAddCart] = useState("");
  const [
    data,
    { response, error, isLoading, isError, isFetching, isSuccess, refetch },
  ] = useUserRegisterMutation();

  // Xử lý register
  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateRegisterForm = (values) => {
    const list_errors = {};
    if (!validateName(values.name)) {
      list_errors.name =
        "Name is required and should be at least 3 characters.";
    }
    if (!validateFullName(values.fullName)) {
      list_errors.fullName = "Full name is required.";
    }

    if (!validateEmail(values.email)) {
      list_errors.email = "Email is invalid.";
    }

    if (!validatePassword(values.password)) {
      list_errors.password =
        "Password must be at least 8 characters long and include a number and a special character.";
    }
    setErrors({});
    return list_errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log('submit start')
    const error_list = validateRegisterForm(values);
    if (Object.keys(error_list).length === 0) {
      data(values);
    } else {
      setErrors(error_list);
    }
  };

  //register thành công
  useEffect(() => {
    if (isSuccess) {
      dispatch(setSuccess("Register successfull, please login account"));
      navigate("/user/login");
    }
  }, [isSuccess]);

  return (
    <div className="container_register">
      <div className="card_register">
        <div className="error_message" style={{ float: "right" }}>
          {!isFetching && error?.data?.errors?.length > 0
            ? error?.data?.errors?.[0]?.msg
            : ""}
        </div>
        <div>
          <div className="return_login">
            <NavLink to="/user/login">
              <i className="bi bi-arrow-left"></i>
            </NavLink>
          </div>
          <div>
            <h2 className="title_register">Đăng ký tài khoản</h2>
          </div>
        </div>
        <form onSubmit={submitHandler}>
          <div className="form_group_register">
            <label htmlFor="nickname" className="label_register">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              id="nickname"
              name="name"
              className="input_register"
              // placeholder="Your Nick Name"
              onChange={handleChange}
            />
            {errors?.name && (
              <div className="error_message">{errors?.name}</div>
            )}
          </div>
          <div className="form_group_register">
            <label htmlFor="fullname" className="label_register">
              Họ và tên:
            </label>
            <input
              type="text"
              id="fullname"
              name="fullName"
              className="input_register"
              // placeholder="Your Full Name"
              onChange={handleChange}
            />
            {errors?.fullName && (
              <div className="error_message">{errors?.fullName}</div>
            )}
          </div>
          <div className="form_group_register">
            <label htmlFor="email" className="label_register">
              Tài khoản email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input_register"
              // placeholder="you@example.com"
              onChange={handleChange}
            />
            {errors?.email && (
              <div className="error_message">{errors?.email}</div>
            )}
          </div>
          <div className="form_group_register">
            <label htmlFor="password" className="label_register">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input_register"
              placeholder="••••••••"
              onChange={handleChange}
            />
            {errors?.password && (
              <div className="error_message">{errors?.password}</div>
            )}
          </div>
          <div className="submit_register">
            <button type="submit" className="submit_button_register">
              {isLoading ? <Spinner /> : "Đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
