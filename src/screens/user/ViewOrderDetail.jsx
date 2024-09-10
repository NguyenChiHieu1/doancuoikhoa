import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import WrapperPersonal from "../../components/user/order-detail/WrapperPersonal";
import { useRef } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import { useGetOrdersByAdminIdQuery } from "../../store/service/orderService";
import formatMoney from "../../utils/formatMoney";
import discount from "../../utils/discount";
import RatingsProduct from "../../components/user/order-detail/RatingsProduct";
import "./style_user_css/style/order-user/vieworder.css"; // Import the CSS file
import { useGetBillByIdQuery } from "../../store/service/billService";
import ReactToPrint from "react-to-print";

const ViewOrderDetail = () => {
  const { oid } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();

  const [isFormRating, setIsFormRating] = useState(false);
  //Lấy thông tin đơn hàng
  const {
    data: orderData,
    isLoading: loadingOrder,
    error: errorOrder,
  } = useGetOrdersByAdminIdQuery({ oid });

  //Lấy thông tin hóa đơn
  const { data: billData, isFetching: fetchBill } = useGetBillByIdQuery({
    oid,
  });

  const [valueId, setValueId] = useState("");

  if (errorOrder)
    return (
      <div className="w-full flex flex-col items-center">
        <p className="error-message">
          Lỗi dữ liệu cho chi tiết đơn hàng của bạn
        </p>
        <Link to="/order-detail" className="underline text-red-400 text-xl">
          Return
        </Link>
      </div>
    );

  return (
    <WrapperPersonal onFooter={false}>
      {loadingOrder ? (
        <Spinner />
      ) : (
        <div className="view-order-detail-container" ref={componentRef}>
          <div className="view-order-detail-header-icon no-print">
            <button className="back-button" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <ReactToPrint
              trigger={() => (
                <div className="print-bill-order-user ">
                  <button>
                    <i className="bi bi-printer"></i>
                  </button>
                </div>
              )}
              content={() => componentRef.current}
              onBeforePrint={() => console.log("Preparing to print")}
              onAfterPrint={() => console.log("Print finished")}
              onError={(error) => console.error("Print error:", error)}
            />
          </div>
          <div ref={componentRef}>
            <div className="view-order-detail-header">
              <div className="view-order-detail-title">
                <h3>Chi tiết đơn hàng</h3>
              </div>
            </div>
            <div className="order-details-grid">
              <div className="customer-info-section">
                <h4>Thông tin khách hàng</h4>
                <span>
                  Tên: &nbsp;<b> {orderData?.data?.customer?.fullName}</b>
                </span>
                <span>
                  Email:&nbsp; <b>{orderData?.data?.customer?.email}</b>
                </span>
                <span>
                  Số điện thoại:&nbsp;
                  <b>{orderData?.data?.customer?.phoneNumber || "Chưa có"}</b>
                </span>
              </div>

              <div className="order-info-section">
                <h4>Thông tin đơn hàng</h4>
                <span>
                  Mã đơn: &nbsp;<b>{orderData?.data?._id || "Lỗi dữ liệu"}</b>
                </span>
                <span>
                  Thanh toán:&nbsp;
                  <b className="total-amount">
                    {formatMoney(orderData?.data?.totalAmount) || 0}
                  </b>
                </span>
                <span>
                  Ngày đặt hàng:&nbsp;
                  <b>
                    {orderData?.data?.createdAt
                      ? new Date(
                          orderData?.data?.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </b>
                </span>
                {/* <span>
                Phương thức thanh toán:&nbsp;
                <b className="payment-method">
                  {orderData?.data?.paymentMethod || "null"}
                </b>
              </span> */}
                <span>
                  Tình trạng đơn hàng:&nbsp;
                  <b className="order-status">
                    {orderData?.data?.orderStatus === "pending" && (
                      <p>Đang chờ</p>
                    )}
                    {orderData?.data?.orderStatus === "processing" && (
                      <p>Đã xác nhận</p>
                    )}
                    {orderData?.data?.orderStatus === "shipped" && (
                      <p>Đang giao hàng</p>
                    )}
                    {orderData?.data?.orderStatus === "delivered" && (
                      <p>Giao hàng thành công</p>
                    )}
                    {orderData?.data?.orderStatus === "cancelled" && (
                      <p>Hủy đơn</p>
                    )}
                  </b>
                </span>
                <span>
                  Ngày nhận hàng:&nbsp;
                  <b className="delivery-date">
                    {orderData?.data?.deliveryDate
                      ? new Date(
                          orderData?.data?.deliveryDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </b>
                </span>
              </div>

              <div className="shipping-info-section">
                <h4>Địa chỉ nhận hàng:</h4>
                <span>
                  Người nhận:&nbsp;
                  <b>
                    {orderData?.data?.shippingAddress?.recipientName || "null"}
                  </b>
                </span>
                <span>
                  Số điện thoại người nhận:&nbsp;
                  <b>
                    +
                    {orderData?.data?.shippingAddress?.recipientNumber ||
                      "null"}
                  </b>
                </span>
                <span>
                  Địa chỉ 1:&nbsp;
                  <b>
                    {`${orderData?.data?.shippingAddress?.line1}, ${orderData?.data?.shippingAddress?.city}, ${orderData?.data?.shippingAddress?.country}` ||
                      "null"}
                  </b>
                </span>
                <span>
                  Địa chỉ 2:&nbsp;
                  <b>
                    {orderData?.data?.shippingAddress?.line2
                      ? `${orderData?.data?.shippingAddress?.line2}, ${orderData?.data?.shippingAddress?.city}, ${orderData?.data?.shippingAddress?.country}`
                      : "null"}
                  </b>
                </span>
                <br />
                <span>
                  Mã bưu điện:&nbsp;
                  <b>
                    {orderData?.data?.shippingAddress?.postal_code || "null"}
                  </b>
                </span>
              </div>

              <div className="order-info-section">
                <h4>Theo dõi đơn hàng</h4>

                <span>
                  Ngày thanh toán:&nbsp;
                  <b>
                    {billData?.data?.paymentDate
                      ? new Date(
                          billData?.data?.paymentDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </b>
                </span>
                <span>
                  Phương thức thanh toán:&nbsp;
                  <b className="payment-method">
                    {billData?.data?.paymentMethod === "bank_transfer" &&
                      "Chuyển khoản ngân hàng"}
                    {billData?.data?.paymentMethod === "card" &&
                      "Thanh toán online bằng Card "}
                    {billData?.data?.paymentMethod === "COD" &&
                      "Thanh toán khi nhận hàng"}
                  </b>
                </span>
                <span>
                  Tình trạng thanh toán:&nbsp;
                  <b className="order-status">
                    {billData?.data?.paymentStatus === "pending" && (
                      <p>Chưa thanh toán</p>
                    )}
                    {billData?.data?.paymentStatus === "paid" && (
                      <p>Đã thanh toán</p>
                    )}
                    {billData?.data?.paymentStatus === "failed" && (
                      <p>Lỗi thanh toán</p>
                    )}
                    {billData?.data?.paymentStatus === "refund" && (
                      <p>Hoàn tiền</p>
                    )}
                  </b>
                </span>
              </div>
            </div>
            <div className="product-list-section">
              <h4>Danh sách sản phẩm đã mua:</h4>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Màu</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Giảm giá</th>
                    <th>Tổng tiền</th>
                    {orderData?.data?.received && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {orderData?.data?.items?.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <Link to={`/product/${product?.productId?._id}`}>
                          <img
                            src={product?.productId?.images?.[0]}
                            alt="product"
                            className="product-image-order"
                          />
                        </Link>
                      </td>
                      <td className="td-order-name-product">
                        <Link to={`/product/${product?.productId?._id}`}>
                          {product?.name}
                        </Link>
                      </td>
                      <td className="td-order-color-product">
                        <div style={{ background: `${product?.color}` }}></div>
                      </td>
                      <td>{product?.quantity}</td>
                      <td>{formatMoney(product?.price)}</td>
                      <td>{product?.discount}%</td>
                      <td>
                        {formatMoney(
                          discount(product?.price, product?.discount) *
                            product?.quantity
                        )}
                      </td>
                      {orderData?.data?.received && (
                        <td>
                          {/* orderData?.data?.items?.ratings &&  */}
                          <button
                            className={`button-order-details ${
                              product?.ratings ? "disabled" : ""
                            }`}
                            onClick={() => {
                              if (!product?.ratings) {
                                setIsFormRating(true);
                                setValueId(product?.productId?._id);
                                // console.log("run", isFormRating);
                              }
                            }}
                            disabled={product?.ratings}
                          >
                            Đánh giá
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {isFormRating && (
        <RatingsProduct
          pid={valueId}
          oid={oid}
          onClose={() => setIsFormRating(false)}
        />
      )}
    </WrapperPersonal>
  );
};

export default ViewOrderDetail;
