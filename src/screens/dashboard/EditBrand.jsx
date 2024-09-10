import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import {
  useUpdateBrandMutation,
  useGetBrandByIdQuery,
} from "../../store/service/brandService";
import { useGetAllAddressesQuery } from "../../store/service/addressService";
import Spinner from "../../components/Spinner";
import CreateAddress from "../../components/dashboard/CreateAddress";

const brandSchema = Yup.object().shape({
  name: Yup.string().required("Brand name is required"),
  address: Yup.array()
    .of(Yup.string().nullable())
    .required("Address is required"),
  phone: Yup.string()
    .trim()
    .matches(
      /^[0-9]{10,11}$/,
      "Must be a valid phone number with 10-11 digits"
    ),
  email: Yup.string().email("Invalid email format").trim(),
});

const EditBrand = () => {
  const { bid } = useParams();
  const navigate = useNavigate();
  const {
    data: getBrandID,

    isSuccess: isSuccessGetBrandID,
  } = useGetBrandByIdQuery(bid);
  const { data: addressData, refetch: refetchAddresses } =
    useGetAllAddressesQuery();
  const [
    updateBrand,
    {
      response,
      isLoading,
      isSuccess: isUpdateSuccess,
      isFetching: isFetchingUpdate,
    },
  ] = useUpdateBrandMutation();

  const [isCreateAddress, setIsCreateAddress] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    address: [],
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (isSuccessGetBrandID) {
      setInitialValues({
        name: getBrandID?.data?.name,
        address: getBrandID?.data?.address || [],
        phone: getBrandID?.data?.phone || "",
        email: getBrandID?.data?.email || "",
      });
    }
  }, [isSuccessGetBrandID]);

  const handleFormSubmit = async (values) => {
    try {
      await updateBrand({ id: bid, updatedBrand: values });

      if (isUpdateSuccess) {
        toast.success("Cập nhật thông tin nhà cung cấp thành công!");
        navigate("/dashboard/brands");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin!");
    }
  };

  return (
    <AdminHome>
      <ScreenHeader>
        <Link to="/dashboard/brands">
          <i className="bi bi-arrow-left text-3xl p-2 hover:bg-slate-200"></i>
        </Link>
        <Toaster position="top-right" reverseOrder={true} />
      </ScreenHeader>
      <div className="container mx-auto p-6">
        <div className="flex flex-wrap justify-center">
          {!isLoading ? (
            <Formik
              initialValues={initialValues}
              validationSchema={brandSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize
            >
              {() => (
                <Form className="w-full lg:w-8/12 p-2 rounded-xl">
                  {/* Brand Name */}
                  <div className="flex flex-col mb-2 gap-1">
                    <label
                      htmlFor="name"
                      className="text-sm text-black font-medium mb-1"
                    >
                      Tên nhà cung cấp
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="border rounded-md p-2 text-gray-900 border-black"
                      placeholder="Tên nhà cung cấp"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Address */}
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="address"
                      className="text-sm text-black font-medium mb-1"
                    >
                      Địa chỉ
                    </label>
                    <Field
                      as="select"
                      name="address"
                      id="address"
                      className="w-full p-2 mb-4 border border-gray-300 rounded"
                      multiple={true} // Cho phép chọn nhiều địa chỉ
                    >
                      <option value="">Chọn địa chỉ</option>
                      {addressData?.data?.map((address) => (
                        <option key={address._id} value={address._id}>
                          {`${address.street}, ${address.district}, ${address.city}, ${address.country}`}
                        </option>
                      ))}
                    </Field>
                    <label
                      onClick={() => setIsCreateAddress(true)}
                      className="hover:text-red-500 hover:underline hover:cursor-pointer text-indigo-500"
                    >
                      Thêm địa chỉ mới
                    </label>
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="phone"
                      className="text-sm text-black font-medium mb-1"
                    >
                      Số điện thoại
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      id="phone"
                      className="border rounded-md p-2 text-gray-900 border-black"
                      placeholder="Brand Phone"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col mb-8">
                    <label
                      htmlFor="email"
                      className="text-sm text-black font-medium mb-1"
                    >
                      Địa chỉ email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="border rounded-md p-2 text-gray-900 border-black"
                      placeholder="Vui lòng nhập email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div className="flex justify-center">
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
          ) : (
            <Spinner />
          )}
        </div>
      </div>
      {isCreateAddress && (
        <CreateAddress
          onClose={() => {
            setIsCreateAddress(false);
            refetchAddresses();
          }}
        />
      )}
    </AdminHome>
  );
};

export default EditBrand;
