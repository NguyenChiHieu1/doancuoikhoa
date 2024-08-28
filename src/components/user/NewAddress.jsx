import React, { useEffect, useState } from "react";
import "../../screens/user/style_user_css/style/newAddress.css";
import { useCreateAddressMutation } from "../../store/service/addressService";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { useDispatch } from "react-redux";
import { setSuccess } from "../../store/reducer/globalReducer";
import { useNavigate } from "react-router-dom";

const NewAddress = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState();
  const [data, response] = useCreateAddressMutation();
  const handleChangeValue = (e) => {
    setValue((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await data(value);
  };

  useEffect(() => {
    if (response.isSuccess) {
      dispatch(setSuccess("Thêm địa chỉ mới thành công !!!"));
      onClose();
    }
  }, [response.isSuccess]);
  return (
    <div className="new-address-overlay">
      <div className="new-address-container">
        <button className="new-address-close-button" onClick={onClose}>
          X
        </button>
        <form className="new-address-content" onSubmit={handleSubmit}>
          <h2 className="new-address-title">Nhập địa chỉ mới</h2>

          <label className="new-address-label" htmlFor="street">
            Địa chỉ mới:
          </label>
          <input
            className="new-address-input"
            type="text"
            id="street"
            name="street"
            onChange={handleChangeValue}
            required
          />

          <label className="new-address-label" htmlFor="district">
            Quận/Huyện:
          </label>
          <input
            className="new-address-input"
            type="text"
            id="district"
            name="district"
            onChange={handleChangeValue}
            required
          />

          <label className="new-address-label" htmlFor="city">
            Thành phố:
          </label>
          <input
            className="new-address-input"
            type="text"
            id="city"
            name="city"
            onChange={handleChangeValue}
            required
          />
          <label className="new-address-label" htmlFor="state">
            Tỉnh:
          </label>
          <input
            className="new-address-input"
            type="text"
            id="state"
            name="state"
            onChange={handleChangeValue}
            required
          />
          <label className="new-address-label" htmlFor="country">
            Quốc gia:
          </label>
          <input
            className="new-address-input"
            type="text"
            id="country"
            name="country"
            onChange={handleChangeValue}
            required
          />

          <label className="new-address-label" htmlFor="postalCode">
            Mã bưu chính:
          </label>
          <input
            className="new-address-input"
            type="text"
            id="postalCode"
            name="postalCode"
            onChange={handleChangeValue}
          />

          <div className="new-address-submit-button">
            {response?.isLoading ? (
              <Spinner />
            ) : (
              <button type="submit">Lưu địa chỉ</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAddress;
