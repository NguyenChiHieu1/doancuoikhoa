import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import {
  useGetBillsQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
} from "../../store/service/billService";
import CreateUpdateBill from "./CreateUpdateBill";
import formatMoney from "../../utils/formatMoney";

const Bill = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [close, setClose] = useState(false);
  const [valueUpdate, setValueUpdate] = useState({});
  const navigate = useNavigate();
  const { page = 1 } = useParams();
  const [valuePage, setValuePage] = useState(page);
  const [paymentStatus, setPaymentStatus] = useState("");

  const {
    data: billData,
    refetch,
    isFetching,
    isLoading: loadGetBills,
  } = useGetBillsQuery({
    page: valuePage,
    limit: 6,
    ...(searchValue && { idOrder: searchValue }),
    ...(paymentStatus && { paymentStatus: paymentStatus }),
  });

  const [createBill, { isSuccess: isCreateSuccess }] = useCreateBillMutation();
  const [updateBill, { isSuccess: isUpdateSuccess }] = useUpdateBillMutation();
  const [deleteBill, { isSuccess: isDeleteSuccess }] = useDeleteBillMutation();

  const onChangeInput = (e) => {
    setValuePage(0);
    setSearchValue(e.target.value);
  };

  const onChangeSort = (field) => {
    setSortValue(sortValue === `-${field}` ? field : `-${field}`);
  };

  const confirmBillHandler = async (id) => {
    if (window.confirm("Bạn có chắc chắn đơn hàng trên đã thanh toán?")) {
      try {
        await updateBill({
          id,
          billData: { paymentStatus: "paid", paymentDate: new Date() },
        });
        toast.success("Cập nhật đơn hàng thành công!!!");
        refetch();
      } catch (error) {
        toast.error("Lỗi cập nhật đơn hàng!!!");
      }
    }
  };

  const deleteBillHandler = async (id) => {
    if (window.confirm("Bạn có chắc chắn xóa đơn hàng này không?")) {
      try {
        await deleteBill(id);
        toast.success("Xóa đơn hàng thành công !!!");
        refetch();
      } catch (error) {
        toast.error("Lỗi xóa đơn hàng!!!");
      }
    }
  };

  // const detailBill = (id) => navigate(`/dashboard/bills/detail/${id}`);

  useEffect(() => {
    refetch();
  }, [searchValue, refetch]);

  // Check button refund
  function refundButtonCheck(orderStatus, paymentStatus, isRefund) {
    if (
      isRefund === false &&
      orderStatus === "cancelled" &&
      paymentStatus === "paid"
    ) {
      return true;
    }
    return false;
  }

  //Check button paid
  function paidButtonCheck(orderStatus, paymentStatus, billMethod) {
    if (
      orderStatus === "cancelled" ||
      paymentStatus === "paid" ||
      paymentStatus === "refund"
    ) {
      return false;
    }
    if (billMethod === "COD" && orderStatus === "delivered") {
      return true;
    }

    return true;
  }

  //Check button failed

  //   button update
  const buttonUpdateStatus = async (orderId, billData) => {
    try {
      if (orderId && billData) {
        await updateBill({
          orderId: orderId,
          billData: { paymentStatus: billData },
        });
        refetch();
        toast.success("Cập nhật hoàn tiền thành công");
      } else {
        // console.log("thieu value in");
        toast.error("Lỗi cập nhật hoàn tiền");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật hoàn tiền");
    }
  };

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-end">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => setClose(true)}
          >
            <i className="bi bi-plus-lg text-lg"></i>
          </button>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <input
              type="text"
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
              value={paymentStatus}
              className="p-2 border rounded-lg w-50"
              onChange={(e) => {
                setSearchValue("");
                setValuePage(0);
                setPaymentStatus(e.target.value);
              }}
            >
              <option value="">Lọc theo trạng thái thanh toán</option>
              <option value="pending">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="failed">Lỗi thanh toán</option>
              <option value="refund">Hoàn tiền</option>
            </select>
          </div>
        </div>
        <Toaster position="top-right" />
      </ScreenHeader>
      {!isFetching ? (
        billData?.data?.length > 0 ? (
          <div>
            <table className="w-full bg-slate-300 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  {/* <th className="p-3 uppercase text-xs text-black-500 font-bold">
                    ID
                  </th> */}
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Mã đơn hàng
                  </th>
                  {/* <th className="p-3 uppercase text-xs font-bold text-black-500">
                    <span>Số tiền thanh toán</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-amountDue` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`amountDue`)}
                    ></i>
                  </th> */}
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Trạng thái đơn hàng
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    <span>Trạng thái thanh toán</span>
                    {/* <i
                      className={`bi bi-arrow-${
                        sortValue === `-paymentStatus` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`paymentStatus`)}
                    ></i> */}
                  </th>

                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Ngày thanh toán
                  </th>
                  {/* <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Address
                  </th> */}
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Xác nhận thanh toán
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Xác nhận hoàn tiền
                  </th>

                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Hỗ trợ
                  </th>
                </tr>
              </thead>
              <tbody>
                {billData?.data?.map((bill) => (
                  <tr className="odd:bg-slate-100" key={bill?._id}>
                    {/* <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {bill?._id || "Null"}
                    </td> */}
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {bill?.idOrder || "Null"}
                    </td>
                    {/* <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {formatMoney(bill?.amountDue) || 0}
                    </td> */}
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {bill?.order?.orderStatus === "pending" && (
                        <span>Đang chờ</span>
                      )}
                      {bill?.order?.orderStatus === "processing" && (
                        <span>Đã xác nhận</span>
                      )}
                      {bill?.order?.orderStatus === "shipped" && (
                        <span>Đang giao hàng</span>
                      )}
                      {bill?.order?.orderStatus === "delivered" && (
                        <span>Giao hàng thành công</span>
                      )}
                      {bill?.order?.orderStatus === "cancelled" && (
                        <span>Hủy đơn</span>
                      )}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-medium text-indigo-600 ">
                      {bill?.paymentStatus === "pending" && (
                        <span>Đang chờ</span>
                      )}
                      {bill?.paymentStatus === "paid" && (
                        <span>Đã thanh toán</span>
                      )}
                      {bill?.paymentStatus === "failed" && (
                        <span className="text-red-600 font-bold">
                          Lỗi thanh toán
                        </span>
                      )}
                      {bill?.paymentStatus === "refund" && (
                        <span className="text-orange-600 font-bold">
                          Hoàn tiền
                        </span>
                      )}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {bill?.paymentDate
                        ? new Date(bill?.paymentDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    {/* <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {bill?.billAddress?.line1}
                    </td> */}
                    <td className="p-3 capitalize text-sm text-left font-normal flex flex-row gap-2">
                      <button
                        className={`rounded-md px-4 py-1 text-xl ${
                          paidButtonCheck(
                            bill?.order?.orderStatus,
                            bill?.paymentStatus,
                            bill?.paymentMethod
                          )
                            ? "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-400 hover:text-black2"
                            : "bg-gray-500 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={
                          !paidButtonCheck(
                            bill?.order?.orderStatus,
                            bill?.paymentStatus,
                            bill?.paymentMethod
                          )
                        }
                        onClick={() =>
                          buttonUpdateStatus(bill?.order?._id, "paid")
                        }
                      >
                        <i className="bi bi-check"></i>
                      </button>
                      <button
                        className={`rounded-md px-4 py-1 text-xl ${
                          bill?.paymentStatus === "pending"
                            ? "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-400 hover:text-black2"
                            : "bg-gray-500 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={bill?.paymentStatus !== "pending"}
                        onClick={() =>
                          buttonUpdateStatus(bill?.order?._id, "failed")
                        }
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </td>
                    <td className="p-3 capitalize text-sm font-normal">
                      {/* Hoàn trả */}
                      <button
                        className={`rounded-md px-4 py-1 text-xl ${
                          refundButtonCheck(
                            bill?.order?.orderStatus,
                            bill?.paymentStatus,
                            bill?.isRefund
                          ) === true
                            ? "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-400 hover:text-black2"
                            : "bg-gray-500 text-white cursor-not-allowed"
                        }`}
                        disabled={
                          !refundButtonCheck(
                            bill?.order?.orderStatus,
                            bill?.paymentStatus,
                            bill?.isRefund
                          )
                        }
                        onClick={() =>
                          buttonUpdateStatus(bill?.order?._id, "refund")
                        }
                      >
                        <i className="bi bi-currency-dollar"></i>
                      </button>
                    </td>

                    {/* Sửa-Xóa */}
                    <td className="p-3 capitalize text-sm text-left font-normal flex flex-row">
                      <button
                        className="btn bg-orange-400 py-1 mr-2 px-5 hover:bg-orange-600 "
                        onClick={() => {
                          setValueUpdate(bill);
                          setClose(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="rounded-md px-4 py-1 text-xl bg-red-600 cursor-pointer text-white hover:bg-red-400 hover:text-black2"
                        onClick={() => deleteBillHandler(bill?._id)}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-20 flex flex-row p-2  0 mb-2 ">
              <label className="" htmlFor="total_counts">
                Total:
              </label>
              <input
                id="total_counts"
                className="w-8 border-none"
                value={billData?.counts}
                readOnly
              />
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={6}
              count={billData?.counts}
              path="dashboard/bills"
              theme="light"
            />
          </div>
        ) : (
          "No bills found!"
        )
      ) : (
        <Spinner />
      )}

      {close && Object.keys(valueUpdate).length === 0 && (
        <CreateUpdateBill close={close} onClose={() => setClose(false)} />
      )}
      {close && Object.keys(valueUpdate).length !== 0 && (
        <CreateUpdateBill
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

export default Bill;
