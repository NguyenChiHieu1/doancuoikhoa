import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Toaster, toast } from "react-hot-toast";
import * as Yup from "yup";
import Spinner from "../../components/Spinner";
import { useUpdateOrderByAdminMutation } from "../../store/service/orderService";

// Validation schema cho EditAddress
const addressSchema = Yup.object().shape({
  recipientName: Yup.string().required("Recipient Name is required"),
  recipientNumber: Yup.string()
    .required("Recipient Number is required")
    .matches(/^[0-9]{10,11}$/, "Must be a valid phone number"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  line1: Yup.string().required("Address Line 1 is required"),
  line2: Yup.string(),
  postal_code: Yup.string()
    .required("Postal Code is required")
    .matches(/^[0-9]{5,6}$/, "Must be a valid postal code"),
  state: Yup.string().required("State is required"),
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
        toast.success("Address updated successfully");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update address");
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
                Edit Address
              </h2>

              <div>
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="recipientName"
                >
                  Recipient Name:
                </label>
                <Field
                  type="text"
                  name="recipientName"
                  id="recipientName"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Recipient Name"
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
                  Recipient Number:
                </label>
                <Field
                  type="text"
                  name="recipientNumber"
                  id="recipientNumber"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Recipient Number"
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
                  Address line 1:
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
                  Địa chỉ dòng 2:
                </label>
                <Field
                  type="text"
                  name="line2"
                  id="line2"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Address Line 2"
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
                  City:
                </label>
                <Field
                  type="text"
                  name="city"
                  id="city"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="City"
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
                  State:
                </label>
                <Field
                  type="text"
                  name="state"
                  id="state"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="State"
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
                  Country:
                </label>
                <Field
                  type="text"
                  name="country"
                  id="country"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Country"
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
                  Postal Code:
                </label>
                <Field
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Postal Code"
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
                  {!isLoading ? "Save" : <Spinner />}
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
