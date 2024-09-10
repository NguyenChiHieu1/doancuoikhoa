import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import {
  useCreateCategoryMutation,
  useGetCateLevel12Query,
} from "../../store/service/cateService";
import Spinner from "../../components/Spinner";

// Validation schema cho Category
const categorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().trim(),
  //   parentCategory: Yup.string().nullable(),
});

const CreateCategory = () => {
  const [createCategory, { isSuccess: isSuccCre, isLoading }] =
    useCreateCategoryMutation();
  const { data: dataCate12, isSuccess: isSuccessCate12 } =
    useGetCateLevel12Query();
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const init = {
    name: "",
    description: "",
    parentCategory: "",
  };

  const [state, setState] = useState(init);

  const handleFormSubmit = async (values) => {
    try {
      const formattedValues = { ...values };
      console.log(values);
      console.log(formattedValues);
      if (
        formattedValues.parentCategory === "" ||
        formattedValues.parentCategory === null
      ) {
        delete formattedValues.parentCategory;
      }
      await createCategory(formattedValues);
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  useEffect(() => {
    if (isSuccCre) {
      toast.success("Category created successfully");
      // navigate("/dashboard/category");
    }
  }, [isSuccCre]);

  useEffect(() => {
    if (isSuccessCate12) {
      const transformedData = dataCate12?.data.map((category) => {
        return {
          _id: category._id,
          name:
            category.parentCategory === null
              ? `${category.name} - level 1`
              : category.name,
        };
      });
      // console.log("transformedData", transformedData);
      setCategories(transformedData);
    }
  }, [isSuccessCate12]);

  return (
    <AdminHome>
      <ScreenHeader>
        <Link to={"/dashboard/category"}>
          <i className="bi bi-arrow-left text-3xl p-2 hover:bg-slate-200"></i>
        </Link>
        <Toaster position="top-right" reverseOrder={true} />
      </ScreenHeader>
      <div className="container mx-auto p-6">
        <div className="flex flex-wrap justify-center">
          <Formik
            initialValues={state}
            validationSchema={categorySchema}
            onSubmit={handleFormSubmit}
            enableReinitialize
          >
            {() => (
              <Form className="w-full lg:w-8/12 p-2 rounded-xl">
                <div className="flex flex-col mb-2">
                  <label
                    htmlFor="name"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Tên danh mục:
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Vui lòng nhập thông tin..."
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col mb-8">
                  <label
                    htmlFor="description"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Mô tả:
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    className="border rounded-md p-2 text-gray-900 border-black"
                    placeholder="Vui lòng nhập thông tin..."
                    rows="4"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="parentCategory"
                    className="text-sm text-black font-medium mb-1"
                  >
                    Danh mục cha
                  </label>
                  <Field
                    as="select"
                    name="parentCategory"
                    id="parentCategory"
                    className="border rounded-md border-black p-2 text-gray-900"
                  >
                    <option value="" label="Level 1" />
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="parentCategory"
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
        </div>
      </div>
    </AdminHome>
  );
};

export default CreateCategory;
