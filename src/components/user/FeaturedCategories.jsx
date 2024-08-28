import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
// import './style/category.css'
import formatMoney from "../../utils/formatMoney";
import toast, { Toaster } from "react-hot-toast";
import { Grid, Pagination, Navigation } from "swiper/modules";
import StarRatings from "./StarRatings";
import { useDispatch } from "react-redux";
import { addItemToWishList } from "../../store/reducer/wishListReducer";

const FeaturedCategories = ({
  productSelect,
  dataCompoParent,
  dataProduct = [],
}) => {
  const [arrayChild, setArrayChild] = useState([]);
  const [selectid, setSelectId] = useState("");

  useEffect(() => {
    if (dataCompoParent) {
      handleOnClickCateChild(dataCompoParent?.children?.[0]?._id);
    }
  }, [dataCompoParent]);
  function handleOnClickCateChild(id) {
    try {
      let dataGet = [...dataProduct] || [];
      // console.log("dataGet:", dataGet);
      dataGet = dataGet?.filter((it) => {
        return it?.category?.parentCategory === id;
      });
      setSelectId(id);
      setArrayChild(dataGet);
    } catch (error) {
      console.log(error);
    }
  }

  function totalReview(arrReview) {
    let total = 0;
    arrReview.map((item, index) => {
      return (total = parseFloat(item?.star) + total);
    });
    return Math.round(total / arrReview?.length);
  }

  function handleClick(itemm) {
    productSelect(itemm);
    // console.log("itemm", itemm);
  }
  //
  const dispatch = useDispatch();
  function handleWishList(item) {
    dispatch(addItemToWishList(item));
    toast.success("Đã thêm sản phẩm vào danh mục yêu thích của bạn");
  }

  return (
    <>
      <div className="category_view">
        <div className="cateparent_content">
          {/* <div className='name_parent_cate'>
                        
                        <div className="name_parent_viewall">
                            <span><a href="">Xem tất cả </a></span>
                            <i className="bi bi-chevron-right"></i>
                        </div>
                    </div> */}
          <Toaster className="top-right" />
          <div className="name_parent">
            <span>{dataCompoParent?.parent?.name}</span>
          </div>
          <div className="child_cate_content">
            <div className="child_cate_header">
              <Swiper
                slidesPerView={5}
                grid={{
                  rows: 1,
                }}
                spaceBetween={10}
                pagination={{
                  clickable: true,
                }}
                modules={[Grid, Pagination]}
                className=""
              >
                {dataCompoParent?.children?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="child_cate_iteam"
                      onClick={() => handleOnClickCateChild(item?._id)}
                    >
                      <span>{item?.name}</span>
                      <hr
                        style={{
                          visibility:
                            selectid === item._id ? "visible" : "hidden",
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <hr />
            <div className="listProductChild_main">
              <div className="listProductChild_block_main">
                {arrayChild?.length > 0 ? (
                  <div className="slide_newpro">
                    <Swiper
                      slidesPerView={5}
                      grid={{
                        rows: 1,
                      }}
                      spaceBetween={10}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Grid, Pagination]}
                      className="proSwiper"
                    >
                      {arrayChild?.map((item, index) => (
                        <SwiperSlide key={index}>
                          <div className="listProductChild_iteam">
                            <div>
                              <div className="listProductChild_stock">
                                <img src={item?.images[0]} alt="" />
                                <div className="newpro-showcase-actions">
                                  <button
                                    className="btn-action-newpro"
                                    onClick={() => handleWishList(item)}
                                  >
                                    <i className="bi bi-heart"></i>
                                  </button>

                                  <button
                                    className="btn-action-newpro"
                                    onClick={() => handleClick(item)}
                                  >
                                    <i className="bi bi-bag-check"></i>
                                  </button>
                                </div>
                              </div>
                              {/* <div> */}
                              <Link
                                to={`/product/${item?._id}#page-detail-product`}
                              >
                                <div className="div-list-prochild">
                                  <p>{item?.name}</p>
                                  <div className="listProductChild_iteam_price">
                                    <div>{formatMoney(item?.money)}</div>
                                    <div className="money_prices_decrease">
                                      <div>{formatMoney(item?.price)}</div>
                                      <div>-{item?.coupons?.discount}%</div>
                                    </div>
                                    <div className="listProductChild_review">
                                      <StarRatings
                                        rating={totalReview(item.ratings)}
                                      />
                                      <span>({item.totalRatings})</span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                              {/* </div> */}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <p className="not-product-featured">
                    {" "}
                    # Sản phẩm sẽ được cập nhật trong thời gian sớm nhất !!!
                  </p>
                )}
              </div>
            </div>
            <div className="button_viewall">
              <div>
                <span>
                  <Link to={`/category/${selectid}`}>Xem tất cả</Link>
                </span>
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedCategories;
