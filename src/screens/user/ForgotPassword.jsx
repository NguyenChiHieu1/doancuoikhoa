import { NavLink } from "react-router-dom";
import "./style_user_css/ForgotPassword.css";
import { useUserForgotPasswordMutation } from "../../store/service/authService";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../store/reducer/globalReducer";
import { setUserToken } from "../../store/reducer/authReducer";
import React, { useState, useEffect } from "react";
import { validateEmail } from "../../validations/validateUser/user";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [fogotpassword, { data: response, isLoading, error }] =
    useUserForgotPasswordMutation();

  const validateLogin = (value) => {
    const err = {};
    if (!validateEmail(value)) {
      err.email = "Email is invalid !!! ";
    }
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateLogin(email);
    if (Object.keys(err).length === 0) {
      fogotpassword({ email: email });
    } else {
      setErrorEmail(err);
    }
  };

  return (
    <div className="container_forget_password">
      <div className="card_forget_password">
        <div className="error_message">
          {error?.data?.errors?.length > 0 ? error?.data?.errors?.[0]?.msg : ""}
        </div>
        <div className="success_message">
          {response?.msg ? response?.msg : ""}
        </div>
        <div>
          <div className="return_login_forget">
            <NavLink to="/user/login">
              <i className="bi bi-arrow-left"></i>
            </NavLink>
          </div>
          <div>
            <h2 className="title_forget_password">Quên mật khẩu</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form_group_forget_password">
            <label htmlFor="email" className="label_forget_password">
              Tài khoản email:
            </label>
            <input
              type="email"
              id="email"
              className="input_forget_password"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errorEmail?.email && (
              <div className="error_message">{errorEmail?.email}</div>
            )}
          </div>
          <div className="footer_forget_password">
            <button type="submit" className="submit_button_forget_password">
              {isLoading ? <Spinner /> : "Gửi link cấp lại mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
