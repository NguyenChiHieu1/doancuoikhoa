import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AdminLogin from "../screens/dashboard/AdminLogin.jsx";
import Products from "../screens/dashboard/Products.jsx";
import UserLogin from "../screens/user/UserLogin.jsx";
import Private from "./Private.jsx";
import Public from "./Public.jsx";
import UserRoute from "./UserRoute.jsx";
import UserAuthRoute from "./UserAuthRoute.jsx";
import CreateProduct from "../screens/dashboard/CreateProduct.jsx";
import EditProduct from "../screens/dashboard/EditProduct.jsx";
import UserRegister from "../screens/user/UserRegister.jsx";
import ForgotPassword from "../screens/user/ForgotPassword.jsx";
import ResetPassword from "../screens/user/ResetPassword.jsx";
import Home from "../screens/user/Home.jsx";
import PageCategoryProduct from "../screens/user/PageCategoryProduct.jsx";
import Category from "../screens/dashboard/Category.jsx";
import CreateCategory from "../screens/dashboard/CreateCategory.jsx";
import EditCategory from "../screens/dashboard/EditCategory.jsx";
import Coupons from "../screens/dashboard/Coupons.jsx";
import Order from "../screens/dashboard/Order.jsx";
import DetailOrder from "../screens/dashboard/DetailOrder.jsx";
import Brands from "../screens/dashboard/Brands.jsx";
import CreateBrands from "../screens/dashboard/CreateBrands.jsx";
import EditBrand from "../screens/dashboard/EditBrand.jsx";
import StatisRevenue from "../screens/dashboard/statistical/StatisRevenue.jsx";
import RevenueLineChart from "../screens/dashboard/statistical/RevenueLineChart.jsx";
import Bill from "../screens/dashboard/Bill.jsx";
import Account from "../screens/dashboard/Account.jsx";
// import CreateCoupons from "../screens/dashboard/CreateCoupons.jsx"
// import EditCoupons from "../screens/dashboard/EditCoupons.jsx"
// import Test from "../screens/user/Test.jsx";

import PageCart from "../screens/user/PageCart.jsx";
import PageOrderDetail from "../screens/user/PageOrderDetail.jsx";
import ViewOrderDetail from "../screens/user/ViewOrderDetail.jsx";
import PagePersonalInfo from "../screens/user/PagePersonalInfo.jsx";
// import Breadcrumb from "../components/Breadcrumb.jsx";
import PageNotFound from "../screens/user/PageNotFound.jsx";
import PageDetailProduct from "../screens/user/PageDetailProduct.jsx";
import PageListCoupons from "../screens/user/PageListCoupons.jsx";
import Contact from "../screens/user/Contact.jsx";

const Routing = () => {
  console.log("Routing component rendered");
  return (
    <BrowserRouter>
      {/* <BreadcrumbWrapper /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<PageCart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:pid" element={<PageDetailProduct />} />
        <Route path="/list-coupon">
          <Route index element={<PageListCoupons />} />
        </Route>
        <Route path="/category">
          <Route index element={<PageCategoryProduct />} />
          <Route path="page/:page" element={<PageCategoryProduct />} />
          <Route path=":cid">
            <Route index element={<PageCategoryProduct />} />
            <Route path="page/:page" element={<PageCategoryProduct />} />
          </Route>

          {/* <Route path="sub-category/:subCid">
            <Route index element={<CategoryProduct />} />
            <Route path="page/:page" element={<CategoryProduct />} />
            <Route path="sub-sub-category/:subSubCid">
              <Route index element={<CategoryProduct />} />
              <Route path="page/:page" element={<CategoryProduct />} />
            </Route>
          </Route> */}
        </Route>
        {/* <Route path="/category/">
          <Route index element={<CategoryProduct />} />
          <Route path="page/:page" element={<CategoryProduct />} />
          <Route path="product/:pid" element={<PageDetailProduct />} />
        </Route> */}

        <Route element={<UserAuthRoute />}>
          <Route path="/user">
            <Route path="login" element={<UserLogin />} />
            <Route path="register" element={<UserRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route
              path="reset-password/:resetCode"
              element={<ResetPassword />}
            />
          </Route>
        </Route>
        <Route element={<UserRoute />}>
          <Route path="/personal-info" element={<PagePersonalInfo />} />
          <Route path="/order-detail">
            <Route index element={<PageOrderDetail />} />
            <Route path=":page" element={<PageOrderDetail />} />
            <Route path="view/:oid" element={<ViewOrderDetail />} />
          </Route>
        </Route>
        <Route path="/auth">
          <Route
            path="admin-login"
            element={
              <Public>
                <AdminLogin />
              </Public>
            }
          />
        </Route>
        <Route path="/dashboard">
          <Route path="products">
            <Route
              index
              element={
                <Private>
                  <Products />
                </Private>
              }
            />
            <Route
              path=":page"
              element={
                <Private>
                  <Products />
                </Private>
              }
            />
            <Route
              path="create"
              element={
                <Private>
                  <CreateProduct />
                </Private>
              }
            />
            <Route
              path="edit/:pid"
              element={
                <Private>
                  <EditProduct />
                </Private>
              }
            />
          </Route>
          <Route path="category">
            <Route
              index
              element={
                <Private>
                  <Category />
                </Private>
              }
            />
            <Route
              path="create"
              element={
                <Private>
                  <CreateCategory />
                </Private>
              }
            />
            <Route
              path="edit/:cid"
              element={
                <Private>
                  <EditCategory />
                </Private>
              }
            />
            <Route
              path=":page"
              element={
                <Private>
                  <Category />
                </Private>
              }
            />
          </Route>
          <Route path="coupons">
            <Route
              index
              element={
                <Private>
                  <Coupons />
                </Private>
              }
            />
            <Route
              path=":page"
              element={
                <Private>
                  <Coupons />
                </Private>
              }
            />
          </Route>
          <Route path="orders">
            <Route
              index
              element={
                <Private>
                  <Order />
                </Private>
              }
            />
            <Route
              path=":page"
              element={
                <Private>
                  <Order />
                </Private>
              }
            />
            <Route
              path="detail/:oid"
              element={
                <Private>
                  <DetailOrder />
                </Private>
              }
            />

            {/* <Route
              path=":page"
              element={
                <Private>
                  <Coupons />
                </Private>
              }
            /> */}
          </Route>
          <Route path="brands">
            <Route
              index
              element={
                <Private>
                  <Brands />
                </Private>
              }
            />
            <Route
              path="create"
              element={
                <Private>
                  <CreateBrands />
                </Private>
              }
            />
            <Route
              path="edit/:bid"
              element={
                <Private>
                  <EditBrand />
                </Private>
              }
            />
            <Route
              path=":page"
              element={
                <Private>
                  <Brands />
                </Private>
              }
            />
          </Route>
          <Route path="statistical">
            {/* <Route
              index
              element={
                <Private>
                  <StatisRevenue />
                </Private>
              }
            /> */}
            <Route
              path="line-chart"
              element={
                <Private>
                  <RevenueLineChart />
                </Private>
              }
            />
          </Route>
          <Route path="account">
            <Route
              index
              element={
                <Private>
                  <Account />
                </Private>
              }
            />
            <Route
              path=":page"
              element={
                <Private>
                  <Account />
                </Private>
              }
            />
            {/* <Route
              path="line-chart"
              element={
                <Private>
                  <RevenueLineChart />
                </Private>
              }
            /> */}
          </Route>
          <Route path="bills">
            <Route
              index
              element={
                <Private>
                  <Bill />
                </Private>
              }
            />
            <Route
              path=":page"
              element={
                <Private>
                  <Bill />
                </Private>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Routing;
