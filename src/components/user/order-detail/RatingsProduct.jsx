import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRatingsMutation } from "../../../store/service/productService";
import { useUpdateRatingsUserMutation } from "../../../store/service/orderService";
import "../../../screens/user/style_user_css/style/order-user/ratingproduct.css";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";

const RatingsProduct = ({ pid, onClose, oid }) => {
  const navigate = useNavigate();
  const [ratingPro, { isSuccess: resRatingPro }] = useRatingsMutation();
  const [ratings, { isSuccess: resRatings, isLoading }] =
    useUpdateRatingsUserMutation();
  const [value, setValue] = useState({});
  // console.log("Response: ", response);
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(value);
    // console.log(pid);
    try {
      const [ratingResponse, updateRatingsResponse] = await Promise.all([
        ratingPro({ pid, rating: { ...value } }),
        ratings({ orderId: oid, productId: pid }),
      ]);

      if (ratingResponse && updateRatingsResponse) {
        toast.success("Thêm đánh giá thành công !!!");
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Thêm đánh giá thất bại !!!");
    }
  };
  // useEffect(() => {
  //   if (response.isSuccess) {
  //     toast.success(response?.data?.msg);
  //     toggleReview();
  //   }
  // }, [response.isSuccess, response?.data?.msg]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="review-form-overlay">
        <div className="review-form-container">
          <button className="review-form-close-button" onClick={onClose}>
            X
          </button>
          <form className="review-form-content" onSubmit={handleSubmit}>
            <h2 className="review-form-title">Đánh giá sản phẩm</h2>

            {/* {response.isError &&
              response?.error?.data?.errors.map((err) => (
                <p key={err} className="review-form-error">
                  {err.msg}
                </p>
              ))} */}

            <label className="review-form-label" htmlFor="star">
              Đánh giá:
            </label>
            <select
              name="star"
              id="star"
              className="review-form-input text-red-500"
              onChange={handleChange}
              // value={ratingState.rating}
              required
            >
              <option value="">Hãy chọn mức ★ để đánh giá</option>
              <option value="1">★</option>
              <option value="2">★★</option>
              <option value="3">★★★</option>
              <option value="4">★★★★</option>
              <option value="5">★★★★★</option>
            </select>

            <label className="review-form-label" htmlFor="comment">
              Nhận xét:
            </label>
            <textarea
              name="comment"
              id="comment"
              cols="30"
              rows="5"
              className="review-form-input"
              placeholder="Đánh giá của bạn về sản phẩm"
              onChange={handleChange}
              required
            ></textarea>

            <div className="review-form-submit-button">
              <button type="submit">
                {isLoading ? <Spinner /> : "Thêm Đánh Giá"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RatingsProduct;
