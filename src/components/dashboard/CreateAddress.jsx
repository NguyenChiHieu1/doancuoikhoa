import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Toaster, toast } from "react-hot-toast";
import * as Yup from "yup";
import Spinner from "../Spinner";
import { useCreateAddressMutation } from "../../store/service/addressService";

// Validation schema cho EditAddress
const addressSchema = Yup.object().shape({
  street: Yup.string().required("Street is required"),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  type: Yup.string(),
});

const CreateAddress = ({ onClose }) => {
  const [createAddress, { isSuccess, isLoading }] = useCreateAddressMutation();

  const handleFormSubmit = async (values) => {
    console.log(values);
    try {
      await createAddress({ ...values });
    } catch (error) {
      toast.error("Lỗi khi tạo địa chỉ");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Tạo địa chỉ mới thành công");
    } else {
      toast.error("Tạo địa chỉ mới thất bại");
    }
  }, [isSuccess]);
  let init = {
    street: "",
    district: "",
    city: "",
    country: "",
    type: "",
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
          initialValues={init}
          validationSchema={addressSchema}
          onSubmit={handleFormSubmit}
        >
          {() => (
            <Form className="grid grid-cols-2 gap-x-4">
              <h2 className="text-center text-blue-600 text-xl font-semibold mb-5 col-span-2">
                Tạo địa chỉ
              </h2>

              <div className="col-span-2">
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="street"
                >
                  Tên đường:
                </label>
                <Field
                  type="text"
                  name="street"
                  id="street"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập tên đường"
                />
                <ErrorMessage
                  name="street"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div className="col-span-2">
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="district"
                >
                  Tên huyện:
                </label>
                <Field
                  type="text"
                  name="district"
                  id="district"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Vui lòng nhập tên huyện"
                />
                <ErrorMessage
                  name="district"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div className="col-span-1">
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="city"
                >
                  Tên thành phố:
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

              <div className="col-span-1">
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="country"
                >
                  Tên quốc gia:
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

              <div className="col-span-2">
                <label
                  className="mb-2 text-blue-600 font-semibold"
                  htmlFor="type"
                >
                  Loại địa chỉ:
                </label>
                <Field
                  type="text"
                  name="type"
                  id="type"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  placeholder="Kiểu: Home, Company, ..."
                />
                <ErrorMessage
                  name="type"
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

export default CreateAddress;
