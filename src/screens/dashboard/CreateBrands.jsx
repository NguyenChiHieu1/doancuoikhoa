import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import { useCreateBrandMutation } from "../../store/service/brandService";
import { useGetAllAddressesQuery } from "../../store/service/addressService";
import Spinner from "../../components/Spinner";
import NewAddress from "../../components/user/NewAddress";
// Validation schema cho Brand
const brandSchema = Yup.object().shape({
  name: Yup.string().required("Vui lòng nhập tên nhà cung cấp"),
  address: Yup.string().trim(),
  phone: Yup.string()
    .trim()
    .matches(
      /^[0-9]{10,11}$/,
      "Vui lòng nhập đúng định dạng số điện thoại và chứa 10-11 số"
    ),
  email: Yup.string().email("Lỗi định dạng email").trim(),
});

const CreateBrands = () => {
  const [isCreateAddress, setIsCreateAddress] = useState(false);
  const [createBrand, response] = useCreateBrandMutation();
  const { data, refetch } = useGetAllAddressesQuery();
  // const [brands, setBrands] = useState([]);

  const navigate = useNavigate();

  const init = {
    name: "",
    address: "",
    phone: "",
    email: "",
  };

  const handleFormSubmit = async (values) => {
    try {
      const formattedValues = { ...values };
      await createBrand(formattedValues);
    } catch (error) {
      toast.error("Lỗi tạo nhà cung cấp");
    }
  };

  useEffect(() => {
    if (response.isSuccess) {
      toast.success("Thêm nhà cung cấp mới thành công !!!");
      navigate(-1);
    } else {
      toast.error("Thêm nhà cung cấp mới thất bại !!!");
    }
  }, [response.isSuccess]);

  return (
    <AdminHome>
      <ScreenHeader>
        <Link to={"/dashboard/brands"}>
          <i className="bi bi-arrow-left text-3xl p-2 hover:bg-slate-200"></i>
        </Link>
        <Toaster position="top-right" reverseOrder={true} />
      </ScreenHeader>
      <div className="container mx-auto p-6">
        <div className="flex flex-wrap justify-center">
          <Formik
            initialValues={init}
            validationSchema={brandSchema}
            onSubmit={handleFormSubmit}
            enableReinitialize
          >
            {() => (
              <Form className="w-full lg:w-8/12 p-2 rounded-xl">
                <div className="flex flex-col mb-2 gap-1">
                  <label
                    htmlFor="name"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Tên nhà cung cấp:
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Nhập tên nhà cung cấp"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="address"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Địa chỉ:
                  </label>
                  <Field
                    as="select"
                    name="address"
                    id="type"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                  >
                    <option value="">Chọn địa chỉ</option>
                    {data?.data?.map((item, index) => {
                      return (
                        <option key={index} value={item?._id}>
                          {`${item?.street}, ${item?.district},  ${item?.city}, ${item?.country}`}
                        </option>
                      );
                    })}
                  </Field>
                  <label
                    onClick={() => {
                      setIsCreateAddress(true);
                    }}
                    className="hover:text-red-500 hover:underline hover:cursor-pointer text-indigo-500"
                  >
                    Thêm mới địa chỉ
                  </label>
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="phone"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Số điện thoại:
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Số điện thoại liên hệ"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-8">
                  <label
                    htmlFor="email"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Email liên hệ"
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
                    {!response.isLoading ? "Lưu lại" : <Spinner />}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {isCreateAddress === true && (
            <NewAddress
              onClose={() => {
                setIsCreateAddress(false);
                refetch();
              }}
            />
          )}
        </div>
      </div>
    </AdminHome>
  );
};

export default CreateBrands;
