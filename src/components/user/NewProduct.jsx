import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import './style/newproduct.css'
import { Grid, Pagination, Navigation } from "swiper/modules";
import StarRatings from "./StarRatings";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import formatMoney from "../../utils/formatMoney";
import discount from "../../utils/discount";
// import DetailInfoProduct from "../../screens/user/DetailInfoProduct";
import toast, { Toaster } from "react-hot-toast";
import { addItemToWishList } from "../../store/reducer/wishListReducer";

const NewProduct = ({ dataInput, productSelect }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  // const [itemProduct, setItemProduct] = useState({});
  // const [closeDialog, setCloseDialog] = useState(false);
  // const [add, setProducts] = useState([]);

  // useEffect(() => {
  //   setProducts(dataInput);
  // }, [dataInput]);

  useEffect(() => {
    try {
      let allProducts = Array.isArray(dataInput) ? [...dataInput] : [];

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 60);

      let newProducts = allProducts?.filter((product) => {
        const createdAt = new Date(product?.createdAt);
        return createdAt >= oneWeekAgo;
      });

      setProducts(newProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [dataInput]);

  // Tổng star
  function totalReview(arrReview) {
    let total = 0;
    arrReview.map((item, index) => {
      return (total = parseFloat(item?.star) + total);
    });
    return Math.round(total / arrReview?.length);
  }

  // Danh mục yêu thích
  function handleWishList(item) {
    dispatch(addItemToWishList(item));
    toast.success("Đã thêm sản phẩm vào danh mục yêu thích của bạn");
  }

  return (
    <>
      {products?.length > 0 && (
        <div className="newproduct_content">
          <div className="newproduct_block">
            <div className="newproduct_block_header">
              <div className="title_newpro_main">
                <img src="https://img.icons8.com/glyph-neue/64/26e07f/new.png" />
                <p className="title_newpro_main_p">Sản phẩm mới ra mắt</p>
              </div>
              <div className="title_newpro_main_i">
                <span>
                  <Link to={`/category/#page-vitri`}>Xem tất cả </Link>
                </span>
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
            <Toaster className="top-right" />
            {/* <div className='hr_center'>
                      <hr />
                  </div> */}
            <div className="newproduct_main">
              <div className="newproduct_block_main">
                <div className="slide_newpro">
                  <Swiper
                    slidesPerView={5}
                    grid={{
                      rows: 1,
                    }}
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Grid, Pagination, Navigation]}
                    className="proSwiper"
                  >
                    {products?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="newproduct_iteam">
                          <div>
                            <div className="newproduct_stock">
                              <div className="img_pro_main">
                                <img src={item?.images[0]} alt="" />
                              </div>
                              <div className="icon_new_pro">
                                <img src="/image/slider/new.png" alt="" />
                              </div>
                              <div className="newpro-showcase-actions">
                                <button
                                  className="btn-action-newpro"
                                  onClick={() => handleWishList(item)}
                                >
                                  <i className="bi bi-heart"></i>
                                </button>
                                <button
                                  className="btn-action-newpro"
                                  onClick={() => {
                                    productSelect(item);
                                  }}
                                >
                                  <i className="bi bi-bag-check"></i>
                                </button>
                              </div>
                            </div>
                            <Link
                              to={`/product/${item?._id}#page-detail-product`}
                            >
                              <div className="newproduct_info_stock">
                                <p>{item?.name}</p>
                                <div className="newproduct_iteam_price">
                                  <div>
                                    {formatMoney(
                                      discount(
                                        item?.price,
                                        item?.coupons?.discount
                                      )
                                    )}
                                  </div>
                                  <div className="money_prices_decrease">
                                    <div>{formatMoney(item?.price)}</div>
                                    <div>-{item?.coupons?.discount}%</div>
                                  </div>
                                  <div className="newproduct_review">
                                    <StarRatings
                                      rating={totalReview(item?.ratings)}
                                    />
                                    <span>({item?.totalRatings})</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
          {/* {closeDialog && (
        <DetailInfoProduct
          product={itemProduct}
          onClose={() => setCloseDialog(false)}
        />
      )} */}
        </div>
      )}
    </>
  );
};

export default NewProduct;
