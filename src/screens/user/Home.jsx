import React, { useState, useEffect } from "react";
import Slider from "../../components/user/Slider";
import HotDealProduct from "../../components/user/HotDealProduct";
// import ViewProduct from "../../components/user/ViewProduct"
import NewProduct from "../../components/user/NewProduct";
import FeaturedCategories from "../../components/user/FeaturedCategories";
import Wrapper from "../../components/user/Wrapper";
import DetailInfoProduct from "./PageDetailInfoProduct";
// import React, {useState, useEffect}  from 'react'
// import './style_user_css/style/header.css'
import "./style_user_css/style/slider.css";
import "./style_user_css/style/productHotDeal.css";
import "./style_user_css/style/newproduct.css";
import "./style_user_css/style/featuredCategories.css";
// import './style_user_css/style/footer.css'
import { useGetAllProductsQuery } from "../../store/service/productService";
import { useGetCateLevel123Query } from "../../store/service/cateService";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.authReducer.info);
  // JSON.stringify
  const { data: dataAllProduct, isSuccess: isSucAllPro } =
    useGetAllProductsQuery();

  const {
    data: dataCate123,
    isLoading: isLoadCate123,
    isSuccess: isSucGetCate,
  } = useGetCateLevel123Query();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemRandom, setItemRandom] = useState([]);

  function getRandomItems(arr, num) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }
  async function wistlistInput() {
    if (user?.wishlist?.length > 0 && dataAllProduct?.data?.length > 0) {
      let arr = [];
      user.wishlist.forEach((item) => {
        arr.push(dataAllProduct?.data.find((product) => product._id === item));
      });
      await localStorage.setItem("wishList", JSON.stringify(arr));
    }
  }

  useEffect(() => {
    try {
      if (isSucGetCate && Array.isArray(dataCate123?.data)) {
        let arrCate = [...dataCate123?.data] || [];
        let arr = getRandomItems(arrCate, 3);

        setItemRandom(arr);
        // console.log("itemRandom:", arr);
        wistlistInput();
      }
    } catch (error) {
      console.log(error);
    }
  }, [dataCate123]);
  //

  return (
    <>
      <Wrapper onFooter={true}>
        <Slider />
        {/* Ổn không sửa */}
        {isSucAllPro && (
          <>
            <NewProduct
              dataInput={dataAllProduct?.data}
              productSelect={(item) => {
                setSelectedProduct(item);
              }}
            />
            <HotDealProduct
              dataInput={dataAllProduct?.data}
              productSelect={(item) => setSelectedProduct(item)}
            />
          </>
        )}
        {/* Ổn không sửa */}

        {/* Ổn không sửa */}
        {/* Danh sách các sản phẩm theo danh mục */}
        {itemRandom?.map((item, index) => {
          return (
            <FeaturedCategories
              productSelect={(item) => setSelectedProduct(item)}
              dataCompoParent={item}
              dataProduct={dataAllProduct?.data}
              key={index}
            />
          );
        })}
        {/* Ổn không sửa */}

        {/* Thêm sản phẩm vào giỏ hàng */}
        {selectedProduct && (
          <DetailInfoProduct
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Wrapper>
    </>
  );
};

export default Home;
