import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminHome from "./AdminHome";
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
} from "../../store/service/couponService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import formatMoney from "../../utils/formatMoney";

const Coupons = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");

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
  const {
    data,
    refetch,
    isFetching,
    isLoading: loadGetCoupons,
  } = useGetCouponsQuery({
    page: page,
    limit: 5,
    ...(searchValue && { name: searchValue }),
    ...(sortValue && { sort: sortValue }),
  });
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [searchValue, refetch]);

  const [delCoupon, { isSuccess }] = useDeleteCouponMutation();

  const deleteCoupon = async (id) => {
    if (window.confirm("Bạn có xác nhận muốn xóa mã giảm giá?")) {
      await delCoupon(id);
      toast.success("Xóa mã giảm giá thành công");
      refetch();
    }
  };

  const onEditCoupon = (cid) => {
    navigate(`/dashboard/coupons/edit/${cid}`);
  };

  const filteredCoupons = data?.data?.filter(
    (coupon) => !/^Default(-\d+)?$/.test(coupon.name)
  );

  return (
    <AdminHome loadGetCoupons={isSuccess}>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-end">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <Link to="/dashboard/coupons/create">
              <i className="bi bi-plus-lg text-lg"></i>
            </Link>
          </button>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <input
              type="text"
              placeholder="Search..."
              className="py-2 px-4 w-full outline-none"
              onChange={(e) => onChangeInput(e)}
            />
            <div className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-slate-300 cursor-pointer bg-slate-200">
              <i className="bi bi-search text-lg"></i>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </ScreenHeader>
      {!isFetching ? (
        filteredCoupons.length > 0 ? (
          <div>
            <table className="w-full bg-slate-300 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    STT
                  </th>
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    Name
                  </th>
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    Code
                  </th>
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    Discount (%)
                  </th>
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    Expiry Date
                  </th>
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    Status
                  </th>
                  <th className="p-3 uppercase text-sm text-black-500 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon, index) => (
                  <tr className="odd:bg-slate-100" key={coupon?._id}>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {index + 1}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {coupon?.name}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {coupon?.code}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {coupon?.discount}%
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {new Date(coupon?.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black">
                      {coupon?.status ? "Active" : "Inactive"}
                    </td>
                    <td className="p-3 capitalize text-sm text-left font-normal text-black flex flex-row">
                      <button
                        className="btn btn-warning mr-1.5"
                        onClick={() => onEditCoupon(coupon?._id)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger cursor-pointer"
                        onClick={() => deleteCoupon(coupon?._id)}
                      >
                        <i className="bi bi-trash"></i>
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
              path="dashboard/coupons"
              theme="light"
            />
          </div>
        ) : (
          "No coupons!"
        )
      ) : (
        <Spinner />
      )}
    </AdminHome>
  );
};

export default Coupons;
