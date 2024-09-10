import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from "../../store/service/authService";
import { useGetAllAddressesQuery } from "../../store/service/addressService";

import { Toaster, toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import NewAddress from "../../components/user/NewAddress";

const CreateUpdateAccount = ({ close, onClose, dataUpdate }) => {
  const [createUser, { isLoading: creating }] = useCreateAccountMutation();
  const [updateUser, { isLoading: updating }] = useUpdateAccountMutation();
  const { data: addressList } = useGetAllAddressesQuery();
  const initialValues = {
    name: "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    role: "",
    address: [],
    isBlock: false,
    status: false,
  };
  const [isNewAddressFormVisible, setNewAddressFormVisible] = useState(false);
  const [initialValuess, setInitialValuess] = useState(initialValues);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState(dataUpdate?.avatar);
  useEffect(() => {
    if (dataUpdate) {
      setInitialValuess({
        ...dataUpdate,
        password: "",
      });
    }
  }, [dataUpdate]);
  //   dateOfBirth: new Date(dataUpdate?.dateOfBirth).toLocaleDateString(),
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      //   setImageUrl(e.target.value);
    }
  };

  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên tài khoản"),
    fullName: Yup.string().required("Vui lòng nhập họ tên đầy đủ"),
    email: Yup.string()
      .email("Vui lòng nhập đúng định dạng email")
      .required("Vui lòng nhập email"),
    password: Yup.string()
      .min(minLength, `Mật khẩu cần có ít nhất ${minLength} ký tự`)
      .matches(hasNumber, "Mật khẩu cần phải chứa ít nhất 1 spps")
      .matches(hasSpecialChar, "Mật khẩu nên chứa các ký tự đặc biệt")
      .required("Vui lòng nhập mật khẩu"),
    phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
    // dateOfBirth: Yup.date().required("Vui lòng nhập ngày sinh"),
    // gender: Yup.string()
    //   .oneOf(["main", "--"], "Giới tính không hợp lệ")
    //   .required("Vui lòng chọn giới tính"),
    role: Yup.string()
      .oneOf(["user", "admin", "employee", "shipper"], "Vai trò không hợp lệ")
      .required("Vai trò là bắt buộc"),
  });

  const handleUpdateAccount = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values?.fullName);
      formData.append("fullName", values?.fullName);
      formData.append("email", values?.email);
      formData.append("password", values?.password);
      formData.append("phoneNumber", values?.phoneNumber);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("gender", values?.gender);
      formData.append("role", values?.role);
      formData.append("address", values?.address);
      formData.append("isBlock", values?.isBlock);
      formData.append("status", values?.status);
      {
        image && formData.append("image", image);
      }
      console.log("form-data", formData);
      await updateUser({
        id: dataUpdate._id,
        dataAccount: formData,
      }).unwrap();
      toast.success("Cập nhật tài khoản thành công!");
      onClose();
    } catch (error) {
      toast.error("Cập nhật tài khoản thất bại.");
    }
  };

  const handleCreateAccount = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values?.fullName);
      formData.append("fullName", values?.fullName);
      formData.append("email", values?.email);
      formData.append("password", values?.password);
      formData.append("phoneNumber", values?.phoneNumber);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("gender", values?.gender);
      formData.append("role", values?.role);
      formData.append("address", values?.address);
      formData.append("isBlock", values?.isBlock);
      formData.append("status", values?.status);
      {
        image && formData.append("image", image);
      }
      console.log("form-data", formData);
      await createUser({
        dataProduct: formData,
      }).unwrap();
      toast.success("Tạo tài khoản mới thành công!");
      onClose();
    } catch (error) {
      toast.error("Lỗi khi tạo tài khoản.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (dataUpdate) {
        console.log(values);
        handleUpdateAccount(values);
      } else {
        handleCreateAccount(values);
      }
    } catch (error) {
      toast.error("Lỗi trong quá trình lưu thông tin");
    }
  };

  if (!close) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-2xl relative flex items-center flex-col">
        <h2 className="w-full text-center text-2xl font-black text-indigo-500 mb-4">
          {dataUpdate ? "Cập nhật tài khoản" : "Tạo mới tài khoản"}
        </h2>
        <Formik
          initialValues={initialValuess}
          enableReinitialize={true}
          validationSchema={dataUpdate ? "" : validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, setValues, errors }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}

              {/* Avatar Upload */}
              <div className="col-span-1 md:col-span-2 flex justify-center ">
                {/* Hidden file input */}
                <div className="text-center">
                  <input
                    id="avatar"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  {/* Avatar Preview */}
                  {imageUrl && (
                    <img
                      src={imageUrl} // Sử dụng trạng thái `image` để hiển thị ảnh đã tải lên
                      alt="Avatar Preview"
                      className="mt-4 h-24 w-24 rounded-full object-cover"
                    />
                  )}

                  {/* Label for Avatar */}
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700 mt-2 cursor-pointer"
                  >
                    <i className="bi bi-card-image text-xl text-red-400 mr-2"></i>
                    Ảnh đại diện
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <Field
                    name="name"
                    placeholder="Tên tài khoản:"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <Field
                    name="fullName"
                    placeholder="Họ và tên:"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    autoComplete="new-email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full p-2 border rounded"
                    autoComplete="new-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Field
                    name="phoneNumber"
                    placeholder="Số điện thoại"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <Field
                    name="dateOfBirth"
                    type="date"
                    placeholder="Ngày sinh nhật"
                    className="w-full p-2 border rounded"
                    value={
                      values.dateOfBirth
                        ? new Date(values.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setValues({
                        ...values,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Gender */}
                <div>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Role */}
                <div>
                  <Field
                    as="select"
                    name="role"
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="user">Khách hàng</option>
                    <option value="admin">Quản lý</option>
                    <option value="employee">Nhân viên</option>
                    {/* <option value="shipper">Shipper</option> */}
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Address */}
                <div>
                  <div>
                    <Field
                      as="select"
                      name="address"
                      className="w-full p-2 border rounded"
                      value={dataUpdate?.address?.[0]}
                    >
                      <option value="">Chọn địa chỉ</option>
                      {addressList?.data?.length > 0 &&
                        addressList?.data?.map((addr) => (
                          <option
                            key={addr?._id}
                            value={addr?._id}
                          >{`${addr?.street}, ${addr?.district}, ${addr?.city}, ${addr?.state},${addr?.country}`}</option>
                        ))}
                    </Field>
                    <div className="w-full flex justify-end">
                      <label
                        htmlFor=""
                        className="text-red-500 text-sm cursor-pointer"
                        onClick={() => setNewAddressFormVisible(true)}
                      >
                        <i className="bi bi-plus-square"></i>
                      </label>
                    </div>
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Blocked */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="isBlock"
                    className="text-sm font-medium text-gray-700"
                  >
                    Khóa tài khoản:
                  </label>
                  <Field
                    id="isBlock"
                    type="checkbox"
                    name="isBlock"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={creating || updating}
                >
                  {creating || updating ? (
                    <Spinner />
                  ) : dataUpdate ? (
                    "Cập nhật"
                  ) : (
                    "Tạo mới"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Thoát
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <Toaster />
        {isNewAddressFormVisible && (
          <NewAddress
            onClose={() => {
              setNewAddressFormVisible(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CreateUpdateAccount;
