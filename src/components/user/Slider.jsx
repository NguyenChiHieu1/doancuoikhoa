import React from "react";
import { Pagination, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import "swiper/css/pagination";
// import './style/slider.css'
const Slider = () => {
  const images = [
    "./image/slider/slider1.webp",
    "./image/slider/slider2.webp",
    "./image/slider/slider3.webp",
    "./image/slider/slider4.webp",
  ];

  const banner = [
    "./image/slider/banner1.webp",
    "./image/slider/banner2.webp",
    "./image/slider/banner1.webp",
    "./image/slider/banner2.webp",
  ];

  return (
    <>
      <div className="slider_banner">
        <div className="slider_ba">
          <div className="slider_content">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
              {images.map((image, index) => (
                <SwiperSlide className="slide" key={index}>
                  <div className="slider_div_image">
                    <img
                      src={image}
                      className="slider_image"
                      alt={`Slide ${index + 1}`}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="banner_content">
            <Swiper
              direction={"vertical"}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              //   className="banner-vertical"
              slidesPerView={2}
              spaceBetween={0}
            >
              {banner.map((im, index) => (
                <SwiperSlide key={index}>
                  <div className="img_slider_banner">
                    <a href="#">
                      <img src={im} alt={`banner${index}`} />
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="promot_list">
        <div className="promot_content">
          <ul className="option_promot">
            <li className="car_free_ship">
              <a href="#">
                <img src="/image/slider/shipped.png" alt="" />
                <span>Miễn phí giao hàng</span>
              </a>
            </li>
            <li className="xa_kho">
              <a href="#">
                <img src="/image/slider/sale.png" />
                <span>Xả kho ưu đãi khủng</span>
              </a>
            </li>
            <li className="kho_voucher">
              <a href="#">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3595/3595867.png"
                  alt=""
                />
                <span>
                  Kho voucher <br />
                  đang chờ bạn
                </span>
              </a>
            </li>
            <li className="tuu_truong">
              <a href="#">
                <img src="/image/slider/back-to-school.png" alt="" />
                <span>
                  Hướng đến ngày
                  <br /> tựu trường
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Slider;
