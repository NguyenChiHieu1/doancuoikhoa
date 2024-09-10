import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminHome from "./AdminHome";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../store/service/cateService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Excel from "../../utils/Excel";

const Category = () => {
  const [searchValue, setSearchValue] = useState("");

  const onChangeInput = (e) => {
    setSearchValue(e.target.value);
  };

  const { page = 1 } = useParams();
  const {
    data = {},
    refetch,
    isLoading,
  } = useGetCategoriesQuery({
    page: page,
    limit: 5,
    ...(searchValue && { name: searchValue }),
  });
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [searchValue, refetch]);

  const [delCategory, { isSuccess: isSuccDelCat }] =
    useDeleteCategoryMutation();

  const deleteCategory = async (id) => {
    if (window.confirm("Bạn có xác nhận muốn xóa danh mục?")) {
      await delCategory(id);
      toast.success("Xóa danh mục thành công");
      refetch();
    }
  };

  const onEditCategory = (_id) => {
    navigate(`/dashboard/category/edit/${_id}`);
  };

  const headers = [
    { label: "STT", key: "index" },
    { label: "Tên", key: "name" },
    { label: "Mô tả", key: "description" },
    { label: "Danh mục cha", key: "parentCategory" },
    { label: "Trạng thái", key: "status" },
  ];

  const dataForCSV =
    data?.data?.map((category, index) => ({
      index: index + 1,
      name: category?.name || "",
      description: category?.description || "",
      parentCategory: category?.parentCategory?.name || "None",
      status: category?.status || "",
    })) || [];

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-between mb-4">
          {/* Nút "create" */}
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <Link to="/dashboard/category/create">
              <i className="bi bi-plus-lg text-lg"></i>
            </Link>
          </button>
          <div className="flex items-center space-x-4">
            {/* Ô tìm kiếm */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                value={searchValue}
                onChange={(e) => onChangeInput(e)}
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
            <Excel dataRow={dataForCSV} dataHeader={headers} />
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
                    Tên danh mục
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    Mô tả
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    Danh mục cha
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    Trạng thái
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((category, index) => (
                  <tr className="odd:bg-gray-100" key={category?._id}>
                    <td className="p-3 text-sm text-gray-800">{index + 1}</td>
                    <td className="p-3 text-sm text-gray-800">
                      {category?.name}
                    </td>
                    <td className="p-3 text-sm text-gray-800 w-80">
                      {category?.description}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {category?.parentCategory?.name || "None"}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {category?.status}
                    </td>
                    <td className="p-3 text-sm text-gray-800 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => onEditCategory(category?._id)}
                      >
                        <i className="bi bi-pencil text-lg"></i>
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteCategory(category?._id)}
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
              path="dashboard/category"
              theme="light"
            />
          </div>
        ) : (
          "Không có danh mục!"
        )
      ) : (
        <Spinner />
      )}
    </AdminHome>
  );
};

export default Category;
