import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import { useGetOrdersByAdminIdQuery } from "../../store/service/orderService";
import formatMoney from "../../utils/formatMoney";
import discount from "../../utils/discount";
import EditAddressOrder from "../../components/dashboard/EditAddressOrder";
import ReactToPrint from "react-to-print";

const DetailOrder = () => {
  const { oid } = useParams(); // Get order ID from URL parameters
  const navigate = useNavigate();
  const componentRef = useRef();

  const { data, isFetching, error, refetch } = useGetOrdersByAdminIdQuery({
    oid,
  });
  const [value, setValue] = useState("");
  if (isFetching) return <Spinner />;
  if (error)
    return <p className="text-red-500">Lỗi khi tải dữ liệu cho đơn hàng</p>;

  const order = data?.data;

  const onEditAddress = () => {
    setValue(order?.shippingAddress);
  };

  return (
    <AdminHome>
      <ScreenHeader>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => navigate(-1)} // Go back to the previous page
        >
          <i className="bi bi-arrow-left text-2xl"></i>
        </button>
        <ReactToPrint
          trigger={() => (
            <div className="print-bill-order-user">
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
      </ScreenHeader>

      {order ? (
        <div className="bg-white shadow-md rounded pl-6" ref={componentRef}>
          <h3 className="text-2xl font-bold mb-4 text-slate-600">
            Chi tiết đơn hàng
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="mb-4 flex flex-col bg-indigo-50 p-5">
              <h4 className="text-xl font-semibold pb-2 text-slate-400">
                Thông tin khách hàng
              </h4>
              <span className="text-sm pl-4 pb-2">
                Tên khách hàng: <b> {order?.customer?.fullName}</b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Địa chỉ email: <b>{order?.customer?.email} </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Số điện thoại: <b>{order?.customer?.phoneNumber || "null"}</b>
              </span>
            </div>
            <div className="mb-4 flex flex-col bg-purple-50 p-5">
              <h4 className="text-xl font-semibold pb-2 text-slate-400">
                Thông tin đơn hàng
              </h4>
              <span className="text-sm pl-4 pb-2 ">
                Mã đơn hàng: <b>{order?._id || "null"} </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Số tiền thanh toán:{" "}
                <b className="text-red-600  text-lg">
                  {formatMoney(order?.totalAmount) || 0}
                </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Ngày mua hàng:{" "}
                <b>
                  {order?.createdAt
                    ? new Date(order?.createdAt).toLocaleDateString()
                    : "N/A"}
                </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Ngày thanh toán:{" "}
                <b className=" uppercase">{order?.paymentMethod || "null"}</b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Tình trạng đơn hàng:{" "}
                <b className="text-red-600 uppercase">
                  {order?.orderStatus || "null"}
                </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Ngày giao hàng:{" "}
                <b className="text-red-600">
                  {order?.deliveryDate
                    ? new Date(order?.deliveryDate).toLocaleDateString()
                    : "N/A"}
                </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Ngày nhận hàng:{" "}
                <b className="text-red-600">
                  {order?.receivedDay
                    ? new Date(order?.receivedDay).toLocaleDateString()
                    : "N/A"}
                </b>
              </span>
            </div>
            <div className="mb-4 flex flex-col bg-indigo-50 p-5">
              <div className="flex justify-between">
                <h4 className="text-xl font-semibold pb-2 text-slate-400">
                  Địa chỉ nhận hàng
                </h4>
                <button
                  className="btn btn-warning mr-1.5 px-4 py-1 no-print"
                  onClick={() => onEditAddress(order?._id)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
              <span className="text-sm pl-4 pb-2">
                Tên người nhận:{" "}
                <b>{order?.shippingAddress?.recipientName || "null"}</b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Số điện thoại người nhận:{" "}
                <b>+{order?.shippingAddress?.recipientNumber || "null"}</b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Địa chỉ nhận hàng 1:{" "}
                <b>
                  {`${order?.shippingAddress?.line1}, ${order?.shippingAddress?.city}, ${order?.shippingAddress?.country}` ||
                    "null"}
                </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Địa chỉ nhận hàng 2:{" "}
                <b>
                  {order?.shippingAddress?.line2
                    ? `${order?.shippingAddress?.line2}, ${order?.shippingAddress?.city}, ${order?.shippingAddress?.country}`
                    : "null"}
                </b>
              </span>
              <span className="text-sm pl-4 pb-2">
                Mã bưu điện:{" "}
                <b>{order?.shippingAddress?.postal_code || "null"}</b>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold">Sản phẩm đã mua</h4>
            <table className="w-full table-auto border-collapse">
              <thead className="bg-slate-100">
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-medium uppercase">Ảnh</th>
                  <th className="p-3 text-left font-medium uppercase">
                    Tên sản phẩm
                  </th>
                  <th className="p-3 text-left font-medium uppercase">
                    Số lượng
                  </th>
                  <th className="p-3 text-left font-medium uppercase">Giá</th>
                  <th className="p-3 text-left font-medium uppercase">
                    Giảm giá
                  </th>
                  <th className="p-3 text-left font-medium uppercase">
                    Tông tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.items?.map((product, index) => (
                  <tr key={index} className="border-b border-gray-200  ">
                    <td className="p-3 w-5 h-5 bg-white rounded-full ">
                      <img
                        src={product?.productId?.images?.[0]}
                        alt="iamge_product"
                      />
                    </td>
                    <td className="p-3 w-80">{product?.name}</td>
                    <td className="p-3">{product?.quantity}</td>
                    <td className="p-3">{formatMoney(product?.price)}</td>
                    <td className="p-3">{product?.discount}%</td>
                    <td className="p-3">
                      {formatMoney(
                        discount(product?.price, product?.discount) *
                          product?.quantity
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={() => navigate(-1)}
          >
            Send mail
          </button> */}
        </div>
      ) : (
        <p>Không tìm thấy chi tiết đơn hàng!</p>
      )}
      {value && (
        <EditAddressOrder
          onClose={() => {
            refetch();
            setValue("");
          }}
          oid={order?._id}
          shippingAddress={value}
        />
      )}
    </AdminHome>
  );
};

export default DetailOrder;
