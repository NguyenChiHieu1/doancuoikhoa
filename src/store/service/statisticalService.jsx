import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Lấy token từ localStorage hoặc từ redux store
const getToken = (type) => localStorage.getItem(type);

const statisticalService = createApi({
  reducerPath: "statistical",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/statistical/", // Thay đổi baseUrl theo API của bạn
    prepareHeaders: (headers) => {
      const token = getToken("admin-token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint để tạo địa chỉ mới
    getProductData: builder.query({
      // type,limit
      query: (queryString) => {
        const queryPro = new URLSearchParams(queryString).toString();
        return {
          url: `/product-data?${queryPro}`,
          method: "GET",
        };
      },
    }),
    getOrderByStatus: builder.query({
      query: () => ({
        url: "/product-data",
        method: "GET",
      }),
    }),
    getPaymentMethod: builder.query({
      query: () => ({
        url: "/product-data",
        method: "GET",
      }),
    }),
    getRevenueByProduct: builder.query({
      query: () => ({
        url: "/revenue-by-product",
        method: "GET",
      }),
    }),
    //
    getRevenueByTime: builder.query({
      // startDate, endDate, interval
      query: (queryString) => {
        const queryPro = new URLSearchParams(queryString).toString();
        return {
          url: `/revenue-by-time?${queryPro}`,
          method: "GET",
        };
      },
    }),
    //tartDate, endDate, interval
    getOrderCountTime: builder.query({
      query: (queryString) => {
        const queryPro = new URLSearchParams(queryString).toString();
        return {
          url: `/order-count-time?${queryPro}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetProductDataQuery,
  useGetOrderByStatusQuery,
  useGetPaymentMethodQuery,
  useGetOrderCountTimeQuery,
  useGetRevenueByTimeQuery,
  useGetRevenueByProductQuery,
} = statisticalService;

export default statisticalService;
