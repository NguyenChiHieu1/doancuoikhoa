import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
// import './style/product.css'
// import 'swiper/css/navigation';
import formatMoney from "../../utils/formatMoney";
// import required modules
import { Grid, Pagination, Navigation } from "swiper/modules";

import { Link } from "react-router-dom";
import DetailInfoProduct from "../../screens/user/PageDetailInfoProduct";
import toast, { Toaster } from "react-hot-toast";
import { addItemToWishList } from "../../store/reducer/wishListReducer";
import { useDispatch } from "react-redux";

const HotDealProduct = ({ productSelect, dataInput = [] }) => {
  const currentDate = new Date(); // Lấy ngày hiện tại
  const currentMonth = currentDate.getMonth() + 1;
  const [dataHotDeal, setDataHotDeal] = useState([]);

  useEffect(() => {
    try {
      if (dataInput?.length > 0) {
        let sortedProducts = [...dataInput].sort(
          (a, b) =>
            parseFloat(b?.coupons?.discount) - parseFloat(a?.coupons?.discount)
        );
        let top20Products = sortedProducts.slice(0, 20);
        setDataHotDeal(top20Products);
      }
    } catch (error) {
      console.error("Error processing data input in HotDealProduct:", error);
    }
  }, [dataInput]);

  function handleClick(itemm) {
    productSelect(itemm);
    // console.log("itemm", itemm);
  }

  const dispatch = useDispatch();
  function handleWishList(item) {
    dispatch(addItemToWishList(item));
    toast.success("Đã thêm sản phẩm vào danh mục yêu thích của bạn");
  }

  return (
    <>
      <div className="hotdeal_content">
        <div className="hotdeal_block">
          <div className="hotdeal_block_header">
            <div className="gvdshock">
              <Toaster className="top-right" />

              <div className="gvdshock_main">
                <i className="bi bi-gift"></i>
                <h3>Hot Deal tháng {currentMonth}</h3>
                <div className="gvdshock_endtime_main">
                  {/* <span>Kết thúc trong</span>
                                    <span className="gvdshock_endtime">
                                        <label for="">00</label>
                                        <span>:</span>
                                        <label for="">28</label>
                                        <span>:</span>
                                        <label for="">12</label>
                                    </span> */}
                </div>
              </div>
            </div>
            {/* <div className="listing_timeline">
              <span>Thời gian diễn ra</span>
              <span>Từ 20/08/2024 - 23/08/2024</span>
              <span></span>
            </div> */}
          </div>
          {/* <div className='hr_center'>
                        <hr />
                    </div> */}
          <div className="hotdeal_main">
            <div className="hotdeal_block_main">
              <div className="slide_slick_active">
                <Swiper
                  slidesPerView={5}
                  grid={{
                    rows: 2,
                  }}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  // navigation={true}

                  modules={[Grid, Pagination]}
                  className="mySwiper"
                >
                  {dataHotDeal?.length > 0 ? (
                    dataHotDeal?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="hotdeal_iteam">
                          <div>
                            <div className="product_stock_hotdeal">
                              <img src={item.images[0]} alt="" />

                              <div className="hotdeal-showcase-actions">
                                <button
                                  className="btn-action-hotdeal"
                                  onClick={() => handleWishList(item)}
                                >
                                  <i className="bi bi-heart-fill"></i>
                                </button>
                                <button
                                  className="btn-action-hotdeal"
                                  onClick={() => handleClick(item)}
                                >
                                  <i className="bi bi-bag-check-fill"></i>
                                </button>
                              </div>
                            </div>

                            <div>
                              <Link
                                to={`/product/${item?._id}#page-detail-product`}
                              >
                                <p>{item.name}</p>
                                <div className="hotdeal_iteam_price">
                                  <div>
                                    {formatMoney(
                                      parseFloat(item.price) -
                                        (parseFloat(item.price) *
                                          parseFloat(item.coupons.discount)) /
                                          100
                                    )}
                                  </div>
                                  <div className="money_prices_decrease">
                                    <div>{formatMoney(item.price)}</div>
                                    <div>- {item.coupons.discount}%</div>
                                  </div>
                                  <div className="product_sold">
                                    {/* <img src="/image/main-container/hotdeal-block/icon_fire.webp" alt="" /> */}
                                    <span className="rq_count_fscount ">
                                      <i></i>
                                      <b>
                                        Còn{" "}
                                        {parseFloat(item.stock) -
                                          parseFloat(item.sold)}
                                        /{parseFloat(item.stock)} suất
                                      </b>
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p>No products available</p>
                  )}
                </Swiper>
                <div className="button_hotdeal">
                  <button>
                    <Link to={"/category/#page-vitri"}>Xem thêm</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotDealProduct;
