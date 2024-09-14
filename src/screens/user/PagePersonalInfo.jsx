import React, { useState, useEffect } from "react";
import WrapperPersonal from "../../components/user/order-detail/WrapperPersonal";
import "./style_user_css/style/order-user/personalinfo.css";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllAddressesQuery } from "../../store/service/addressService";
import { useUpdateMutation } from "../../store/service/authService";
import Spinner from "../../components/Spinner";
import { addInfo } from "../../store/reducer/authReducer";
import toast, { Toaster } from "react-hot-toast";
import NewAddress from "../../components/user/NewAddress";
import { removeItem } from "../../store/reducer/cartReducer";
import { useVerifyPaymentQuery } from "../../store/service/paymentService";

const PagePersonalInfo = () => {
  const dispatch = useDispatch();
  //----lấy thông tin user---------------//
  const [errors, setErrors] = useState();
  const [iconold, setIconOld] = useState({ id: "", hidden: true });
  const [iconnew, setIconNew] = useState({ id: "", hidden: true });
  const [iconconfirm, setIconConfirm] = useState({ id: "", hidden: true });
  const [isNewAddressFormVisible, setNewAddressFormVisible] = useState(false);
  const info = useSelector((state) => state.authReducer.info);
  const [imageInput, setImageInput] = useState("");
  const [imageURL, setImageURL] = useState(info?.avatar);
  // const [, setImageInput] = useState(info?.avatar);

  // ----------Xóa sp vừa thanh toán trên giỏ hàng-------------

  const queryParams = new URLSearchParams(location.search);
  const session_id = queryParams.get("session_id");
  // xóa giỏ hàng đã mua
  let cart_buy_1 = localStorage.getItem("cart_buy");
  cart_buy_1 = cart_buy_1 ? JSON.parse(cart_buy_1) : [];
  console.log("cart_buy_1", cart_buy_1);

  const { data: dataPayment, isSuccess: isVerifyPaymentSuccess } =
    useVerifyPaymentQuery(session_id, {
      skip: !session_id,
    });

  useEffect(() => {
    if (isVerifyPaymentSuccess && cart_buy_1.length > 0) {
      cart_buy_1.forEach((it) => {
        console.log("Removing item:", it);
        dispatch(
          removeItem({
            _id: it?._id,
            color: it?.color,
          })
        );
      });
      localStorage.removeItem("cart_buy");
    }
  }, [isVerifyPaymentSuccess]);
  // ---------The end----Xóa sp trong giỏ hàng -----------------
  // ---------------
  const [value, setValue] = useState({
    name: info?.name || "",
    fullName: info?.fullName || "",
    avatar: info?.avatar || "",
    email: info?.email || "",
    phoneNumber: info?.phoneNumber || "",
    dateOfBirth: info?.dateOfBirth || "",
    gender: info?.gender || "",
    address: info?.address?.[0]?._id || "",
    isBlock: info?.isBlock || false,
    passwordNew: info?.passwordNew || "",
    passwordOld: info?.passwordOld || "",
    passwordConfirm: info?.passwordConfirm || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    console.log("value-address:");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // ----------------lấy địa chỉ || gửi thông tin user----------------//
  const {
    data: addressList,
    isSuccess: succesGetAddress,
    refetch,
  } = useGetAllAddressesQuery();
  const [updateInfo, { data, isLoading, isSuccess: succUpdateInfo }] =
    useUpdateMutation();
  // ------------------------validate------------------//
  const validateInputs = () => {
    const newErrors = {};

    if (!value.name.trim()) {
      newErrors.name = "Tên đăng nhập không được để trống.";
    }

    if (!value.fullName.trim()) {
      newErrors.fullName = "Tên đầy đủ không được để trống.";
    }

    const phoneRegex = /^[0-9]+$/;
    if (!value.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống.";
    } else if (!phoneRegex.test(value.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại chỉ chứa số.";
    } else if (value.phoneNumber.length < 10 || value.phoneNumber.length > 11) {
      newErrors.phoneNumber = "Số điện thoại phải có từ 10 đến 11 số.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.email && !emailRegex.test(value.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!value.address) {
      newErrors.address = "Vui lòng chọn địa chỉ.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Validate password
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  const validateInputPasswords = () => {
    const newErrors = {};

    if (!value.passwordOld) {
      newErrors.passwordOld = "Vui lòng nhập mật khẩu cũ.";
    }
    if (!value.passwordNew) {
      newErrors.passwordNew = "Vui lòng nhập mật khẩu mới.";
    } else {
      if (value.passwordNew.length < minLength) {
        newErrors.passwordNew = `Mật khẩu mới phải có ít nhất ${minLength} ký tự.`;
      }
      if (!hasNumber.test(value.passwordNew)) {
        newErrors.passwordNew = "Mật khẩu mới phải chứa ít nhất một chữ số.";
      }
      if (!hasSpecialChar.test(value.passwordNew)) {
        newErrors.passwordNew =
          "Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt.";
      }
    }

    if (!value.passwordConfirm) {
      newErrors.passwordConfirm = "Vui lòng nhập lại mật khẩu mới.";
    } else if (value.passwordNew !== value.passwordConfirm) {
      newErrors.passwordConfirm = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ----------------------function----------------//
  const handleSave = async () => {
    if (!validateInputs()) return;
    try {
      console.log("value", value);
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("fullName", value.fullName);
      formData.append("phoneNumber", value.phoneNumber);
      formData.append("dateOfBirth", value.dateOfBirth);
      formData.append("gender", value.gender);
      formData.append("address", value.address);
      if (imageInput && imageInput !== info.avatar) {
        formData.append("image", imageInput);
      }
      console.log("formData", formData);
      const response = await updateInfo({ dataProduct: formData }).unwrap();
      // console.log(response);
      if (response?.success) {
        toast.success("Cập nhật thông tin thành công");
        dispatch(addInfo(response?.data));
        refetch();
      } else {
        toast.error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePassword = async () => {
    if (!validateInputPasswords()) return;
    // console.log(value);
    try {
      console.log("value", value);
      const formData = new FormData();

      formData.append("passwordNew", value.passwordNew);
      formData.append("passwordOld", value.passwordOld);

      const response = await updateInfo({ dataProduct: formData }).unwrap();
      if (response?.success) {
        toast.success("Cập nhật password thành công");
      } else {
        toast.error("Cập nhật password thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async () => {
    try {
      const formData = new FormData();

      formData.append("isBlock", true);
      const response = await updateInfo({ dataProduct: formData }).unwrap();
      if (response?.success) {
        toast.success("Khóa tài khoản thành công");
      } else {
        toast.error("Khóa tài khoản thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WrapperPersonal>
      <div className="personal-info-container">
        <div className="profileContainer">
          <div className="profileSection">
            <img src={imageURL || ""} alt="Profile" className="profileImage" />
            <input
              id="avatar"
              type="file"
              name="avatar"
              onChange={handleImageChange}
            />
            <label htmlFor="avatar">Thay đổi ảnh đại diện</label>
          </div>
          <div className="profileDetails">
            <label className="profileDetails_column1" htmlFor="name">
              Tên đăng nhập:
              <input
                type="text"
                name="name"
                id="name"
                value={value.name || ""}
                onChange={handleInputChange}
                required
              />
              {errors?.name && <p className="error-message!">{errors?.name}</p>}
            </label>

            <label className="profileDetails_column1">
              Tên đầy đủ:
              <input
                type="text"
                name="fullName"
                value={value.fullName || ""}
                onChange={handleInputChange}
                required
              />
              {errors?.fullName && (
                <p className="error-message">{errors?.fullName}</p>
              )}
            </label>
            <label className="profileDetails_column1">
              Email:
              <input
                type="email"
                name="email"
                value={value.email || ""}
                onChange={handleInputChange}
                required
              />
              {errors?.email && (
                <p className="error-message">{errors?.email}</p>
              )}
            </label>
            <label className="profileDetails_column2">
              Số Điện Thoại:
              <input
                type="text"
                name="phoneNumber"
                value={value.phoneNumber || ""}
                onChange={handleInputChange}
              />
              {errors?.phoneNumber && (
                <p className="error-message">{errors?.phoneNumber}</p>
              )}
            </label>
            <label className="profileDetails_column2">
              Ngày Sinh:
              <input
                type="date"
                name="dateOfBirth"
                value={
                  value?.dateOfBirth ? value?.dateOfBirth.split("T")[0] : ""
                }
                onChange={handleInputChange}
              />
            </label>
            <label className="profileDetails_column2">
              <div className="w-full flex justify-between items-center">
                <label htmlFor=""> Địa chỉ:</label>
                <label
                  htmlFor=""
                  className="text-red-800 text-sm right-0 cursor-pointer hover:text-red-500"
                  onClick={() => setNewAddressFormVisible(true)}
                >
                  <i className="bi bi-plus-square"></i>
                </label>
              </div>
              <select
                className="profile-select"
                id="address"
                name="address"
                value={value.address || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn địa chỉ</option>
                {addressList?.data?.length > 0 &&
                  addressList?.data?.map((addr) => (
                    <option
                      key={addr?._id}
                      value={addr?._id}
                    >{`${addr?.street}, ${addr?.district}, ${addr?.city}, ${addr?.state},${addr?.country}`}</option>
                  ))}
              </select>
              {errors?.address && (
                <p className="error-message">{errors?.address}</p>
              )}
            </label>
            <label className="profileDetails_column2">
              Giới Tính:
              <select
                name="gender"
                value={value.gender}
                onChange={handleInputChange}
                style={{
                  border: "1px solid #bcbbbb",
                  borderRadius: "5px",
                  padding: "5px",
                  marginLeft: "5px",
                }}
              >
                <option value="">Chọn một giá trị</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </label>
          </div>
          <div className="saveButtonContainer">
            <button onClick={handleSave}>
              {isLoading ? <Spinner /> : "Lưu thông tin"}
            </button>
          </div>
        </div>

        <div className="changePassword-deleteAcc">
          <Toaster className="Top-right" />
          <div className="changePasswordSection">
            <div>
              <h3>
                <b>Đổi mật khẩu</b>
              </h3>
            </div>
            <label>Mật khẩu hiện tại:</label>
            <div className="passwordConfim">
              <input
                id="passwordOld"
                type={
                  iconold?.id === "passwordOld" && iconold?.hidden === true
                    ? "password"
                    : "text"
                }
                name="passwordOld"
                value={value?.passwordOld || ""}
                onChange={handleInputChange}
              />
              {iconold?.id === "passwordOld" && iconold?.hidden === true ? (
                <i
                  className="bi bi-eye-slash eye"
                  onClick={() =>
                    setIconOld({
                      id: "passwordOld",
                      hidden: false,
                    })
                  }
                  tabIndex="-1"
                ></i>
              ) : (
                <i
                  className="bi bi-eye eye"
                  onClick={() =>
                    setIconOld({
                      id: "passwordOld",
                      hidden: true,
                    })
                  }
                  tabIndex="-1"
                ></i>
              )}
            </div>
            {errors?.passwordOld && (
              <p className="error-message">{errors?.passwordOld}</p>
            )}
            <label>Mật khẩu mới:</label>
            <div className="passwordConfim">
              <input
                id="passwordNew"
                type={
                  iconnew?.id === "passwordNew" &&
                  (iconnew?.hidden === true ? "password" : "text")
                }
                name="passwordNew"
                value={value?.passwordNew || ""}
                onChange={handleInputChange}
              />
              {iconnew?.id === "passwordNew" && iconnew?.hidden === true ? (
                <i
                  className="bi bi-eye-slash eye"
                  onClick={() =>
                    setIconNew({
                      id: "passwordNew",
                      hidden: false,
                    })
                  }
                  tabIndex="-1"
                ></i>
              ) : (
                <i
                  className="bi bi-eye eye"
                  onClick={() =>
                    setIconNew({
                      id: "passwordNew",
                      hidden: true,
                    })
                  }
                  tabIndex="-1"
                ></i>
              )}
            </div>
            {errors?.passwordNew && (
              <p className="error-message">{errors?.passwordNew}</p>
            )}
            <label htmlFor="passwordConfirm">Xác nhận mật khẩu mới:</label>
            <div className="passwordConfim">
              <input
                id="passwordConfirm"
                type={
                  iconconfirm?.id === "passwordConfirm" &&
                  iconconfirm?.hidden === true
                    ? "password"
                    : "text"
                }
                name="passwordConfirm"
                value={value?.passwordConfirm || ""}
                onChange={handleInputChange}
              />
              {iconconfirm?.id === "passwordConfirm" &&
              iconconfirm?.hidden === true ? (
                <i
                  className="bi bi-eye-slash eye"
                  onClick={() =>
                    setIconConfirm({
                      id: "passwordConfirm",
                      hidden: false,
                    })
                  }
                  tabIndex="-1"
                ></i>
              ) : (
                <i
                  className="bi bi-eye eye"
                  onClick={() =>
                    setIconConfirm({
                      id: "passwordConfirm",
                      hidden: true,
                    })
                  }
                  tabIndex="-1"
                ></i>
              )}
            </div>
            {errors?.passwordConfirm && (
              <p className="error-message">{errors?.passwordConfirm}</p>
            )}

            <div>
              <button className="changePasswordButton" onClick={handlePassword}>
                {isLoading ? <Spinner /> : "Đổi mật khẩu"}
              </button>
            </div>
          </div>

          <div className="deleteAccountSection">
            <button className="deleteAccountButton" onClick={handleBlock}>
              {isLoading ? <Spinner /> : "Khóa tài khoản"}{" "}
            </button>
          </div>
        </div>
        {isNewAddressFormVisible && (
          <NewAddress
            onClose={() => {
              setNewAddressFormVisible(false);
              // refetch();
            }}
          />
        )}
      </div>
    </WrapperPersonal>
  );
};

export default PagePersonalInfo;
