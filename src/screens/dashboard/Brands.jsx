import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminHome from "./AdminHome";
import {
  useDeleteBrandMutation,
  useGetBrandsQuery,
} from "../../store/service/brandService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Excel from "../../utils/Excel";

const Brands = () => {
  const [searchValue, setSearchValue] = useState("");
  const { page = 1 } = useParams();
  const navigate = useNavigate();

  // Lấy tất cả thương hiệu từ API
  const {
    data = {},
    refetch,
    isLoading,
  } = useGetBrandsQuery({
    page: page,
    limit: 5,
    ...(searchValue && { name: searchValue }),
  });

  useEffect(() => {
    refetch();
  }, [searchValue]);

  const [delBrand] = useDeleteBrandMutation();

  const deleteBrand = async (id) => {
    if (window.confirm("Bạn có xác nhận muốn xóa thương hiệu?")) {
      try {
        await delBrand(id);
        toast.success("Xóa thương hiệu thành công");
        refetch();
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa thương hiệu");
      }
    }
  };

  const onEditBrand = (_id) => {
    navigate(`/dashboard/brands/edit/${_id}`);
  };

  // const headers = [
  //   { label: "STT", key: "index" },
  //   { label: "Name", key: "name" },
  //   { label: "Address", key: "address" },
  //   { label: "Phone", key: "phone" },
  //   { label: "Email", key: "email" },
  // ];

  // const dataForCSV =
  //   data?.data?.map((brand, index) => ({
  //     index: index + 1,
  //     name: brand?.name || "",
  //     address: brand?.address?.join(", ") || "None",
  //     phone: brand?.phone || "",
  //     email: brand?.email || "",
  //   })) || [];

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-between mb-4">
          {/* Nút "create" */}
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <Link to="/dashboard/brands/create">
              <i className="bi bi-plus-lg text-lg"></i>
            </Link>
          </button>
          <div className="flex items-center space-x-4">
            {/* Ô tìm kiếm */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="py-2 px-4 w-full outline-none"
              />
              <div className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-slate-300 cursor-pointer bg-slate-200">
                <i className="bi bi-search text-lg"></i>
              </div>
            </div>
            {/* Nút "Import" */}
            {/* <div className="bg-green-500 !border !border-green-500 text-white hover:bg-white hover:text-green-400 hover:border-green-500 px-4 py-2 rounded cursor-pointer">
              <input
                id="import"
                type="file"
                className="bg-slate-50 !border !border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 px-4 py-2 rounded hidden"
                accept=".xlsx, .xls"
              />
              <label htmlFor="import">
                <i className="bi bi-upload text-lg"></i>
              </label>
            </div> */}
            {/* Nút "Export" */}
            {/* <Excel dataRow={dataForCSV} dataHeader={headers} /> */}
          </div>
        </div>
        <Toaster position="top-right" />
      </ScreenHeader>
      {!isLoading ? (
        data?.data?.length > 0 ? (
          <div>
            <table className="w-full bg-gray-200 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left bg-gray-300">
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    STT
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    Tên
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    Địa chỉ
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    Số điện thoại
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((brand, index) => (
                  <tr className="odd:bg-gray-100" key={brand?._id}>
                    <td className="p-3 text-sm text-gray-800">{index + 1}</td>
                    <td className="p-3 text-sm text-gray-800">{brand?.name}</td>
                    <td className="p-3 text-sm text-gray-800">
                      {brand?.address?.map((item, i) => (
                        <div key={i}>
                          {" "}
                          Địa chỉ {`${i + 1}:`}
                          {`${item.street}, ${item.district}, ${item.city}, ${item.country} `}
                          {/* Xuống dòng sau mỗi địa chỉ trừ địa chỉ cuối cùng */}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {brand?.phone}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {brand?.email}
                    </td>
                    <td className="p-3 text-sm text-gray-800 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => onEditBrand(brand?._id)}
                      >
                        <i className="bi bi-pencil text-lg"></i>
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteBrand(brand?._id)}
                      >
                        <i className="bi bi-trash text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={parseInt(page)}
              perPage={5}
              count={data.counts}
              path="dashboard/brands"
              theme="light"
            />
          </div>
        ) : (
          "No brands!"
        )
      ) : (
        <Spinner />
      )}
    </AdminHome>
  );
};

export default Brands;
