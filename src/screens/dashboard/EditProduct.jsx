import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import {
  useUpdateProductMutation,
  useGetProductsQuery,
} from "../../store/service/productService";
import InputColor from "react-input-color";
import { BsPlusCircle } from "react-icons/bs";
import Spinner from "../../components/Spinner";
import "quill/dist/quill.snow.css";
import TextCKE from "../../components/dashboard/TextCKE";
import { productSchema } from "../../validations/manaProductValidation";

import { useGetAllDiscountsQuery } from "../../store/service/couponService";
import { useGetAllBrandsQuery } from "../../store/service/brandService";
import { useGetCateLevel3Query } from "../../store/service/cateService";

const EditProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: couponData = [],
    isFetching: isFetchingCoupon,
    refetch: refetchGetCoupon,
  } = useGetAllDiscountsQuery();
  const {
    data: brandData = [],
    isFetching: isFetchingBrand,
    refetch: refetchGetBrand,
  } = useGetAllBrandsQuery();
  const {
    data: categoryData = [],
    isFetching: isFetchingCategories,
    refetch: refetchGetCategory,
  } = useGetCateLevel3Query();
  const {
    data: productDataGet,
    isFetching: isFetchingGetProduct,
    refetch: refetchGetProduct,
  } = useGetProductsQuery({ _id: pid });

  const [updateData, response] = useUpdateProductMutation();

  const [colorP, setColorP] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [textDescript, setTextDescript] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const init = {
    name: "",
    price: 0,
    stock: 0,
    coupons: {
      _id: "",
      discount: "",
    },
    category: {
      _id: "",
      name: "",
    },
    brand: {
      _id: "",
      name: "",
    },
    description: "",
    color: [],
    images: [],
  };

  const [state, setState] = useState(init);

  useEffect(() => {
    refetchGetCoupon();
    refetchGetBrand();
    refetchGetCategory();
    refetchGetProduct();
  }, [location.pathname]);

  useEffect(() => {
    setState(productDataGet?.data[0]);
  }, [productDataGet]);

  useEffect(() => {
    setColorP(state?.color);
    setTextDescript(state?.description);
    setSelectedImages(state?.images);
    setSelectedFiles(state?.images);
  }, [state]);

  const onChangeDescript = (valuenew) => {
    return setTextDescript(valuenew);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    setSelectedImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleImageClick = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const handleAddColor = () => {
    setColorP((prevColors) => {
      if (!prevColors.includes(selectedColor)) {
        return [...prevColors, selectedColor];
      }
      return prevColors;
    });
  };

  const handleClickColor = (color) => {
    setColorP((prevColors) => {
      return prevColors.filter((c) => c !== color);
    });
  };

  const handleFormSubmit = async (values) => {
    const cloudinaryImages = [];

    const formData = new FormData();
    formData.append("name", values?.name);
    formData.append("price", values?.price);
    formData.append("stock", values?.stock);
    formData.append("coupons", values?.coupons);
    formData.append("category", values?.category);
    formData.append("brand", values?.brand);
    formData.append("description", textDescript);

    if (colorP && colorP.length > 0) {
      colorP.forEach((color, index) => {
        formData.append(`color[${index}]`, color);
      });
    }

    if (selectedFiles && selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        if (
          typeof file === "string" &&
          file.includes("https://res.cloudinary.com/")
        ) {
          cloudinaryImages.push(file);
        } else {
          formData.append("images", file);
        }
      });
    }

    cloudinaryImages.forEach((img, index) => {
      formData.append(`cloudinaryImages[${index}]`, img);
    });

    try {
      const upda = await updateData({
        pid: pid,
        updatedProduct: formData,
      });
      // for(var pair of formData.entries()) {
      //   console.log(pair[0]+ ', '+ pair[1]);
      // }
      if (upda) {
        toast.success("Edit product successfully!!!");
        // /dashboard/products
        navigate("/dashboard/products");
      }
    } catch (error) {
      toast.error("Failed to edit product!!!");
    }
  };

  return (
    <AdminHome>
      <ScreenHeader>
        <Link to={"/dashboard/products"}>
          <i class="bi bi-arrow-left text-3xl p-2 hover:bg-slate-200"></i>
        </Link>
        <Toaster position="top-right" reverseOrder={true} />
      </ScreenHeader>
      <div className="container mx-auto p-6">
        <div className="flex flex-wrap justify-center ">
          {!isFetchingGetProduct ? (
            productDataGet?.data.length > 0 ? (
              <Formik
                initialValues={{
                  name: productDataGet.data[0]?.name || "",
                  price: productDataGet.data[0]?.price || 0,
                  stock: productDataGet.data[0]?.stock || 0,
                  coupons: productDataGet.data[0]?.coupons?._id || "",
                  category: productDataGet.data[0]?.category?._id || "",
                  brand: productDataGet.data[0]?.brand?._id || "",
                  description: productDataGet.data[0]?.description || "",
                  color: productDataGet.data[0]?.color || [],
                  images: productDataGet.data[0]?.images || [],
                }}
                validationSchema={productSchema}
                onSubmit={handleFormSubmit}
                enableReinitialize
              >
                {({ setFieldValue, value }) => (
                  <Form className="w-full lg:w-8/12 text-black p-2 space-y-6 border border-white rounded-xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 m-2">
                      {/* Product Name */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium mb-1"
                        >
                          Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="border rounded-md p-2 text-gray-900"
                          placeholder="Product Name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Price */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="price"
                          className="text-sm font-medium mb-1"
                        >
                          Price
                        </label>
                        <Field
                          type="number"
                          name="price"
                          id="price"
                          className="border border-gray-300 rounded-md p-2 text-gray-900"
                          placeholder="Price"
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Stock */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="stock"
                          className="text-sm font-medium mb-1"
                        >
                          Stock
                        </label>
                        <Field
                          type="number"
                          name="stock"
                          id="stock"
                          className="border border-gray-300 rounded-md p-2 text-gray-900"
                          placeholder="Stock"
                        />
                        <ErrorMessage
                          name="stock"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Discount */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="coupons"
                          className="text-sm font-medium mb-1"
                        >
                          Discount
                        </label>
                        {!isFetchingCoupon ? (
                          <Field
                            as="select"
                            name="coupons"
                            id="coupons"
                            className="border border-gray-300 rounded-md p-2 text-gray-900"
                          >
                            <option value=" ">Choose Discount</option>
                            {couponData?.data?.map((ci) => (
                              <option value={ci._id} key={ci._id}>
                                {ci.discount}%
                              </option>
                            ))}
                          </Field>
                        ) : (
                          <Spinner />
                        )}
                        <ErrorMessage
                          name="coupons"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Category */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="category"
                          className="text-sm font-medium mb-1"
                        >
                          Category
                        </label>
                        {!isFetchingCategories ? (
                          <Field
                            as="select"
                            name="category"
                            id="category"
                            className="border border-gray-300 rounded-md p-2 text-gray-900"
                          >
                            <option value=" ">Choose category</option>
                            {categoryData?.data?.map((cate) => (
                              <option value={cate._id} key={cate._id}>
                                {cate.name}
                              </option>
                            ))}
                          </Field>
                        ) : (
                          <Spinner />
                        )}
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      {/* Sizes */}
                      {/* <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      
                    </div>
                  </div> */}

                      {/* Brand */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="brand"
                          className="text-sm font-medium mb-1"
                        >
                          Brand
                        </label>
                        {!isFetchingBrand ? (
                          <Field
                            as="select"
                            name="brand"
                            id="brand"
                            className="border border-gray-300 rounded-md p-2 text-gray-900"
                          >
                            <option value=" ">Choose brand</option>
                            {brandData?.data?.map((br) => (
                              <option value={br._id} key={br._id}>
                                {br.name}
                              </option>
                            ))}
                          </Field>
                        ) : (
                          <Spinner />
                        )}
                        <ErrorMessage
                          name="brand"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">
                        Description
                      </label>
                      <TextCKE
                        initText={textDescript}
                        onChangeValue={onChangeDescript}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Images */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">Images</label>
                      <input
                        type="file"
                        className="border border-gray-300 rounded-md p-2 text-white"
                        onChange={(e) => handleImageChange(e)}
                        multiple
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedImages?.map((image, index) => (
                          <div
                            key={index}
                            className="relative w-24 h-24"
                            onClick={() => handleImageClick(index)}
                          >
                            <img
                              src={image}
                              alt={`selected-${index}`}
                              className="object-cover w-full h-full rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                      <ErrorMessage
                        name="images"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Colors */}
                    <div className="flex flex-col col-span-2 ">
                      <label className="text-sm font-medium mb-1">Colors</label>
                      <div className="flex items-center space-x-2">
                        <InputColor
                          initialValue="#D2691E"
                          onChange={handleColorChange}
                          placement="right"
                        />
                        <button
                          type="button"
                          onClick={handleAddColor}
                          className="btn btn-primary"
                        >
                          <BsPlusCircle
                            style={{ fontSize: "2rem", color: "#0bdbb2ff" }}
                          />
                        </button>
                        <div className="mt-2">
                          {colorP?.map((color, index) => (
                            <span
                              key={index}
                              className="inline-block w-6 h-6 rounded-full cursor-pointer"
                              style={{ backgroundColor: color }}
                              onClick={() => handleClickColor(color)}
                            ></span>
                          ))}
                        </div>
                      </div>
                      <ErrorMessage
                        name="color"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-indigo-700 mt-8"
                      >
                        {!response.isLoading ? "Save" : <Spinner />}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              "Not found product!"
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </AdminHome>
  );
};

export default EditProduct;
