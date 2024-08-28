import { Navigate, NavLink, useNavigate } from "react-router-dom";
import "./style_user_css/UserLogin.css";
import { useAuthLoginMutation } from "../../store/service/authService";
import { useGetCartByUserIdQuery } from "../../store/service/cartUserService";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../store/reducer/globalReducer";
import { setUserToken } from "../../store/reducer/authReducer";
import { addCart } from "../../store/reducer/cartReducer";
import React, { useState, useEffect } from "react";
import {
  validateEmail,
  validatePassword,
} from "../../validations/validateUser/user";

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mess_success = useSelector((state) => state.globalReducer.success);

  let checkLoginSuccess = localStorage.getItem("user-token") || null;

  const [valueInput, setValueInput] = useState();
  const [errorInput, setErrorInput] = useState();
  const [checkLogin, setCheckLogin] = useState(false);

  //chú ý lỗi cấu trúc thi gọi mutation
  const [login, { data: response, error, isLoading, isSuccess }] =
    useAuthLoginMutation();
  const { data: dataCart, isSuccess: isCartSuccess } = useGetCartByUserIdQuery(
    undefined,
    { skip: !checkLogin }
  );

  useEffect(() => {
    if (checkLoginSuccess) {
      navigate("/personal-info");
    } else {
      setCheckLogin(false);
    }
  }, [checkLoginSuccess]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearMessage(""));
      const token = response?.token;
      if (typeof token === "string") {
        localStorage.setItem("user-token", token);
        dispatch(setUserToken(token));
        setCheckLogin(true);
      } else {
        console.error("Err:", response);
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isCartSuccess && dataCart) {
      let arrCart = [];
      dataCart.data.items.forEach((item) => {
        const itemCart = {
          _id: item._id,
          name: item.product.name,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price,
          discount: item.product.coupons.discount,
        };
        arrCart.push(itemCart);
        dispatch(addCart(itemCart));
      });
      localStorage.setItem("cart", JSON.stringify(arrCart));
      // setCheckLogin(!checkLogin);
    }
  }, [isCartSuccess, dataCart]);

  //xử lý login
  const handleChange = (e) => {
    setValueInput((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const validateLogin = (value) => {
    const err = {};
    if (!validateEmail(value.email)) {
      err.email = "Email is invalid.";
    }
    if (!validatePassword(value.password)) {
      err.password =
        "Password must be at least 8 characters long and include a number and a special character.!!!";
    }
    return err;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const list_err = validateLogin(valueInput);
    if (Object.keys(list_err).length === 0) {
      login(valueInput);
      console.log("data", valueInput);
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
        <h2 className="title_login">Login</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group_login">
            <label htmlFor="email" className="label_login">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input_login"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
            />
            {errorInput?.email && (
              <div className="error_message">{errorInput?.email}</div>
            )}
          </div>
          <div className="form_group_login">
            <label htmlFor="password" className="label_login">
              Password
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
                Forgot your <b>password</b>?
              </NavLink>
            </div>
          </div>
          <div className="submit_login">
            <button type="submit" className="submit_button_login">
              {isLoading ? <Spinner /> : "Sign in"}
            </button>
          </div>
        </form>
        <div className="register_user_login">
          <span>You do not have an account, please </span>
          <b>
            <NavLink
              to="/user/register" // Đảm bảo rằng '/login' là đường dẫn đến trang đăng nhập
            >
              Register!!!
            </NavLink>
          </b>
          {/* <button id="register_user" >Register</button> */}
        </div>
      </div>
    </div>
  );
};
export default UserLogin;
