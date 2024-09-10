import React, { useEffect, useState } from "react";
import "./style_user_css/style/payment.css";
import NewAddress from "../../components/user/NewAddress";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllAddressesQuery } from "../../store/service/addressService";
import toast, { Toaster } from "react-hot-toast";
import { clearMessage } from "../../store/reducer/globalReducer";
import { useCreateOrderMutation } from "../../store/service/orderService";
import formatMoney from "../../utils/formatMoney";
import { useNavigate } from "react-router-dom";
import { removeItem } from "../../store/reducer/cartReducer";

const Payment = ({ itemCart, totalPayment, paymentMethod, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mess = useSelector((state) => state.globalReducer.success);

  useEffect(() => {
    if (mess) {
      toast.success(mess);
      dispatch(clearMessage());
    }
  }, [mess, dispatch]);

  const [isNewAddressFormVisible, setNewAddressFormVisible] = useState(false);
  const userInfo = useSelector((state) => state.authReducer.info);
  const {
    data: addressList,
    isSuccess: succesGetAddress,
    refetch,
  } = useGetAllAddressesQuery();

  const [createOrder, response] = useCreateOrderMutation();

  // Tạo state cho các input và lỗi
  const [fullName, setFullName] = useState(userInfo?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || 0);
  const [email, setEmail] = useState(userInfo?.email || "");
  const [address, setAddress] = useState(userInfo?.address?.[0]?._id || "");
  const [orderNotes, setOrderNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [allAddress, setAllAddress] = useState();

  useEffect(() => {
    if (succesGetAddress) {
      setAllAddress(addressList?.data);
    }
  }, [succesGetAddress, addressList]);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống.";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại chỉ chứa số.";
    } else if (phoneNumber.length < 10 || phoneNumber.length > 11) {
      newErrors.phoneNumber = "Số điện thoại phải có từ 10 đến 11 số.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!address) {
      newErrors.address = "Vui lòng chọn địa chỉ.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function removeItemBuyCart() {
    if (itemCart.length > 0) {
      itemCart.forEach((it) => {
        dispatch(
          removeItem({
            _id: it._id,
            color: it.color,
          })
        );
      });
    }
    localStorage.removeItem("cart_buy");
  }

  function shippingAddres(id) {
    // console.log("id", id);
    // console.log("allAddress", allAddress);
    let addre = {};
    allAddress.filter((it) => {
      if (it?._id === id) return (addre = it);
    });
    console.log("addre", addre);

    return {
      recipientName: fullName || "",
      recipientNumber: phoneNumber || "",
      city: addre?.city || "",
      country: addre?.country || "",
      line1: `${addre?.street}, ${addre?.district}` || "",
      line2: ``,
      postal_code: addre?.postalCode || "",
      state: addre?.state || "",
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      let items = [];
      itemCart.map((it) => {
        items.push({
          productId: it?._id,
          name: it?.name,
          quantity: it?.quantity,
          price: it?.price,
          discount: it?.discount > it?.coupon ? it?.discount : it?.coupon,
          color: it?.color,
        });
      });

      let addShip = shippingAddres(address);

      let order = {
        items: items,
        customer: userInfo?._id,
        totalAmount: totalPayment,
        paymentMethod: paymentMethod,
        shippingAddress: addShip,
        notes: orderNotes,
      };
      console.log("order", order);
      try {
        const result = await createOrder(order).unwrap();
      } catch (err) {
        toast.error("Đơn hàng được thêm thất bại!!!");
      }
    }
  };

  useEffect(() => {
    if (response.isSuccess) {
      removeItemBuyCart();
      toast.success("Đơn hàng được thêm thành công!!!");
      setTimeout(() => {
        navigate("/order-detail");
      }, 2000);
    }
  }, [response.isSuccess]);

  return (
    <div className="order-form-overlay">
      <div className="order-form-container">
        <button className="order-form-close-button" onClick={onClose}>
          X
        </button>
        <form className="order-form-content" onSubmit={handleSubmit}>
          <h2 className="order-form-title">Thông tin đơn hàng</h2>

          <div className="order-form-grid">
            <div className="order-form-column">
              <label className="order-form-label" htmlFor="full_name">
                Họ và tên:
              </label>
              <input
                className="order-form-input"
                type="text"
                id="full_name"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              {errors.fullName && (
                <p className="error-message">{errors.fullName}</p>
              )}

              <label className="order-form-label" htmlFor="phone_number">
                Số điện thoại:
              </label>
              <input
                className="order-form-input"
                type="text"
                id="phone_number"
                name="phone_number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
              />
              {errors.phoneNumber && (
                <p className="error-message">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="order-form-column">
              <label className="order-form-label" htmlFor="email">
                Email:
              </label>
              <input
                className="order-form-input"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}

              <label className="order-form-label" htmlFor="address">
                Địa chỉ:
              </label>
              <Toaster className="top-right" />

              <select
                className="order-form-select"
                id="address"
                name="address"
                value={address || ""}
                onChange={(e) => setAddress(e.target.value)}
                required
              >
                <option value="" disabled>
                  Chọn địa chỉ
                </option>
                {addressList?.data?.length > 0 &&
                  addressList?.data?.map((addr) => (
                    <option
                      key={addr?._id}
                      value={addr?._id}
                    >{`${addr?.street}, ${addr?.district}, ${addr?.city},  ${addr?.state},${addr?.country}`}</option>
                  ))}
              </select>
              {errors.address && (
                <p className="error-message">{errors.address}</p>
              )}

              <label
                htmlFor=""
                onClick={() => setNewAddressFormVisible(true)}
                className="order-form-select-addressnew"
              >
                Thêm địa chỉ mới
              </label>
            </div>

            {paymentMethod === "bank_transfer" && (
              <div className="order-form-column">
                <label
                  className="order-form-label bank"
                  htmlFor="payment_method"
                >
                  Phương thức thanh toán: Bank
                </label>
                <div className="bank_checkout_order">
                  <p>Quý Khách chuyển khoản theo thông tin sau:</p>
                  <p>- Số tài khoản: 4520787982</p>
                  <p>- Tên ngân hàng:BIDV</p>
                  <p>- Chi nhánh:CN VAN PHUC HA NOI</p>
                  <span>
                    - Nội dung giao dịch: <b>{`${userInfo?.email}`}</b> - thanh
                    toán
                  </span>
                  <span>
                    - Tổng tiền thanh toán:{" "}
                    <b style={{ color: "red" }}>{`${formatMoney(
                      totalPayment
                    )}`}</b>
                  </span>
                </div>
              </div>
            )}
          </div>

          {paymentMethod === "COD" && (
            <div>
              <label className="order-form-label" htmlFor="payment_method">
                Phương thức thanh toán:
              </label>
              <input
                className="order-form-input"
                value="Thanh toán khi nhận hàng (COD)"
                readOnly
              />
            </div>
          )}

          <label className="order-form-label" htmlFor="order_notes">
            Ghi chú đơn hàng:
          </label>
          <textarea
            className="order-form-textarea"
            id="order_notes"
            name="order_notes"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
          ></textarea>

          <div className="order-form-checkbox-group">
            <input
              className="order-form-checkbox"
              type="checkbox"
              id="terms_and_conditions"
              name="terms_and_conditions"
              required
            />
            <label
              className="order-form-checkbox-label"
              htmlFor="terms_and_conditions"
            >
              Tôi đã đọc và đồng ý với các điều khoản và điều kiện.
            </label>
          </div>

          <p className="order-form-requirements">
            1. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận thanh toán.
          </p>
          <p className="order-form-requirements">
            2. Đơn hàng sẽ được giao hàng đến bạn trong 3-5 ngày sau khi đặt.
          </p>
          <p className="order-form-requirements">
            3. Đơn hàng không được đổi trả và hủy sau khi giao hàng thành công.
          </p>
          <p className="order-form-requirements">
            4. Sản phẩm sau khi giao đến tay người dùng nếu có thắc mắc vui lòng
            liên hệ cửa hàng sớm nhất để hỗ trợ.
          </p>
          <div className="order-form-submit-button-s">
            <button type="submit">Xác nhận đơn hàng</button>
          </div>
        </form>

        {isNewAddressFormVisible && (
          <NewAddress
            onClose={() => {
              setNewAddressFormVisible(false);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Payment;
