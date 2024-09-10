import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StarRatings from "../../components/user/StarRatings";
import formatMoney from "../../utils/formatMoney";
import toast, { Toaster } from "react-hot-toast";
import { addItemToWishList } from "../../store/reducer/wishListReducer";
import { addCart } from "../../store/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { useLocation, useParams, Link } from "react-router-dom";
import { useGetProductIdQuery } from "../../store/service/productService";
import "../../screens/user/style_user_css/style/pagedetailproduct.css";
import Wrapper from "../../components/user/Wrapper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Grid, Pagination, Navigation } from "swiper/modules";
import Breadcrumb from "../../components/Breadcrumb";

const PageDetailProduct = () => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isSuccess } = useGetProductIdQuery({ pid });

  useEffect(() => {
    if (isSuccess) {
      setMainImage(data?.data?.images[0]);
    }
  }, [data]);

  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantityBuy, setQuantityBuy] = useState(1);

  const handleImageClick = (img) => {
    setMainImage(img);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleIncrease = () => {
    setQuantityBuy((prevQuantity) => {
      if (prevQuantity < data?.data.stock) {
        return prevQuantity + 1;
      }
      return prevQuantity;
    });
  };

  const handleDecrease = () => {
    setQuantityBuy((prevQuantity) => {
      if (prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity;
    });
  };

  const handleAddCart = () => {
    if (!selectedColor) {
      toast.error("Vui lòng chọn màu trước khi thêm giỏ hàng!!!");
      return;
    }
    dispatch(
      addCart({
        _id: pid,
        name: data?.data?.name,
        price: data?.data?.price,
        color: selectedColor,
        quantity: quantityBuy,
        discount: data?.data?.coupons?.discount,
      })
    );
    toast.success("Thêm vào giỏ hàng thành công");
  };

  const handleCart = () => {
    navigate("/cart");
  };
  //Ngắt link đến thẻ a
  useEffect(() => {
    // Lấy tất cả các thẻ <a> trong div
    const links = document.querySelectorAll(".description_info a");
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });

    // Cleanup function để remove event listener khi component unmount
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", (event) => {
          event.preventDefault();
        });
      });
    };
  }, [pid]);

  // Danh mục yêu thích
  function handleWishList(item) {
    dispatch(addItemToWishList(item));
    toast.success("Đã thêm sản phẩm vào danh mục yêu thích của bạn");
  }

  return (
    <Wrapper onFooter="true">
      <div className="product_detail_wrapper">
        <Toaster className="top-right" />
        <div className="crumb_product_detail">
          <Breadcrumb
            pid={data?.data?.name}
            level1={data?.categories?.level1}
            level2={data?.categories?.level2}
            level3={data?.categories?.level3}
          />
        </div>
        <div className="product_detail_box">
          <div id="page-detail-product" className="image_gallery">
            <img src={mainImage} alt={data?.data?.name} />
            <div className="thumbnail_list">
              {data?.data?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${data?.data?.name} thumbnail ${idx}`}
                  onClick={() => handleImageClick(img)}
                />
              ))}
            </div>
          </div>
          <div className="product_details">
            <div className="name_product_details">
              <h3>{data?.data?.name}</h3>
              <div className="icon_heart">
                {/* thêm hiệu ứng cho thk này */}
                <i className="bi bi-heart"></i>
                <i
                  className="bi bi-heart-fill"
                  onClick={() => handleWishList(data?.data)}
                ></i>
              </div>
            </div>
            <span className="slug-product">
              <b>Mã sản phẩm:&nbsp;</b>
              <p>{data?.data?.slug}</p>
            </span>

            <div className="discount_info">
              <p>Giá:</p>
              <p>
                <b>{formatMoney(data?.data?.money || 0)}</b>
              </p>
              {data?.data?.coupons?.discount > 0 && (
                <div className="discount-coupons">
                  <p className="price-goc">{formatMoney(data?.data?.price)}</p>
                  <p className="giam-gia">
                    - {data?.data?.coupons?.discount || 0} %
                  </p>
                </div>
              )}
            </div>
            <div className="color_options">
              <p>Màu sắc:</p>
              {data?.data?.color?.map((color, idx) => (
                <span
                  key={idx}
                  className={`color_circle ${
                    selectedColor === color ? "selected_color" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                />
              ))}
            </div>
            <div className="quantity-product-sold">
              <p>Số lượng:</p>
              <div className="quantity_selector">
                <span onClick={handleDecrease}>-</span>
                <input type="number" value={quantityBuy} readOnly />
                <span onClick={handleIncrease}>+</span>
              </div>
            </div>

            <div className="sold_quantity">
              <p>
                Số lượng đã bán: {data?.data?.sold > 0 ? data?.data?.sold : 0}
              </p>
            </div>
            <div className="add_to_cart_section">
              <button onClick={handleAddCart} className="add-cart-new">
                {" "}
                <i className="bi bi-cart3"></i> Thêm vào giỏ hàng
              </button>
              <button onClick={handleCart} className="buy-now">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
        <div className="description_info">
          <h4>Mô tả sản phẩm</h4>
          <Link to="/">
            <div
              dangerouslySetInnerHTML={{ __html: data?.data?.description }}
            />
          </Link>
        </div>
        <div className="reviews_section">
          <h4>Đánh giá của người mua:</h4>
          {data?.data?.ratings?.length > 0 ? (
            <div className="reviews_list">
              {/* <div key={index} className="review_item">
                <StarRatings rating={review?.star} />
                <p className="review_comment">{review?.comment}</p>
                <p className="review_author">- {review?.postedBy?.name}-</p>
              </div> */}
              <Swiper
                slidesPerView={3}
                grid={{
                  rows: 1,
                }}
                spaceBetween={20}
                // pagination={{
                //   clickable: true,
                // }}
                // navigation={true}
                modules={[Grid]}
                className="review-slider"
              >
                {data?.data?.ratings?.map((review, index) => (
                  <SwiperSlide key={index}>
                    <div className="review_item">
                      <StarRatings rating={review?.star} />
                      <div className="img_poster">
                        <img src={review?.postedBy?.avatar} alt="User Avatar" />
                        <div className="img_poster_ratings">
                          <p className="review_comment">{review?.comment}</p>
                          <p className="review_author">
                            - {review?.postedBy?.name || "ẩn danh"}-
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="not_ratings_detail_product">
              <p>- Chưa có đánh giá -</p>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default PageDetailProduct;
