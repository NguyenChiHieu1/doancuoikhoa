import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Toaster, toast } from "react-hot-toast";
import * as Yup from "yup";
import Spinner from "../../components/Spinner";
import { useUpdateOrderByAdminMutation } from "../../store/service/orderService";

// Validation schema cho EditAddress
const addressSchema = Yup.object().shape({
  recipientName: Yup.string().required("Vui lòng nhập tên người nhận"),
  recipientNumber: Yup.string()
    .required("Vui lòng nhập số điện thoại người nhận")
    .matches(/^[0-9]{10,11}$/, "Vui lòng nhập đúng định dạng số điện thoại"),
  city: Yup.string().required("Vui lòng nhập tên thành phố"),
  country: Yup.string().required("Vui lòng nhập tên nước"),
  line1: Yup.string().required("Vui lòng nhập địa chỉ nhận hàng"),
  line2: Yup.string(),
  postal_code: Yup.string()
    .required("Vui lòng nhập mã bưu điện")
    .matches(/^[0-9]{5,6}$/, "Vui lòng nhập đúng định dạng"),
  state: Yup.string().required("Vui lòng nhập tên tỉnh"),
});

const EditAddressOrder = ({ onClose, oid, shippingAddress }) => {
  const [updateOrderByAdmin, { isSuccess: isUpdateSuccess, isLoading }] =
    useUpdateOrderByAdminMutation();

  const handleFormSubmit = async (values) => {
    let shippingAddress = values;
    console.log(shippingAddress);
    try {
      await updateOrderByAdmin({
        orderId: oid,
        orderData: { shippingAddress },
      });
      if (isUpdateSuccess) {
        toast.success("Cập nhật địa chỉ thành công");
        onClose();
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật địa chỉ");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg cursor-pointer hover:bg-red-600"
          onClick={onClose}
        >
          X
        </button>
        <Formik
          initialValues={shippingAddress}
          validationSchema={addressSchema}
          onSubmit={handleFormSubmit}
        >
          {() => (
            <Form className="grid grid-cols-2 gap-x-4">
              <h2 className="text-center text-blue-600 text-xl font-semibold mb-5 col-span-2">
                Cập nhật địa chỉ
              </h2>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="recipientName"
                >
                  Tên người nhận:
                </label>
                <Field
                  type="text"
                  name="recipientName"
                  id="recipientName"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập tên người nhận"
                />
                <ErrorMessage
                  name="recipientName"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="recipientNumber"
                >
                  Số điện thoại người nhận:
                </label>
                <Field
                  type="text"
                  name="recipientNumber"
                  id="recipientNumber"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập số điện thoại người nhận"
                />
                <ErrorMessage
                  name="recipientNumber"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="line1"
                >
                  Địa chỉ nhận hàng:
                </label>
                <Field
                  type="text"
                  name="line1"
                  id="line1"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Address Line 1"
                />
                <ErrorMessage
                  name="line1"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="line2"
                >
                  Địa chỉ dự phòng:
                </label>
                <Field
                  type="text"
                  name="line2"
                  id="line2"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập địa chỉ dự phòng"
                />
                <ErrorMessage
                  name="line2"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="city"
                >
                  Thành phố:
                </label>
                <Field
                  type="text"
                  name="city"
                  id="city"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập tên thành phố"
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="state"
                >
                  Tỉnh:
                </label>
                <Field
                  type="text"
                  name="state"
                  id="state"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập tên tỉnh"
                />
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="country"
                >
                  Quốc gia:
                </label>
                <Field
                  type="text"
                  name="country"
                  id="country"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập tên quốc gia"
                />
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="postal_code"
                >
                  Mã bưu điện:
                </label>
                <Field
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập mã bưu điển"
                />
                <ErrorMessage
                  name="postal_code"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div className="flex justify-center col-span-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-indigo-700 mt-8"
                >
                  {!isLoading ? "Lưu lại" : <Spinner />}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditAddressOrder;
