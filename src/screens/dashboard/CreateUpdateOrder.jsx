import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useCreateOrderMutation,
  useUpdateOrderByAdminMutation,
} from "../../store/service/orderService";
import { useGetAllProductsQuery } from "../../store/service/productService";
import { useGetAllDiscountsQuery } from "../../store/service/couponService";
import { useGetUserQuery } from "../../store/service/authService";
import { Toaster, toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import formatMoney from "../../utils/formatMoney";

const CreateUpdateOrder = ({ close, onClose, dataUpdate }) => {
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: updating }] =
    useUpdateOrderByAdminMutation();
  const { data: products, isLoading: productsLoading } =
    useGetAllProductsQuery();
  const { data: coupons, isLoading: couponsLoading } =
    useGetAllDiscountsQuery();
  const { data: account, isLoading: accountLoading } = useGetUserQuery({
    role: "user",
  });

  const init = {
    items: [],
    customer: "",
    totalAmount: 0,
    paymentMethod: "",
    orderStatus: "",
    createdAt: "",
    deliveryDate: "",
    shippingAddress: {
      recipientName: "",
      recipientNumber: "",
      city: "",
      country: "",
      line1: "",
      line2: "",
      postal_code: "",
      state: "",
    },
    notes: "",
  };
  const [initialValuess, setInitialValuess] = useState(init);

  useEffect(() => {
    if (dataUpdate && Object.keys(dataUpdate).length !== 0) {
      const updatedItems = dataUpdate.items.map((item) => {
        const product = products?.data?.find(
          (p) => p._id === item.productId._id
        );
        // console.log(product);
        return {
          ...item,
          availableColors: product ? product.color : [],
        };
      });
      setInitialValuess({ ...dataUpdate, items: updatedItems });
    }
  }, [dataUpdate, products]);

  const handleCreateOrder = async (values) => {
    try {
      await createOrder(values).unwrap();
      toast.success("Đơn hàng mới được tạo thành công!");
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      toast.error("Lỗi trong lúc tạo đơn hàng.");
    }
  };

  const handleUpdateOrder = async (values) => {
    try {
      await updateOrder({
        orderId: dataUpdate._id,
        orderData: { ...values },
      }).unwrap();
      toast.success("Cập nhật đơn hàng thành công!");
      onClose();
    } catch (error) {
      toast.error("Cập nhật đơn hàng thất bại.");
    }
  };

  const handleFormSubmit = async (values) => {
    if (dataUpdate) {
      handleUpdateOrder(values);
    } else {
      handleCreateOrder(values);
    }
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => {
      const itemTotal =
        item.price * item.quantity * (1 - (item.discount || 0) / 100);
      return total + itemTotal;
    }, 0);
  };

  const validationSchema = Yup.object().shape({
    // customer: Yup.string().required("Customer is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          // productId: Yup.string().required("Product is required"),
          quantity: Yup.number()
            .min(1, "Vui lòng nhập số lượng lơn hơn 1")
            .required("Vui lòng nhập số lượng"),
          // color: Yup.string().required("Color is required"),
          discount: Yup.number()
            .min(0, "Mức giảm giá thấp nhất là 0%")
            .max(100, "Mức giảm giá cao nhất là 100%"),
        })
      )
      .min(1, "Vui lòng chon ít nhất một sản phẩm cần mua"),
    paymentMethod: Yup.string().required(
      "Vui lòng chọn phương thức thanh toán"
    ),
    shippingAddress: Yup.object().shape({
      recipientName: Yup.string().required("Vui lòng nhập tên người nhận"),
      recipientNumber: Yup.string().required(
        "Vui lòng nhập số điện thoại người nhận"
      ),
      city: Yup.string().required("Vui lòng nhập tên thành phố"),
      country: Yup.string().required("Vui lòng nhập tên quốc gia"),
      line1: Yup.string().required("Vui lòng nhập địa chỉ giao hàng"),
      postal_code: Yup.string().required("Vui lòng nhập mã bưu điện"),
      state: Yup.string().required("Vui lòng nhập tên tỉnh thành"),
    }),
  });

  if (!close) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-5xl relative text-black">
        <h2 className="w-full text-center text-2xl font-bold mb-4">
          {dataUpdate ? "Cập nhật đơn hàng" : "Tạo mới đơn hàng"}
        </h2>
        <Formik
          initialValues={initialValuess}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, setValues, errors }) => (
            <Form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {console.log("Giá trị:", values)}
              {/* Cột 1: Thông tin sản phẩm */}
              <div className="col-span-1">
                <h2 className="text-xl font-bold mb-4">
                  Thông tin sản phẩm mua
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="numProducts"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Số sản phẩm đã mua:
                  </label>
                  <input
                    type="number"
                    id="numProducts"
                    name="numProducts"
                    min="1"
                    className="mt-1 block w-full p-2 border rounded"
                    value={values?.items?.length || 1}
                    readOnly={dataUpdate ? true : false}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 1;
                      const updatedItems = Array.from(
                        { length: num },
                        (_, index) => {
                          const existingItem = values.items[index];
                          if (existingItem) {
                            return existingItem;
                          }

                          const defaultItem = {
                            productId: "",
                            name: "",
                            quantity: 1,
                            price: 0,
                            discount: 0,
                            color: "",
                            availableColors: [],
                          };

                          const product = products?.data?.find(
                            (p) => p._id === defaultItem.productId
                          );

                          if (product) {
                            return {
                              ...defaultItem,
                              availableColors: product.color,
                            };
                          }

                          return defaultItem;
                        }
                      );

                      setValues({
                        ...values,
                        items: updatedItems,
                      });
                    }}
                  />
                  {errors.items && (
                    <div className="text-red-500 text-sm">{errors.items}</div>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {values.items.map((item, index) => (
                    <div
                      key={index}
                      className="space-y-2 border p-4 rounded-lg"
                    >
                      <label htmlFor="">{`Sản phẩm ${index + 1}:`}</label>
                      <Field
                        as="select"
                        name={`items[${index}].productId`}
                        value={
                          dataUpdate
                            ? values?.items[index]?.productId?._id || ""
                            : values?.items[index]?.productId || ""
                        }
                        onChange={(e) => {
                          // console.log("--idvalues", values);
                          const selectedProductId = e.target.value;
                          const product = products?.data?.find(
                            (p) => p._id === selectedProductId
                          );
                          // console.log("232", product);
                          if (product) {
                            const updatedItems = values.items.map((itm, i) =>
                              i === index
                                ? {
                                    ...itm,
                                    productId: product._id,
                                    name: product.name,
                                    price: product.price,
                                    availableColors: product.color,
                                    color: "",
                                  }
                                : itm
                            );

                            setValues({
                              ...values,
                              items: updatedItems,
                              totalAmount: calculateTotalAmount(updatedItems),
                            });
                          }
                        }}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Chọn sản phẩm</option>
                        {productsLoading ? (
                          <option value="">Đang tải...</option>
                        ) : (
                          products?.data?.map((product) => (
                            <option key={product._id} value={product._id || ""}>
                              {productsLoading ? <Spinner /> : product.name}
                            </option>
                          ))
                        )}
                      </Field>
                      <ErrorMessage
                        name={`items[${index}].productId`}
                        component="div"
                        className="text-red-500 text-sm"
                      />

                      <Field
                        name={`items[${index}].quantity`}
                        placeholder="Quantity"
                        type="number"
                        className="w-full p-2 border rounded"
                        onChange={(e) => {
                          const updatedItems = values.items.map((itm, i) =>
                            i === index
                              ? {
                                  ...itm,
                                  quantity: parseInt(e.target.value) || 1,
                                }
                              : itm
                          );
                          setValues({
                            ...values,
                            items: updatedItems,
                            totalAmount: calculateTotalAmount(updatedItems),
                          });
                        }}
                      />
                      <ErrorMessage
                        name={`items[${index}].quantity`}
                        component="div"
                        className="text-red-500 text-sm"
                      />

                      <Field
                        as="select"
                        name={`items[${index}].color`}
                        className="w-full p-2 border rounded overflow-y-auto "
                        style={{
                          backgroundColor: values?.items[index]?.color || "",
                        }}
                        value={values?.items[index].color || ""}
                        onChange={(e) => {
                          const selectedColor = e.target.value;
                          setValues({
                            ...values,
                            items: values.items.map((itm, i) =>
                              i === index
                                ? { ...itm, color: selectedColor.toString() }
                                : itm
                            ),
                          });
                        }}
                      >
                        <option value="">Chọn màu sắc</option>
                        {values.items[index]?.availableColors?.map(
                          (color, colorIndex) => (
                            <option
                              key={colorIndex}
                              value={color}
                              style={{ backgroundColor: color, color: "#000" }}
                            >
                              {color}
                            </option>
                          )
                        )}
                      </Field>
                      <ErrorMessage
                        name={`items[${index}].color`}
                        component="div"
                        className="text-red-500 text-sm"
                      />

                      <Field
                        as="select"
                        name={`items[${index}].discount`}
                        className="w-full p-2 border rounded"
                        onChange={(e) => {
                          const updatedItems = values.items.map((itm, i) =>
                            i === index
                              ? {
                                  ...itm,
                                  discount: parseFloat(e.target.value) || 0,
                                }
                              : itm
                          );
                          setValues({
                            ...values,
                            items: updatedItems,
                            totalAmount: calculateTotalAmount(updatedItems),
                          });
                        }}
                      >
                        <option value="">Chọn mức giảm giá</option>
                        {couponsLoading ? (
                          <option value="">Đang tải...</option>
                        ) : (
                          coupons?.data?.map((coupon) => (
                            <option key={coupon._id} value={coupon.discount}>
                              {coupon.code} - {coupon.discount}%
                            </option>
                          ))
                        )}
                      </Field>
                      <ErrorMessage
                        name={`items[${index}].discount`}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột 2: Thông tin khác */}
              <div className="col-span-1">
                <h2 className="text-xl font-bold mb-4">
                  Thông tin người đặt hàng
                </h2>
                <div className="space-y-2">
                  <div className="mb-4">
                    <Field
                      name="customer"
                      className="w-full p-2 border rounded"
                      as="select"
                      value={
                        dataUpdate
                          ? values?.customer?._id || ""
                          : values?.customer || ""
                      }
                    >
                      <option value="">Chọn email người đặt hàng</option>
                      {account?.data.length > 0 &&
                        account?.data?.map((acc) => (
                          <option key={acc?._id} value={acc?._id}>
                            {acc?.email}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="customer"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <Field
                      name="totalAmount"
                      type="number"
                      className="w-full p-2 border rounded hidden"
                      value={values.totalAmount}
                      readOnly
                    />
                    <span className="w-full p-2 border rounded">
                      Tổng tiền: {formatMoney(values.totalAmount)}
                    </span>
                  </div>
                  <div className="mb-4">
                    <Field
                      as="select"
                      name="paymentMethod"
                      className="w-full p-2 border rounded"
                      // disabled={dataUpdate ? true : false}
                    >
                      <option value="">Chọn phương thức thanh toán</option>
                      <option value="COD">COD</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </Field>
                    <ErrorMessage
                      name="paymentMethod"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-5">
                    <Field
                      as="select"
                      name="orderStatus"
                      className="w-full p-2 border rounded"
                      // disabled={dataUpdate ? false : false}
                    >
                      <option value="">Chọn trạng thái đơn hàng</option>
                      <option value="pending">Đang chờ</option>
                      <option value="processing">Đã xác nhận</option>
                      <option value="shipped">Đang giao hàng</option>
                      <option value="delivered">Giao hàng thành công</option>
                      <option value="cancelled">Hủy đơn</option>
                    </Field>
                    <ErrorMessage
                      name="paymentMethod"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
                <div className="mb-4 mt-4 text-black">
                  <label htmlFor="" className="mt-2">
                    Ngày giao hàng:
                  </label>
                  <Field
                    name="deliveryDate"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={
                      values.deliveryDate
                        ? new Date(values.deliveryDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setValues({
                        ...values,
                        deliveryDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="">Ngày mua:</label>
                  <Field
                    name="createdAt"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={
                      values.createdAt
                        ? new Date(values.createdAt).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setValues({
                        ...values,
                        createdAt: e.target.value,
                      })
                    }
                  />
                </div>

                <Field
                  as="textarea"
                  name="notes"
                  placeholder="Notes"
                  className="w-full p-2 border rounded mt-4"
                />
              </div>

              {/* Cột 3: Địa chỉ giao hàng */}
              <div className="col-span-1">
                <h2 className="text-xl font-bold mb-4">Địa chỉ giao hàng</h2>
                <div className="space-y-2">
                  <Field
                    name="shippingAddress.recipientName"
                    placeholder="Tên người nhận:"
                    className="w-full p-2 border rounded"
                  />
                  <Field
                    name="shippingAddress.recipientNumber"
                    placeholder="Số điện thoại người nhận:"
                    className="w-full p-2 border rounded"
                  />

                  <Field
                    name="shippingAddress.line1"
                    placeholder="Địa chỉ nhận 1:"
                    className="w-full p-2 border rounded"
                  />
                  <Field
                    name="shippingAddress.line2"
                    placeholder="Địa chỉ nhận 2:"
                    className="w-full p-2 border rounded"
                  />
                  <Field
                    name="shippingAddress.city"
                    placeholder="Tên thành phố:"
                    className="w-full p-2 border rounded"
                  />
                  <Field
                    name="shippingAddress.state"
                    placeholder="Tên tỉnh:"
                    className="w-full p-2 border rounded"
                  />
                  <Field
                    name="shippingAddress.country"
                    placeholder="Quốc gia:"
                    className="w-full p-2 border rounded"
                  />
                  <Field
                    name="shippingAddress.postal_code"
                    placeholder="Mã bưu điện:"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="col-span-3 flex justify-end mt-4">
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

        <Toaster />
      </div>
    </div>
  );
};

export default CreateUpdateOrder;
