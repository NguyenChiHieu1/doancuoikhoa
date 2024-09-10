import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useCreateBillMutation,
  useUpdateBillMutation,
} from "../../store/service/billService";
import { useGetFindOrdersQuery } from "../../store/service/orderService";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import formatMoney from "../../utils/formatMoney";

const CreateUpdateBill = ({ close, onClose, dataUpdate }) => {
  const [createBill, { isLoading: creating }] = useCreateBillMutation();
  const [updateBill, { isLoading: updating }] = useUpdateBillMutation();
  const { data: orders, isLoading: ordersLoading } = useGetFindOrdersQuery();

  const init = {
    order: "",
    amountDue: 0,
    paymentMethod: "",
    paymentStatus: "",
    billAddress: {},
    notes: "",
    isRefund: false,
    paymentDate: "",
  };

  const [initialValues, setInitialValues] = useState(init);

  useEffect(() => {
    if (dataUpdate && Object.keys(dataUpdate).length !== 0) {
      setInitialValues(dataUpdate);
    }
  }, [dataUpdate]);

  const handleCreateBill = async (values) => {
    try {
      await createBill({ ...values }).unwrap();
      toast.success("Tạo hóa đơn mới thành công!");
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      toast.error("Tạo hóa đơn mới thất bại.");
    }
  };

  const handleUpdateBill = async (values) => {
    try {
      await updateBill({
        orderId: dataUpdate.order._id,
        billData: { ...values },
      }).unwrap();
      toast.success("Cập nhật hóa đơn mới thành công!");
      onClose();
    } catch (error) {
      toast.error("Lỗi khi tạo hóa đơn.");
    }
  };

  const handleFormSubmit = (values) => {
    if (dataUpdate) {
      handleUpdateBill(values);
    } else {
      handleCreateBill(values);
    }
  };

  const validationSchema = Yup.object().shape({
    amountDue: Yup.number().required("Vui lòng nhập tổng giá tiền"),
    paymentMethod: Yup.string().required(
      "Vui lòng chọn phương thức thanh toán"
    ),
    paymentStatus: Yup.string().required("Vui lòng chọn trạng thái thanh toán"),
  });

  if (!close) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-roboto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl relative">
        <h2 className="text-center text-2xl font-bold text-indigo-600 mb-6">
          {dataUpdate ? "Cập nhật hóa đơn" : "Tạo hóa đơn mới"}
        </h2>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bill Information */}
              <div className="col-span-1">
                <h3 className="text-xl font-medium text-gray-700 mb-4">
                  Thông tin hóa đơn
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="order"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Mã đơn hàng
                  </label>
                  {dataUpdate ? (
                    <Field
                      type="text"
                      name="order"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      value={values?.order?._id}
                      readOnly
                    />
                  ) : (
                    <Field
                      as="select"
                      name="order"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      onChange={(e) => {
                        const selectedOrderId = e.target.value;
                        const order = orders?.data?.find(
                          (o) => o._id === selectedOrderId
                        );
                        if (order) {
                          setFieldValue("order", order._id);
                          setFieldValue("amountDue", order.totalAmount);
                          setFieldValue("paymentMethod", order.paymentMethod);
                          setFieldValue("billAddress", order.shippingAddress);
                          setFieldValue("notes", order.notes);
                        }
                      }}
                    >
                      <option value="">Chọn đơn hàng</option>
                      {ordersLoading ? (
                        <option value="">Đang tải...</option>
                      ) : (
                        orders?.data?.map((order) => (
                          <option key={order._id} value={order._id}>
                            {`Mã đơn hàng: ${order._id} - Người mua: ${order.customer.fullName}`}
                          </option>
                        ))
                      )}
                    </Field>
                  )}
                  <ErrorMessage
                    name="order"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="amountDue"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Tổng tiền
                  </label>
                  <Field
                    name="amountDue"
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    value={formatMoney(values.amountDue)}
                    readOnly
                  />
                  <ErrorMessage
                    name="amountDue"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="col-span-1">
                <h3 className="text-xl font-medium text-gray-700 mb-4">
                  Thông tin thanh toán
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Phương thức thanh toán:
                  </label>
                  <Field
                    as="select"
                    name="paymentMethod"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    disabled
                  >
                    <option value="">Chọn phương thức thanh toán</option>
                    <option value="COD">Thanh toán khi nhận hàng</option>
                    <option value="card">Thanh toán bằng thẻ</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                  </Field>
                  <ErrorMessage
                    name="paymentMethod"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="paymentStatus"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Trạng thái thanh toán:
                  </label>
                  <Field
                    as="select"
                    name="paymentStatus"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Chọn trạng thái thanh toán</option>
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Lỗi thanh toán</option>
                    <option value="refund">Hoàn tiền</option>
                  </Field>
                  <ErrorMessage
                    name="paymentStatus"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="paymentDate"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Ngày thanh toán:
                  </label>
                  <Field
                    name="paymentDate"
                    type="date"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    value={
                      values.paymentDate
                        ? new Date(values.paymentDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFieldValue("paymentDate", e.target.value)
                    }
                  />
                  <ErrorMessage
                    name="paymentDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <label
                    htmlFor="isRefund"
                    className="block text-sm font-medium text-gray-600 mr-2"
                  >
                    Đã hoàn tiền?
                  </label>
                  <Field
                    name="isRefund"
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600"
                    checked={values.isRefund}
                    onChange={(e) =>
                      setFieldValue("isRefund", e.target.checked)
                    }
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-center mt-8">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
                >
                  {creating || updating ? (
                    <Spinner />
                  ) : dataUpdate ? (
                    "Cập nhật"
                  ) : (
                    "Tạo mới"
                  )}
                </button>
                <button
                  type="button"
                  className="ml-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                  onClick={onClose}
                  disabled={creating || updating}
                >
                  Thoát
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateUpdateBill;
