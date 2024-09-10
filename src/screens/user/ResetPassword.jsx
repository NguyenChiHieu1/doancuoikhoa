import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import "./style_user_css/ResetPassword.css";
import { useUserResetPasswordMutation } from "../../store/service/authService";
import Spinner from "../../components/Spinner";
import { useDispatch } from "react-redux";
import { validatePassword } from "../../validations/validateUser/user";
import { setSuccess } from "../../store/reducer/globalReducer";

const ResetPassword = () => {
  const { resetCode } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorReset, setErrorReset] = useState({});

  const [
    resetpass,
    { data: response, error: errorAPI, isSuccess, isLoading, isError },
  ] = useUserResetPasswordMutation();

  const validateLogin = (password, confirmPassword) => {
    const err = {};
    if (!validatePassword(password)) {
      err.password =
        "Password must be at least 8 characters long and include a number and a special character.!!!";
    }
    if (!validatePassword(confirmPassword)) {
      err.confirmPassword =
        "Confirm password must be at least 8 characters long and include a number and a special character.!!!";
    }
    if (password !== confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }
    return err;
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setSuccess("ResetPassWord successfull"));
      navigate("/user/login");
    }
  }, [isSuccess, dispatch, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log("resetCode",resetCode)
    const errReset = validateLogin(password, confirmPassword);
    if (Object.keys(errReset).length === 0) {
      let dataBody = {
        password: password,
        confirmPassword: confirmPassword,
      };
      // console.log(resetCode)

      // chu y sai cái này--------------->>
      resetpass({ data: dataBody, resetCode });
    } else {
      setErrorReset(errReset);
    }
  };

  return (
    <div className="container_reset_password">
      <div className="card_reset_password">
        <div className="error_message">
          {errorAPI?.data?.errors?.length > 0
            ? errorAPI?.data?.errors?.[0]?.msg
            : ""}
        </div>
        <div className="success_message">
          {response?.msg ? response?.msg : ""}
        </div>
        <div>
          <div className="return_login_reset">
            <NavLink to="/user/login">
              <i className="bi bi-arrow-left"></i>
            </NavLink>
          </div>
          <div>
            <h2 className="title_reset_password">Đặt lại mật khẩu</h2>
          </div>
        </div>
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="form_group_reset_password">
            <label htmlFor="password" className="label_reset_password">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="password"
              className="input_reset_password"
              // placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorReset?.password && (
              <div className="error_message">{errorReset?.password}</div>
            )}
          </div>
          <div className="form_group_reset_password">
            <label htmlFor="confirm_password" className="label_reset_password">
              Nhập lại mật khẩu:
            </label>
            <input
              type="password"
              id="confirm_password"
              className="input_reset_password"
              // placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errorReset?.confirmPassword && (
              <div className="errorReset_message">
                {errorReset?.confirmPassword}
              </div>
            )}
          </div>
          {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
          <div className="footer_reset_password">
            <button type="submit" className="submit_button_reset_password">
              {isLoading ? <Spinner /> : "Lưu lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
