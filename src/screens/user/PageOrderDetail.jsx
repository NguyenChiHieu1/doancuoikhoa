import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import formatMoney from "../../utils/formatMoney";
import WrapperPersonal from "../../components/user/order-detail/WrapperPersonal";
import { useVerifyPaymentQuery } from "../../store/service/paymentService";
import { removeItem } from "../../store/reducer/cartReducer";
import "./style_user_css/style/order-user/order.css";
import {
  useGetOrdersByUserIdQuery,
  useUpdateOrderByUserMutation,
} from "../../store/service/orderService";
import { useCancelOrderUserMutation } from "../../store/service/orderService";

const OrderDetail = () => {
  const { page = 1 } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page);
  const perPage = 6;
  // ----------Xóa sp vừa thanh toán trên giỏ hàng-------------

  const queryParams = new URLSearchParams(location.search);
  const session_id = queryParams.get("session_id");

  // xóa giỏ hàng đã mua
  const dispatch = useDispatch();
  let cart_buy_1 = localStorage.getItem("cart_buy");
  cart_buy_1 = cart_buy_1 ? JSON.parse(cart_buy_1) : [];

  const { data: dataPayment, isSuccess: isVerifyPaymentSuccess } =
    useVerifyPaymentQuery(session_id, {
      skip: !session_id,
    });

  useEffect(() => {
    if (isVerifyPaymentSuccess && cart_buy_1.length > 0) {
      cart_buy_1.forEach((it) => {
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

  const { data, isFetching, refetch } = useGetOrdersByUserIdQuery();

  const totalItems = data?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / perPage);

  // Lọc dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * perPage;
  const selectedOrders = data?.data?.slice(startIndex, startIndex + perPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      navigate("/order-detail/1");
    }
  }, [currentPage, totalPages, navigate]);
  // ---------view-order----------------//
  // User xac nhan thanh toan
  const [
    updateReceived,
    { isSuccess: successReceived, isLoading: loadReceived },
  ] = useUpdateOrderByUserMutation();

  // useEffect(() => {
  //   if (successReceived) {
  //     toast.success("Xác nhận thành công");
  //     refetch();
  //   }
  // }, [successReceived]);

  async function handleReceived(iid) {
    try {
      const resRecei = await updateReceived({ orderId: iid });

      if (resRecei?.data?.success) {
        toast.success("Xác nhận nhận hàng thành công");
        setTimeout(() => {
          refetch();
        }, 1500);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xác nhận");
    }
  }

  // -----------------Cancel-order-----------------//
  const [cancelOrder, { isLoading: loadingCancel, isSuccess: successCancel }] =
    useCancelOrderUserMutation();

  async function handleCancelOrder(ooid) {
    try {
      const res = await cancelOrder({ orderId: ooid });
      // console.log(res);
      if (res?.data?.success) {
        console.log("Thanh cong");
        toast.success("Hủy đơn hàng thành công");
        setTimeout(() => {
          refetch();
        }, 1500);
      } else {
        toast.error("Không thể hủy đơn hàng");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi hủy đơn hàng");
    }
  }

  return (
    <WrapperPersonal onFooter={false}>
      {/* <div>
        <h3>Order</h3>
      </div> */}
      <Toaster position="top-right" />
      {!isFetching ? (
        totalItems > 0 ? (
          <div>
            <div className="list-order-user">
              <h3>Danh sách đơn hàng</h3>
            </div>
            <table className="table-order-details">
              <thead>
                <tr className="table-order-details-header">
                  <th className="table-header-cell">ID</th>
                  {/* <th className="table-header-cell">Payment Method</th> */}
                  <th className="table-header-cell">Trạng thái</th>
                  <th className="table-header-cell">Ngày đặt</th>
                  {/* <th className="table-header-cell">Delivery Date</th> */}
                  <th className="table-header-cell">Tổng số tiền</th>
                  <th className="table-header-cell">Chi tiết đơn</th>
                  <th className="table-header-cell">Đã nhận hàng</th>
                  <th className="table-header-cell">Hủy đơn</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrders.map((order) => (
                  <tr className="table-row-order-details" key={order?._id}>
                    <td className="table-cell">{order?._id || "Null"}</td>
                    <td className="table-cell status">
                      {order?.orderStatus === "pending" && (
                        <span>Đang chờ</span>
                      )}
                      {order?.orderStatus === "processing" && (
                        <span>Đã xác nhận</span>
                      )}
                      {order?.orderStatus === "shipped" && (
                        <span>Đang vận chuyển đến bạn</span>
                      )}
                      {order?.orderStatus === "delivered" && (
                        <span>Đã giao hàng tới bạn</span>
                      )}
                      {order?.orderStatus === "cancelled" && (
                        <span>Đã hủy</span>
                      )}
                    </td>
                    <td className="table-cell date-order">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell total-money">
                      {formatMoney(order?.totalAmount)}
                    </td>
                    <td className="table-cell">
                      <button
                        className="button-order-details"
                        onClick={() =>
                          navigate(`/order-detail/view/${order?._id}`)
                        }
                      >
                        Xem
                      </button>
                    </td>
                    <td className="table-cell">
                      {order?.orderStatus === "cancelled" && (
                        <p className="cancel-button">Đã hủy</p>
                      )}
                      {/* {order?.orderStatus === "delivered" && (
                        <p className="delivered-button">Delivered</p>
                      )} */}
                      {order?.orderStatus !== "cancelled" ? (
                        order?.deliveryDate && !order?.received ? (
                          <button
                            className="button-order-details"
                            onClick={() => {
                              // console.log(order?._id);
                              handleReceived(order?._id);
                            }}
                          >
                            {loadReceived ? <Spinner /> : "Đã nhận?"}
                          </button>
                        ) : (
                          <button className="button-order-details disabled">
                            Đã nhận?
                          </button>
                        )
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="table-cell">
                      {order?.orderStatus === "delivered" ||
                      order?.orderStatus === "cancelled" ? (
                        <button
                          className="button-order-details disabled"
                          disabled
                        >
                          Hủy
                        </button>
                      ) : (
                        <button
                          className="button-order-details "
                          style={{ background: "#f71919" }}
                          onClick={() => {
                            handleCancelOrder(order?._id);
                          }}
                        >
                          {loadingCancel ? <Spinner /> : "Hủy"}
                        </button>
                      )}
                      {/* <button className="button-order-details ">Cancel</button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={currentPage}
              perPage={perPage}
              count={totalItems}
              path="order-detail"
              theme="light"
              // onPageChange={(page) => navigate(`/order-detail/${page}`)}
            />
          </div>
        ) : (
          "No orders!"
        )
      ) : (
        <Spinner />
      )}
    </WrapperPersonal>
  );
};

export default OrderDetail;
