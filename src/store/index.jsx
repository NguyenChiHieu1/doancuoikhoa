import { configureStore } from "@reduxjs/toolkit";
import authService from "./service/authService";
import productService from "./service/productService";
import brandService from "./service/brandService";
import addressService from "./service/addressService";
import couponService from "./service/couponService";
import cateService from "./service/cateService";
import cartUserService from "./service/cartUserService";
import orderService from "./service/orderService";
import paymentService from "./service/paymentService";
import billService from "./service/billService";
import statisticalService from "./service/statisticalService";
//statisticalService
import authReducer from "./reducer/authReducer";
import globalReducer from "./reducer/globalReducer";
import cartReducer from "./reducer/cartReducer";
import wishListReducer from "./reducer/wishListReducer";

const Store = configureStore({
  reducer: {
    [authService.reducerPath]: authService.reducer,
    [productService.reducerPath]: productService.reducer,
    [brandService.reducerPath]: brandService.reducer,
    [addressService.reducerPath]: addressService.reducer,
    [couponService.reducerPath]: couponService.reducer,
    [cateService.reducerPath]: cateService.reducer,
    [cartUserService.reducerPath]: cartUserService.reducer,
    [orderService.reducerPath]: orderService.reducer,
    [paymentService.reducerPath]: paymentService.reducer,
    [billService.reducerPath]: billService.reducer,
    [statisticalService.reducerPath]: statisticalService.reducer,

    authReducer: authReducer,
    globalReducer: globalReducer,
    cartReducer: cartReducer,
    wishListReducer: wishListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      authService.middleware,
      productService.middleware,
      brandService.middleware,
      addressService.middleware,
      couponService.middleware,
      cateService.middleware,
      cartUserService.middleware,
      orderService.middleware,
      paymentService.middleware,
      billService.middleware,
      statisticalService.middleware,
    ]),
});
export default Store;
