import { Navigate, NavLink, useNavigate } from "react-router-dom";
import "./style_user_css/UserLogin.css";
import { useAuthLoginMutation } from "../../store/service/authService";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../store/reducer/globalReducer";
import { setUserToken } from "../../store/reducer/authReducer";
import React, { useState, useEffect } from "react";
import {
  validateEmail,
  validatePassword,
} from "../../validations/validateUser/user";

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mess_success = useSelector((state) => state.globalReducer.success);

  const [valueInput, setValueInput] = useState({});
  const [errorInput, setErrorInput] = useState({});

  // mutation để login
  const [
    login,
    { data: dataLogin, error, isLoading, isSuccess: isLoginSuccess },
  ] = useAuthLoginMutation();

  // Xử lý logic khi login thành công
  useEffect(() => {
    if (isLoginSuccess) {
      dispatch(clearMessage(""));
      const token = dataLogin?.token;
      if (typeof token === "string") {
        // Lưu token vào localStorage
        localStorage.setItem("user-token", token);
        dispatch(setUserToken(token));
      }
    }
  }, [isLoginSuccess, dataLogin]);

  // Xử lý sự kiện thay đổi input
  const handleChange = (e) => {
    setValueInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Hàm kiểm tra validate dữ liệu đầu vào
  const validateLogin = (value) => {
    const err = {};
    if (!validateEmail(value.email)) {
      err.email = "Email is invalid.";
    }
    if (!validatePassword(value.password)) {
      err.password =
        "Password must be at least 8 characters long and include a number and a special character.";
    }
    return err;
  };

  // Xử lý khi submit form
  const submitHandler = async (e) => {
    e.preventDefault();
    const list_err = validateLogin(valueInput);
    if (Object.keys(list_err).length === 0) {
      const logi = await login(valueInput).unwrap();
      if (logi?.success === true) {
        let token = logi?.token;
        if (typeof token === "string") {
          localStorage.setItem("user-token", token);
          dispatch(setUserToken(token));
        }
      }
    } else {
      setErrorInput(list_err);
    }
  };

  return (
    <div className="container_login">
      <div className="card_login">
        <div className="error_message">
          {error?.data?.errors?.length > 0 ? error?.data?.errors?.[0]?.msg : ""}
        </div>
        <div className="success_message">
          {mess_success && mess_success !== "" ? mess_success : ""}
        </div>
        <h2 className="title_login">Đăng nhập tài khoản</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group_login">
            <label htmlFor="email" className="label_login">
              Tài khoản email:
            </label>
            <input
              type="email"
              id="email"
              className="input_login"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              autocomplete="current-password"
            />
            {errorInput?.email && (
              <div className="error_message">{errorInput?.email}</div>
            )}
          </div>
          <div className="form_group_login">
            <label htmlFor="password" className="label_login">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              className="input_login"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
            />
            {errorInput?.password && (
              <div className="error_message">{errorInput?.password}</div>
            )}
          </div>
          <div className="footer_login">
            <div className="forgot_password_login">
              <NavLink
                to="/user/forgot-password"
                className="forgot_password_link_login"
              >
                Quên <b>mật khẩu</b> của bạn ?
              </NavLink>
            </div>
          </div>
          <div className="submit_login">
            <button type="submit" className="submit_button_login">
              {isLoading ? <Spinner /> : "Đăng nhập"}
            </button>
          </div>
        </form>
        <div className="register_user_login">
          <span>Bạn chưa có tài khoản, vui lòng đăng ký </span>
          <b>
            <NavLink
              to="/user/register" // Đảm bảo rằng '/login' là đường dẫn đến trang đăng nhập
            >
              tại đây !!!
            </NavLink>
          </b>
          {/* <button id="register_user" >Register</button> */}
        </div>
      </div>
    </div>
  );
};
export default UserLogin;
