import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import formatMoney from "../../utils/formatMoney";
import {
  useGetOrdersQuery,
  useUpdateOrderByAdminMutation,
  useDeleteOrderMutation,
} from "../../store/service/orderService";
import CreateUpdateOrder from "./CreateUpdateOrder";
const Order = () => {
  const { page = 1 } = useParams();

  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const navigate = useNavigate();
  const [close, setClose] = useState(false);
  const [valueUpdate, setValueUpdate] = useState({});
  const [orrderStatus, setOrderStatus] = useState("");
  const [valuePage, setValuePage] = useState(page);
  // const [orrderStatus, setOrderStatus] = useState("");
  const onChangeInput = (e) => {
    setValuePage(0);
    setSearchValue(e.target.value);
    setOrderStatus("");
  };

  const onChangeSort = (field) => {
    if (sortValue === `-${field}`) {
      setSortValue(field);
    } else {
      setSortValue(`-${field}`);
    }
  };

  const {
    data,
    refetch,
    isFetching,
    isLoading: loadGetOrders,
  } = useGetOrdersQuery({
    page: valuePage,
    limit: 6,
    ...(searchValue && { idOrder: searchValue }),
    ...(sortValue && { sort: sortValue }),
    ...(orrderStatus && { orderStatus: orrderStatus }),
  });

  const [updateOrderByAdmin, { isSuccess: isUpdateSuccess }] =
    useUpdateOrderByAdminMutation();
  const [deleteOrderAdmin, { isSuccess: isDeleteSuccess }] =
    useDeleteOrderMutation();

  const confirmOrderHandler = async (id) => {
    if (window.confirm("Bạn muốn xác nhận đơn hàng?")) {
      try {
        await updateOrderByAdmin({
          orderId: id,
          orderData: {
            orderStatus: "processing",
          },
        });
        toast.success("Xác nhận đơn hàng thành công");
        refetch();
      } catch (error) {
        toast.error("Lỗi xác nhận đơn hàng");
      }
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Bạn muốn xóa đơn hàng?")) {
      try {
        await deleteOrderAdmin(id);
        toast.success("Xóa đơn hàng thành công");
        setTimeout(() => {
          refetch();
        }, [2000]);
      } catch (error) {
        toast.error("Xóa đơn hàng thất  bại");
      }
    }
  };

  const detailOrder = (oid) => {
    navigate(`/dashboard/orders/detail/${oid}`);
  };

  useEffect(() => {
    refetch();
  }, [searchValue, refetch]);

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-end">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <i
              className="bi bi-plus-lg text-lg"
              onClick={() => {
                setClose(true);
              }}
            ></i>
          </button>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <input
              type="text"
              value={searchValue}
              placeholder="Tìm kiếm theo mã đơn hàng..."
              className="py-2 px-4 w-full outline-none"
              onChange={onChangeInput}
            />
            <div className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-slate-300 cursor-pointer bg-slate-200">
              <i className="bi bi-search text-lg"></i>
            </div>
          </div>
          <div className=" flex flex-end">
            <select
              value={orrderStatus}
              className="p-2 border rounded-lg w-36"
              onChange={(e) => {
                setSearchValue("");
                setValuePage(0);
                setOrderStatus(e.target.value);
              }}
            >
              <option value="">Lọc theo tình trạng</option>
              <option value="pending">Đang chờ</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang vận chuyển</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
        <Toaster position="top-right" />
      </ScreenHeader>
      {!isFetching ? (
        data?.data?.length > 0 ? (
          <div>
            <table className="w-full bg-slate-300 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="p-3 uppercase text-xs text-black-500 font-bold">
                    Mã đơn hàng
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Email khách
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    <span>Tổng tiền</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-totalAmount` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`totalAmount`)}
                    ></i>
                  </th>
                  {/* <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Payment Method
                  </th> */}
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    <span>Trạng thái đơn hàng</span>
                    {/* <i
                      className={`bi bi-arrow-${
                        sortValue === `-orderStatus` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`orderStatus`)}
                    ></i> */}
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    <span>Ngày mua</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === "-createdAt" ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort("createdAt")}
                    ></i>
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Ngày giao hàng
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Xác nhận
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Chi tiết
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500"></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((order, index) => (
                  <tr className="odd:bg-slate-100" key={order?._id}>
                    <td
                      className="p-3 capitalize text-sm text-left font-normal text-black"
                      // style={{
                      //   maxWidth: "10rem",
                      //   overflowX: "auto",
                      //   whiteSpace: "nowrap",
                      // }}
                    >
                      {order?.idOrder || "Null"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?.customer?.fullName || "Null"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {formatMoney(order?.totalAmount) || 0}
                    </td>
                    {/* <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?.paymentMethod}
                    </td> */}
                    <td className="p-3 capitalize text-sm text-left text-indigo-600 font-normal ">
                      {order?.orderStatus === "pending" && (
                        <span>Đang chờ</span>
                      )}
                      {order?.orderStatus === "processing" && (
                        <span>Đã xác nhận</span>
                      )}
                      {order?.orderStatus === "shipped" && (
                        <span>Đang giao hàng</span>
                      )}
                      {order?.orderStatus === "delivered" && (
                        <span>Giao hàng thành công</span>
                      )}
                      {order?.orderStatus === "cancelled" && (
                        <span className="text-red-500">Hủy đơn</span>
                      )}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?.createdAt
                        ? new Date(order?.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?.deliveryDate
                        ? new Date(order?.deliveryDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal">
                      <button
                        className={`rounded-md px-4 py-1 text-xl ${
                          order?.orderStatus === "pending"
                            ? "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-800"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          order?.orderStatus !== "processing" &&
                          confirmOrderHandler(order?._id)
                        }
                        disabled={order?.orderStatus !== "pending"}
                      >
                        <i className="bi bi-check"></i>
                      </button>
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal">
                      <button
                        className=" rounded-md cursor-pointer text-white bg-indigo-600 px-5 py-2 hover:bg-indigo-800 "
                        onClick={() => detailOrder(order?._id)}
                      >
                        <i className="bi bi-eye "></i>
                      </button>
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal flex flex-row">
                      <button
                        className="btn bg-orange-400 py-1 mr-2 px-5 hover:bg-orange-600 "
                        onClick={() => {
                          setValueUpdate(order);
                          setClose(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="bg-red-500 text-white px-5 py-1 rounded hover:bg-red-600"
                        onClick={() => {
                          console.log(order?._id);
                          deleteOrder(order?._id);
                        }}
                      >
                        <i className="bi bi-trash text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-20 flex flex-row p-2  0 mb-2 ">
              <label className="" htmlFor="total_counts">
                Tổng:
              </label>
              <input
                id="total_counts"
                className="w-8 border-none"
                value={data?.counts}
                readOnly
              />
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={6}
              count={data.counts}
              path="dashboard/orders"
              theme="light"
            />
          </div>
        ) : (
          "No orders!"
        )
      ) : (
        <Spinner />
      )}
      {close && Object.keys(valueUpdate).length === 0 && (
        <CreateUpdateOrder close={close} onClose={() => setClose(false)} />
      )}
      {close && Object.keys(valueUpdate).length !== 0 && (
        <CreateUpdateOrder
          close={close}
          onClose={() => {
            setClose(false);
            setValueUpdate({});
            // refetch();
          }}
          dataUpdate={valueUpdate}
        />
      )}
    </AdminHome>
  );
};

export default Order;
