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
import CreateAddress from "../../components/dashboard/CreateAddress";
// Validation schema cho Brand
const brandSchema = Yup.object().shape({
  name: Yup.string().required("Brand name is required"),
  address: Yup.string().trim(),
  phone: Yup.string()
    .trim()
    .matches(
      /^[0-9]{10,11}$/,
      "Must be a valid phone number with 10-11 digits"
    ),
  email: Yup.string().email("Invalid email format").trim(),
});

const CreateBrands = () => {
  const [isCreateAddress, setIsCreateAddress] = useState();
  const [createBrand, { isSuccess: isCreateSuccess, isLoading }] =
    useCreateBrandMutation();
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

      if (isCreateSuccess) {
        toast.success("Brand created successfully");
        navigate("/dashboard/brands");
      }
    } catch (error) {
      toast.error("Failed to create brand");
    }
  };

  // useEffect(() => {
  //   if (isSuccessBrands) {
  //     const transformedData = brandsData?.data.map((brand) => {
  //       return {
  //         name: brand.name,
  //       };
  //     });
  //     setBrands(transformedData);
  //   }
  // }, [isSuccessBrands]);

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
                    Brand Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Brand Name"
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
                    Address
                  </label>
                  <Field
                    as="select"
                    name="address"
                    id="type"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                  >
                    <option value="">Choose one value</option>
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
                    Add new address
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
                    Phone
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
                    placeholder="Brand Email"
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
                    {!isLoading ? "Save" : <Spinner />}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {isCreateAddress && (
            <CreateAddress
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
