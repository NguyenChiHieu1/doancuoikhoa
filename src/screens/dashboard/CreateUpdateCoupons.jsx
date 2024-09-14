import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "../../store/service/couponService";
import { useGetAllProductsQuery } from "../../store/service/productService";
import { Toaster, toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";

const CreateUpdateCoupons = ({ close, onClose, dataUpdate }) => {
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const { data: products, isLoading: productsLoading } =
    useGetAllProductsQuery();

  const initialValues = {
    name: "",
    code: "",
    discount: 0,
    status: true,
    expiryDate: "",
    discountProduct: [],
  };

  const [initialValuess, setInitialValuess] = useState(initialValues);
  const [image, setImage] = useState("");
  const [view, setPreview] = useState(dataUpdate?.image);
  // const [productId, setProductId] = useState([]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (dataUpdate) {
      setInitialValuess({
        ...dataUpdate,
        // Đảm bảo rằng discountProduct là một mảng của các ID sản phẩm đã chọn
        discountProduct: dataUpdate.discountProduct || [],
      });
      console.log(dataUpdate.discountProduct);
      // setProductId(dataUpdate.discountProduct);
    }
  }, [dataUpdate]);

  const handleCreateCoupon = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("discount", values.discount);
      formData.append("status", values.status);
      formData.append("expiryDate", values.expiryDate);
      values.discountProduct.map((item, index) => {
        formData.append(`discountProduct[${index}]`, item);
      });
      if (image) {
        formData.append("image", image);
      }

      await createCoupon(formData).unwrap();
      toast.success("Tạo mã giảm giá thành công!");
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Lỗi tạo mã giảm giá.");
    }
  };

  const handleUpdateCoupon = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("discount", values.discount);
      formData.append("status", values.status);
      formData.append("expiryDate", values.expiryDate);
      values.discountProduct.map((item, index) => {
        formData.append(`discountProduct[${index}]`, item);
      });
      if (image) {
        formData.append("image", image);
      }
      await updateCoupon({
        cid: dataUpdate._id,
        updatedCoupon: formData,
      }).unwrap();
      toast.success("Cập nhật mã giảm giá thành công!");
      onClose();
    } catch (error) {
      toast.error("Lỗi cập nhật mã giảm giá.");
    }
  };

  const handleFormSubmit = async (values) => {
    if (dataUpdate) {
      handleUpdateCoupon(values);
    } else {
      handleCreateCoupon(values);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên"),
    discount: Yup.number()
      .min(0, "Giảm giá thấp nhất là 0%")
      .max(100, "Giảm giá không cao hơn 100%")
      .required("Vui lòng nhập giảm giá"),
    expiryDate: Yup.date().required("Vui lòng nhập ngày hết hạn giảm giá"),
  });

  if (!close) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-roboto">
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-5xl relative">
        <h2 className="w-full text-center text-2xl font-bold text-indigo-500 mb-6">
          {dataUpdate ? "Cập nhật mã giảm giá" : "Tạo mã giảm giá mới"}
        </h2>
        <Formik
          initialValues={initialValuess}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, setValues, errors }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cột 1: Thông tin chung */}
              <div className="col-span-1 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên mã giảm giá
                  </label>
                  <Field
                    name="name"
                    placeholder="Coupon Name"
                    className="mt-1 block w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mã giảm giá
                  </label>
                  <Field
                    name="code"
                    placeholder="Coupon Code"
                    className="mt-1 block w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="code"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giảm giá (%)
                  </label>
                  <Field
                    name="discount"
                    type="number"
                    placeholder="Discount"
                    className="mt-1 block w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="discount"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày hết hạn
                  </label>
                  <Field
                    name="expiryDate"
                    type="date"
                    className="mt-1 block w-full p-2 border rounded"
                    value={
                      values.expiryDate
                        ? new Date(values.expiryDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setValues({
                        ...values,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                  <ErrorMessage
                    name="expiryDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="status"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="status"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  ></label>
                </div>

                <div className="text-left p-4 border rounded cursor-pointer w-36">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <i className="bi bi-card-image text-xl text-red-400 mr-2"></i>
                    Đường dẫn ảnh
                  </label>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  {/* Avatar Preview */}
                  {view && (
                    <img
                      src={view}
                      alt="Image Coupons"
                      className="mt-4 h-24 object-cover cursor-pointer"
                    />
                  )}

                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Cột 2: Discount Product */}
              <div className="col-span-1 space-y-4">
                <h3 className="text-xl font-semibold text-indigo-500">
                  Các sản phẩm được áp dụng
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {productsLoading ? (
                    <Spinner />
                  ) : (
                    products?.data?.map((product) => (
                      <div key={product._id} className="flex items-center">
                        <Field
                          type="checkbox"
                          name="discountProduct"
                          value={product._id}
                          checked={values.discountProduct.includes(product._id)}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            if (checked) {
                              setValues({
                                ...values,
                                discountProduct: [
                                  ...values.discountProduct,
                                  value,
                                ],
                              });
                            } else {
                              setValues({
                                ...values,
                                discountProduct: values.discountProduct.filter(
                                  (id) => id !== value
                                ),
                              });
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`discountProduct-${product._id}`}
                          className="ml-2 text-sm font-medium text-gray-700"
                        >
                          {product.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                  disabled={creating || updating}
                >
                  {creating || updating ? <Spinner /> : "Lưu lại"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white p-2 rounded"
                  onClick={onClose}
                >
                  Thoát
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* <Toaster /> */}
      </div>
    </div>
  );
};

export default CreateUpdateCoupons;
