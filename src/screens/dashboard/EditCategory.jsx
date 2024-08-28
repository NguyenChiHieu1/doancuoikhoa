import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import {
  useUpdateCategoryMutation,
  useGetCategoriesQuery,
  useGetCateLevel12Query,
} from "../../store/service/cateService";
import Spinner from "../../components/Spinner";

// Validation schema cho Category
const categorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().trim(),
  parentCategory: Yup.string().nullable().default(""),
});

const EditCategory = () => {
  const { cid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: categoryData,
    isFetching: isFetchingCategory,
    refetch: refetchCategory,
  } = useGetCategoriesQuery({ _id: cid });
  const { data: level1Categories, isFetching: isFetchingCategories } =
    useGetCateLevel12Query();
  const [
    updateCategory,
    { isSuccess: isSuccessUpdate, isFetching: isFetchingUpdate },
  ] = useUpdateCategoryMutation();

  const [state, setState] = useState({});

  useEffect(() => {
    refetchCategory();
  }, [location.pathname]);

  useEffect(() => {
    if (categoryData) {
      setState(categoryData?.data?.[0]);
      console.log(categoryData);
    }
  }, [categoryData]);

  const handleFormSubmit = async (values) => {
    try {
      await updateCategory({
        cid,
        updatedCategory: values,
      });
      if (isSuccessUpdate) {
        toast.success("Category updated successfully!");
        navigate("/dashboard/category");
      }
    } catch (error) {
      toast.error("Failed to update category!");
    }
  };

  // useEffect(() => {
  //   if (isSuccessCate12) {
  //     const transformedData = dataCate12?.data.map((category) => {
  //       return {
  //         _id: category._id,
  //         name:
  //           category.parentCategory === null
  //             ? `${category.name} - level 1`
  //             : category.name,
  //       };
  //     });
  //     console.log("transformedData", transformedData);
  //     setCategories(transformedData);
  //   }
  // }, [isSuccessCate12]);
  return (
    <AdminHome>
      <ScreenHeader>
        <Link to={"/dashboard/category"}>
          <i class="bi bi-arrow-left text-3xl p-2 hover:bg-slate-200"></i>
        </Link>
        <Toaster position="top-right" reverseOrder={true} />
      </ScreenHeader>
      <div className="container mx-auto p-6">
        <div className="flex flex-wrap justify-center">
          {!isFetchingCategory ? (
            <Formik
              initialValues={state}
              validationSchema={categorySchema}
              onSubmit={handleFormSubmit}
              enableReinitialize
            >
              {() => (
                <Form className="w-full lg:w-8/12 text-black p-2 space-y-6 border border-white rounded-xl">
                  {/* Category Name */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-sm font-medium mb-1">
                      Category Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="border rounded-md p-2 text-gray-900"
                      placeholder="Category Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium mb-1"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      className="border rounded-md p-2 text-gray-900"
                      placeholder="Category Description"
                      rows="4"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Parent Category */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="parentCategory"
                      className="text-sm font-medium mb-1"
                    >
                      Parent Category
                    </label>
                    {!isFetchingCategories ? (
                      <Field
                        as="select"
                        name="parentCategory"
                        id="parentCategory"
                        className="border rounded-md p-2 text-gray-900"
                      >
                        <option value="" label="None" />
                        {level1Categories?.data?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
                    ) : (
                      <Spinner />
                    )}
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
                      {!isFetchingUpdate ? "Save" : <Spinner />}
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
    </AdminHome>
  );
};

export default EditCategory;
