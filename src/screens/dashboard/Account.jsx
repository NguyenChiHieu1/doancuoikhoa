import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminHome from "./AdminHome";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

import {
  //   useGetUsersQuery,
  useDeleteAccountMutation,
  useGetAccountQuery,
} from "../../store/service/authService";
import CreateUpdateAccount from "./CreateUpdateAccount";

const Account = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const navigate = useNavigate();
  const [close, setClose] = useState(false);
  const [valueUpdate, setValueUpdate] = useState({});
  const [userStatus, setUserStatus] = useState();
  const [userBlock, setUserBlock] = useState();
  const [userRole, setUserRole] = useState("");

  const onChangeInput = (e) => {
    setSearchValue(e.target.value);
  };

  const onChangeSort = (field) => {
    if (sortValue === `-${field}`) {
      setSortValue(field);
    } else {
      setSortValue(`-${field}`);
    }
  };

  const { page = 1 } = useParams();
  const [deleteAccount, response] = useDeleteAccountMutation();
  const {
    data,
    refetch,
    isFetching,
    isLoading: loadGetUsers,
  } = useGetAccountQuery({
    page: page,
    limit: 6,
    ...(searchValue && { name: searchValue }),
    ...(sortValue && { sort: sortValue }),
    ...(userStatus && { status: userStatus }),
    ...(userBlock && { isBlock: userBlock }),
    ...(userRole && { role: userRole }),
  });

  const deleteUserHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteAccount({ _id: id });
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  //   const viewUserDetails = (uid) => {
  //     navigate(`/dashboard/users/detail/${uid}`);
  //   };

  //   useEffect(() => {
  //     refetch();
  //   }, [searchValue, refetch]);

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-end">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <i
              className="bi bi-plus-lg text-lg"
              onClick={() => setClose(true)}
            ></i>
          </button>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên.."
              className="py-2 px-4 w-full outline-none"
              onChange={onChangeInput}
            />
            <div className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-slate-300 cursor-pointer bg-slate-200">
              <i className="bi bi-search text-lg"></i>
            </div>
          </div>
          <div className="w-full flex flex-end gap-4">
            <select
              value={userStatus}
              className="p-2 border rounded-lg w-50"
              onChange={(e) => {
                setUserStatus(e.target.value);
                setUserBlock();
                setUserRole("");
              }}
            >
              <option value="">Lọc theo trạng thái online</option>
              <option value="true">Online</option>
              <option value="false">Offline</option>
              {/* <option value="blocked">Blocked</option> */}
            </select>
            <select
              value={userBlock}
              className="p-2 border rounded-lg w-50"
              onChange={(e) => {
                setUserBlock(e.target.value);
                setUserStatus();
                setUserRole("");
              }}
            >
              <option value="">Lọc theo trạng thái tài khoản</option>
              <option value="false">Còn hoạt động</option>
              <option value="true">Đã khóa</option>
              {/* <option value="blocked">Blocked</option> */}
            </select>
            <select
              value={userRole}
              className="p-2 border rounded-lg w-36"
              onChange={(e) => {
                setUserRole(e.target.value);
                setUserBlock();
                setUserStatus();
              }}
            >
              <option value="">Lọc theo vai trò</option>
              <option value="user">Khách hàng</option>
              {/* <option value="shipper">Shipper</option> */}
              <option value="employee">Nhân viên</option>
              <option value="admin">Quản lý</option>
            </select>
          </div>
        </div>
        <Toaster position="top-right" />
      </ScreenHeader>
      {!isFetching ? (
        data?.data?.length > 0 ? (
          <div>
            <table className="w-full bg-slate-300 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  {/* <th className="p-3 uppercase text-xs text-black-500 font-bold">
                    ID
                  </th> */}
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Tên
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    <span>Email</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === `-email` ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort(`email`)}
                    ></i>
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Trạng thái tài khoản
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Đang online
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    Vai trò
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500">
                    <span>Ngày đăng ký</span>
                    <i
                      className={`bi bi-arrow-${
                        sortValue === "-createdAt" ? "up" : "down"
                      } text-black2 hover:text-white cursor-pointer`}
                      onClick={() => onChangeSort("createdAt")}
                    ></i>
                  </th>
                  <th className="p-3 uppercase text-xs font-bold text-black-500"></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((user, index) => (
                  <tr className="odd:bg-slate-100" key={user?._id}>
                    {/* <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {user?._id || "Null"}
                    </td> */}
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {user?.fullName || "Null"}
                    </td>
                    <td className="p-3 text-sm text-left font-normal text-black">
                      {user?.email || "N/A"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left text-indigo-600 font-normal ">
                      {user?.isBlock ? "Đã khóa" : "Hoạt động"}
                    </td>
                    <td className="p-3 capitalize text-sm  text-indigo-600 font-normal text-center">
                      {/* {user?.status ? "Online" : "Off"} */}
                      <span
                        className={`inline-block w-4 h-4 rounded-full mr-2 ${
                          user?.status ? "bg-green-500" : "bg-gray-500"
                        }`}
                      ></span>
                    </td>
                    <td className="p-3 capitalize text-sm text-left text-indigo-600 font-normal ">
                      {user?.role === "user" && "Khách hàng"}
                      {user?.role === "admin" && "Quản lý"}
                      {user?.role === "employee" && "Nhân viên"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {user?.createdAt
                        ? new Date(user?.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal flex flex-row">
                      <button
                        className="btn bg-orange-400 py-1 mr-2 px-5 hover:bg-orange-600"
                        onClick={() => {
                          setValueUpdate(user);
                          setClose(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="bg-red-500 text-white px-5 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteUserHandler(user?._id)}
                      >
                        <i className="bi bi-trash text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-20 flex flex-row p-2  0 mb-2 ">
              <label className="" htmlFor="total_counts">
                Total:
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
              count={data?.counts}
              path="dashboard/account"
              theme="light"
            />
          </div>
        ) : (
          "Không có tài khoản người dùng nào!"
        )
      ) : (
        <Spinner />
      )}
      {close && Object.keys(valueUpdate).length === 0 && (
        <CreateUpdateAccount close={close} onClose={() => setClose(false)} />
      )}
      {close && Object.keys(valueUpdate).length !== 0 && (
        <CreateUpdateAccount
          close={close}
          onClose={() => {
            setClose(false);
            setValueUpdate({});
            refetch();
          }}
          dataUpdate={valueUpdate}
        />
      )}
    </AdminHome>
  );
};

export default Account;
