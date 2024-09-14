import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminHome from "./AdminHome";
import formatMoney from "../../utils/formatMoney";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../store/service/productService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
// import Export from '../../utils/Export'
// import { CSVLink } from "react-csv";

import Excel from "../../utils/Excel";
import * as XLSX from "xlsx";

const Products = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  // const [status, setStatus] = useState();
  // const [stock, setStock] = useState();
  const onChangeInput = (e) => {
    setSearchValue(e.target.value);
  };

  const onChangeSort = (field) => {
    // Nếu đang sắp xếp theo trường này và có dấu "-" (giảm dần), thì chuyển về sắp xếp tăng dần
    if (sortValue === `-${field}`) {
      setSortValue(field); // Sắp xếp tăng dần
    } else {
      // Nếu không có dấu "-" hoặc là trường mới, thêm "-" để sắp xếp giảm dần
      setSortValue(`-${field}`);
    }
  };

  const { page = 1 } = useParams();
  const {
    data,
    refetch,
    isFetching,
    isLoading: loadGetPro,
  } = useGetProductsQuery({
    page: page,
    limit: 6,
    ...(searchValue && { name: searchValue }),
    ...(sortValue && { sort: sortValue }),
  });
  const navigate = useNavigate();

  //excel
  const [dataExcel, setDataExcel] = useState([]);
  //
  // function filterProduct(){
  //   if(status) {
  //     if(status===0){

  //     }
  //   }
  // }
  // Xử lý tệp tin tải lên
  const handleFileUpload = (event) => {
    toast.error("Chức năng đang trong giai đoạn bảo hành!!");
    // const file = event.target.files[0];
    // const reader = new FileReader();

    // reader.onload = (e) => {
    //   const dataInput = new Uint8Array(e.target.result);
    //   const workbook = XLSX.read(dataInput, { type: "array" });

    //   // Lấy dữ liệu từ sheet đầu tiên
    //   const sheetName = workbook.SheetNames[0];
    //   const sheet = workbook.Sheets[sheetName];
    //   const json = XLSX.utils.sheet_to_json(sheet);
    //   console.log("json", json);

    //   setDataExcel(json);
    // };

    // reader.readAsArrayBuffer(file);
    // console.log("dataExcel", dataExcel);
  };

  // Sử dụng useEffect để gọi lại khi giá trị tìm kiếm thay đổi
  useEffect(() => {
    refetch();
  }, [searchValue, refetch]);
  // const [proList, setProList] = useState([])

  // const { success } = useSelector(state => state.globalReducer);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //     if (success) {
  //         toast.success(success);
  //     }
  //     return () => {
  //         dispatch(clearMessage());
  //     }
  // }, [success, dispatch]);

  const [delProduct, { isSuccess }] = useDeleteProductMutation();

  const deleteProduct = async (id) => {
    if (window.confirm("Bạn có xác nhận muốn xóa sản phẩm?")) {
      await delProduct(id);
      toast.success("Xóa sản phẩm thành công");
      refetch();
    }
  };

  const onEditProduct = (_pid) => {
    navigate(`/dashboard/products/edit/${_pid}`);
  };
  //Dug cho excel
  const headers = [
    "STT",
    "Name",
    "Color",
    "Price",
    "Stock",
    "Sold",
    "Discount",
    "Category",
    "Status",
  ];

  const dataForCSV =
    data?.data?.map((product, index) => ({
      index: index + 1,
      name: product?.name || "",
      color: product?.color.join(", ") || "",
      price: product?.price || "",
      stock: product?.stock || "",
      sold: product?.sold || "",
      discount: product?.coupons?.discount || "0",
      category: product?.category?.name || "",
      status: product?.status || "",
    })) || [];

  return (
    <AdminHome loadGetPro={isSuccess}>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-end">
          <button className="bg-blue-500 text-white  py-2 px-4 rounded hover:bg-blue-600">
            <Link to="/dashboard/products/create">
              <i className="bi bi-plus-lg text-lg"></i>
            </Link>
          </button>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <input
              type="text"
              placeholder="Tìm sản phẩm theo tên..."
              className="py-2 px-4 w-full outline-none "
              onChange={(e) => onChangeInput(e)}
            />
            <div className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-slate-300 cursor-pointer bg-slate-200">
              <i className="bi bi-search text-lg"></i>
            </div>
          </div>
          {/* Nút "add" */}

          <div className="bg-green-500 !border !border-green-500 text-white hover:bg-white hover:text-green-400 hover:border-green-500 px-4 py-2 rounded cursor-pointer">
            <input
              id="import"
              type="file"
              className="bg-slate-50 !border !border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 px-4 py-2 rounded hidden"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <label htmlFor="import">
              <i className="bi bi-upload text-lg"></i>
            </label>
          </div>

          <Excel dataRow={dataForCSV} dataHeader={headers} />
        </div>
        <Toaster position="top-right" />
      </ScreenHeader>
      {!isFetching ? (
        data?.data?.length > 0 ? (
          <div>
            <table className="w-full bg-slate-300 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="p-3 capitalize text-sm text-black-500 font-medium">
                    STT
                  </th>
                  <th className="p-3 capitalize h- text-sm font-medium text-black-500 flex gap-1 max-w-xs">
                    <span className="mr-2">Tên sản phẩm</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `name` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`name`)}
                    ></i>
                  </th>
                  <th className="p-3 capitalize text-sm  font-medium text-black-500">
                    Màu sắc
                  </th>
                  {/* <th className="p-3 capitalize text-sm  font-medium text-black-500">Sizes</th> */}
                  <th className="p-3 capitalize text-sm   font-medium text-black-500 flex gap-1">
                    <span className="mr-2">Giá</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-price` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`price`)}
                    ></i>
                  </th>
                  <th className="p-3 capitalize text-sm   font-medium text-black-500">
                    <span className="mr-2">Tồn kho</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-stock` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`stock`)}
                    ></i>
                  </th>
                  <th className="p-3 capitalize text-sm   font-medium text-black-500">
                    <span className="mr-2">Đã bán</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-sold` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`sold`)}
                    ></i>
                  </th>
                  <th className="p-3 capitalize text-sm   font-medium text-black-500">
                    <span className="mr-2">Giảm giá</span>
                  </th>
                  <th className="p-3 capitalize text-sm  font-medium text-black-500">
                    Danh mục
                  </th>
                  <th className="p-3 capitalize text-sm  font-medium text-black-500">
                    Trạng thái
                  </th>
                  <th className="p-3 capitalize text-sm  font-medium text-black-500 "></th>
                  {/* <th className="p-3 uppercase text-sm  font-medium text-black-500">Delete</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((product, index) => (
                  <tr
                    className={`${
                      product?.stock < 20 ? "bg-red-300 text-white" : ""
                    } odd:bg-slate-100`}
                    key={product?._id}
                  >
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {index + 1}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black w-60">
                      {product?.name}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black flex items-center float-start">
                      {product?.color.map((c, index) => (
                        <div key={index + `${c}`} className="flex items-center">
                          <span
                            className="mr-2"
                            style={{
                              backgroundColor: c,
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              border: "1px solid #424040",
                            }}
                          ></span>
                          {c.name}
                        </div>
                      ))}
                    </td>
                    {/* <td className="p-3 capitalize text-sm  font-normal text-black">
                                        {product?.sizes.join(', ')}
                                    </td> */}
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {formatMoney(product?.price)}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {product?.stock}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {product?.sold}
                    </td>
                    <td className="p-3 capitalize text-sm  text-left font-normal text-black">
                      {product?.coupons?.discount}%
                    </td>
                    <td className="p-3 capitalize text-sm w-40 text-left font-normal text-black">
                      {product?.category?.name}
                    </td>
                    <td className="p-3 capitalize text-sm  text-left font-normal text-black">
                      {product?.status === "available"
                        ? "còn hàng"
                        : "hết hàng"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black flex flex-row">
                      <button
                        className="btn btn-warning mr-1.5"
                        onClick={() => onEditProduct(product?._id)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger cursor-pointer"
                        onClick={() => deleteProduct(product?._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-28 flex flex-row p-2  0 mb-2 ">
              <label className="" htmlFor="total_counts">
                Tổng tiền:
              </label>
              <input
                id="total_counts"
                className="w-8 border-none"
                value={data?.counts}
                readOnly
              />
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={6}
              count={data.counts}
              path="dashboard/products"
              theme="light"
            />
          </div>
        ) : (
          "Không có sản phẩm nào!"
        )
      ) : (
        <Spinner />
      )}
    </AdminHome>
  );
};

export default Products;
