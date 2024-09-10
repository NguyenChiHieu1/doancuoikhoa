import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import TextCKE from "../../components/dashboard/TextCKE";
import InputColor from "react-input-color";
import { BsPlusCircle } from "react-icons/bs";
import "quill/dist/quill.snow.css";
import { productSchema } from "../../validations/manaProductValidation";
import { useCreateProductMutation } from "../../store/service/productService";
import { useGetAllDiscountsQuery } from "../../store/service/couponService";
import { useGetAllBrandsQuery } from "../../store/service/brandService";
import { useGetCateLevel3Query } from "../../store/service/cateService";
//, useGetAllDiscountsQuery, useGetAllBrandsQuery, useGetCateLevel12Query
const CreateProduct = () => {
  const { data: couponData = [], isFetching: isFetchingCoupon } =
    useGetAllDiscountsQuery();
  const { data: brandData = [], isFetching: isFetchingBrand } =
    useGetAllBrandsQuery();
  const { data: categoryData = [], isFetching: isFetchingCategories } =
    useGetCateLevel3Query();
  const [createData, response] = useCreateProductMutation();

  const [colorP, setColorP] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [textDescript, setTextDescript] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const initialValues = {
    name: "",
    price: 0,
    stock: 0,
    coupons: "",
    category: "",
    brand: "",
  };

  const onChangeDescript = (valuenew) => setTextDescript(valuenew);

  const handleImageChange = (e) => {
    const maxImages = 10;
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > maxImages) {
      alert(`Bạn chỉ có thể thêm tối đa ${maxImages} ảnh mỗi lần.`);
      return;
    }

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

  const handleColorChange = (color) => setSelectedColor(color.hex);

  const handleAddColor = () => {
    if (!colorP.includes(selectedColor)) {
      setColorP((prevColors) => [...prevColors, selectedColor]);
    }
  };

  const handleClickColor = (color) =>
    setColorP((prevColors) => prevColors.filter((c) => c !== color));

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("description", textDescript);
    colorP.forEach((color, index) => formData.append(`color[${index}]`, color));
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      console.log(response);
      await createData(formData);
    } catch (error) {
      toast.error("Tạo sản phẩm mới không thành công");
    }
  };

  useEffect(() => {
    if (response.isSuccess) {
      console.log(response);
      toast.success("Product created successfully");
    }
    // else if ( !response.isSuccess) {
    //   toast.error("Failed to create product");
    // }
  }, [response.isSuccess]);
  return (
    <AdminHome>
      <ScreenHeader>
        <Link to="/dashboard/products">
          <i className="bi bi-arrow-left text-3xl p-2 hover:bg-slate-200"></i>
        </Link>
        <Toaster position="top-right" reverseOrder={true} />
      </ScreenHeader>
      <div className="container p-6 bg-slate-50">
        <div className="flex flex-wrap justify-center">
          <Formik
            initialValues={initialValues}
            validationSchema={productSchema}
            onSubmit={handleFormSubmit}
          >
            {() => (
              <Form className="w-full  lg:w-8/12  p-2 space-y-6 border border-separate rounded-xl hover:shadow-lg">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 m-2">
                  {[
                    { name: "name", label: "Tên", type: "text" },
                    { name: "price", label: "Giá", type: "number" },
                    {
                      name: "stock",
                      label: "Số lượng tồn kho",
                      type: "number",
                    },
                  ].map(({ name, label, type }) => (
                    <div key={name} className="flex flex-col">
                      <label
                        htmlFor={name}
                        className=" text-sm font-medium mb-1 "
                      >
                        {label}
                      </label>
                      <Field
                        type={type}
                        name={name}
                        id={name}
                        className="border rounded-md p-2 text-gray-900 hover:shadow-lg"
                        placeholder={label}
                      />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  ))}

                  {[
                    {
                      name: "coupons",
                      label: "Giảm giá",
                      data: couponData,
                      fetching: isFetchingCoupon,
                    },
                    {
                      name: "category",
                      label: "Danh mục",
                      data: categoryData,
                      fetching: isFetchingCategories,
                    },
                    {
                      name: "brand",
                      label: "Nhà cung cấp",
                      data: brandData,
                      fetching: isFetchingBrand,
                    },
                  ].map(({ name, label, data, fetching }) => (
                    <div key={name} className="flex flex-col">
                      <label
                        htmlFor={name}
                        className="  text-sm font-medium mb-1"
                      >
                        {label}
                      </label>
                      {!fetching ? (
                        <Field
                          as="select"
                          name={name}
                          id={name}
                          className="border border-gray-300 rounded-md p-2 text-gray-900 hover:shadow-lg"
                        >
                          <option value="">Vui lòng chọn {label}</option>
                          {data.data?.map((item) => (
                            <option value={item._id} key={item._id}>
                              {item.name || `${item.discount}%`}
                            </option>
                          ))}
                        </Field>
                      ) : (
                        <Spinner />
                      )}
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col">
                  <label className=" text-sm font-medium mb-1 ">Mô tả</label>
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

                <div className="flex flex-col">
                  <label className=" text-sm font-medium mb-1 ">Ảnh</label>
                  <input
                    type="file"
                    className="border border-gray-300 rounded-md p-2 "
                    onChange={handleImageChange}
                    multiple
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 hover:shadow-lg"
                      >
                        <img
                          src={image}
                          alt={`selected-${index}`}
                          className="object-cover w-full h-full rounded-md"
                          onClick={() => handleImageClick(index)}
                        />
                        {/* <button type="button" className="absolute top-1 right-1 text-white bg-red-500 rounded-full p-1" >X</button> */}
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col col-span-2">
                  <label className=" text-sm font-medium mb-1 ">Colors</label>
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
                      {colorP.map((color, index) => (
                        <span
                          key={index}
                          className="inline-block w-6 h-6 rounded-full cursor-pointer border border-b-zinc-200 mr-1"
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
                    {!response.isLoading ? "Lưu lại" : <Spinner />}
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

export default CreateProduct;
