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

const Order = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    setSearchValue(e.target.value);
  };

  const onChangeSort = (field) => {
    if (sortValue === `-${field}`) {
      setSortValue(field);
    } else {
      setSortValue(`-${field}`);
    }
  };

  const { page = 1 } = useParams();
  const {
    data,
    refetch,
    isFetching,
    isLoading: loadGetOrders,
  } = useGetOrdersQuery({
    page: page,
    limit: 5,
    ...(searchValue && { _id: searchValue }),
    ...(sortValue && { sort: sortValue }),
  });

  const [updateOrderByAdmin, { isSuccess: isUpdateSuccess }] =
    useUpdateOrderByAdminMutation();
  const [deleteOrderAdmin, { isSuccess: isDeleteSuccess }] =
    useDeleteOrderMutation();

  const confirmOrderHandler = async (id) => {
    if (window.confirm("Are you sure you want to confirm this order?")) {
      try {
        await updateOrderByAdmin({
          orderId: id,
          orderData: {
            orderStatus: "processing",
          },
        });
        toast.success("Order confirmed successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to confirm order");
      }
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to confirm this order?")) {
      try {
        await deleteOrderAdmin({
          orderId: id,
        });
        toast.success("Order delete successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete order");
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
          {/* <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <Link to="/dashboard/orders/create">
              <i className="bi bi-plus-lg text-lg"></i>
            </Link>
          </button> */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <input
              type="text"
              placeholder="Search..."
              className="py-2 px-4 w-full outline-none"
              onChange={onChangeInput}
            />
            <div className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-slate-300 cursor-pointer bg-slate-200">
              <i className="bi bi-search text-lg"></i>
            </div>
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
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    ID
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    Customer
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    <span>Total Amount</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-totalAmount` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`totalAmount`)}
                    ></i>
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    Payment Method
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    <span>Order Status</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-orderStatus` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`orderStatus`)}
                    ></i>
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    Delivery Date
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    Confime
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    Detail
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-black-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((order, index) => (
                  <tr className="odd:bg-slate-100" key={order?._id}>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?._id || "Null"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?.customer?.name || "Null"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {formatMoney(order?.totalAmount) || 0}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?.paymentMethod}
                    </td>
                    <td className="p-3 capitalize text-sm text-left text-indigo-600 font-normal ">
                      {order?.orderStatus}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {order?.deliveryDate
                        ? new Date(order?.deliveryDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal">
                      <button
                        className={`btn px-4 py-1 text-xl ${
                          order?.orderStatus === "processing"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-400 hover:text-black2"
                        }`}
                        onClick={() =>
                          order?.orderStatus !== "processing" &&
                          confirmOrderHandler(order?._id)
                        }
                        disabled={order?.orderStatus === "proccess"}
                      >
                        <i className="bi bi-check"></i>
                      </button>
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal">
                      <button
                        className="btn btn-success cursor-pointer text-white bg-indigo-600 hover:bg-indigo-400 hover:text-black px-4 py-2"
                        onClick={() => detailOrder(order?._id)}
                      >
                        <i className="bi bi-eye "></i>
                      </button>
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal ">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteOrder(order?._id)}
                      >
                        <i className="bi bi-trash text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={parseInt(page)}
              perPage={5}
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
    </AdminHome>
  );
};

export default Order;
