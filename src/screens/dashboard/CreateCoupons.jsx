import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import { useCreateCouponMutation } from "../../store/service/couponService";
import { useGetAllProductsQuery } from "../../store/service/productService";
// Validation schema for Coupon
const couponSchema = Yup.object().shape({
  name: Yup.string().required("Coupon name is required"),
  discount: Yup.number()
    .min(1, "Discount must be at least 1%")
    .max(100, "Discount cannot exceed 100%")
    .required("Discount is required"),
  expiryDate: Yup.date()
    .min(new Date(), "Expiry date must be in the future")
    .required("Expiry date is required"),
  products: Yup.array().min(1, "At least one product must be selected"),
  // image: Yup.mixed().required("Image is required"),
});

const CreateCoupon = () => {
  const [createCoupon, { isSuccess: isCreateSuccess, isLoading }] =
    useCreateCouponMutation();
  const { data: productData, isSuccess: isSuccessProducts } =
    useGetAllProductsQuery();
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const initialValues = {
    name: "",
    discount: "",
    expiryDate: "",
    products: [],
    image: null,
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      });
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await createCoupon(formData);

      if (isCreateSuccess) {
        toast.success("Coupon created successfully");
        navigate("/dashboard/coupons");
      }
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  useEffect(() => {
    if (isSuccessProducts) {
      setProducts(productData?.data || []);
    }
  }, [isSuccessProducts]);

  return (
    <AdminHome>
      <ScreenHeader>
        <Link to="/dashboard/coupons">
          <i className="bi bi-arrow-left text-3xl p-2 hover:bg-slate-200"></i>
        </Link>
        <Toaster position="top-right" reverseOrder={true} />
      </ScreenHeader>
      <div className="container mx-auto p-6">
        <div className="flex flex-wrap justify-center">
          <Formik
            initialValues={initialValues}
            validationSchema={couponSchema}
            onSubmit={handleFormSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="w-full lg:w-8/12 p-2 rounded-xl">
                <div className="flex flex-col mb-2">
                  <label
                    htmlFor="name"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Coupon Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Coupon Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label
                    htmlFor="discount"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Discount (%)
                  </label>
                  <Field
                    type="number"
                    name="discount"
                    id="discount"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Discount Percentage"
                  />
                  <ErrorMessage
                    name="discount"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label
                    htmlFor="expiryDate"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Expiry Date
                  </label>
                  <Field
                    type="date"
                    name="expiryDate"
                    id="expiryDate"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Expiry Date"
                  />
                  <ErrorMessage
                    name="expiryDate"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label
                    htmlFor="products"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Products
                  </label>
                  <Field
                    as="select"
                    name="products"
                    id="products"
                    multiple={true}
                    className="border rounded-md p-2 text-gray-900 border-black"
                  >
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="products"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-8">
                  <label
                    htmlFor="image"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="border rounded-md p-2"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("image", file);
                      setSelectedImage(file);
                    }}
                  />
                  {selectedImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className="w-32 h-32 object-cover border rounded-md"
                      />
                    </div>
                  )}
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex justify-center">
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
    </AdminHome>
  );
};

export default CreateCoupon;
