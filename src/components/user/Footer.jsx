import React from "react";
// import './style/footer.css'
const Footer = () => {
  return (
    <div className="footer">
      <div className="container-footer">
        <div className="container_logo">
          <img src="/image/logo/Hieusach.png" alt="" />
          <p>Hiệu sách Mai Hương</p>
        </div>
        <div className="rowfoot1">
          <div className="list1">
            <ul>
              <li>
                <a href="#">Chính sách bảo hành</a>
              </li>
              <li>
                <a href="#">Chính sách đổi trả</a>
              </li>
              <li>
                <a href="#">Giao hàng & Thanh toán</a>
              </li>
              <li>
                <a href="#">Hướng dẫn mua online</a>
              </li>
              <li>
                <a href="#">Nội quy cửa hàng</a>
              </li>
              <li>
                <a href="#">Chất lượng phục vụ</a>
              </li>
            </ul>
          </div>
          <div className="list_2">
            <ul>
              <li>
                <a href="#">Giới thiệu cửa hàng</a>
              </li>
              <li>
                <a href="#">Gửi góp ý, khiếu nại</a>
              </li>
              <span>
                <img src="./image/logo/bct.png" alt="" />
              </span>
            </ul>
          </div>
          <div className="tellphone">
            <div>
              <span>Gọi mua hàng:</span>
              <a href="tel:0369.784.847">
                <i className="bi bi-telephone-fill"></i>
                <b> 0369.784.847 (9:00 - 22:00)</b>
              </a>
            </div>
            <div>
              <span>Gọi tư vấn:</span>
              <a href="0967.750.342">
                <i className="bi bi-telephone-fill"></i>
                <b> 0967.750.342 (9:00 - 17:00)</b>
              </a>
            </div>
          </div>
          <div className="list3">
            <p>Thương hiệu đồng hành cùng cửa hàng</p>
            <ul>
              <li>
                <div className="brand_footer">
                  <div>
                    <img src="/image/logo/deli.png" alt="" />
                  </div>
                  <div>
                    <img src="/image/logo/hongha.png" alt="" />
                  </div>
                </div>
              </li>

              <li>
                <div className="brand_footer">
                  <div>
                    <img src="/image/logo/hungthinh.png" alt="" />
                  </div>
                  <div>
                    <img src="/image/logo/VPP-MG.png" alt="" />
                  </div>
                </div>
              </li>

              <li>
                <img src="/image/logo/thienlong.png" alt="" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="rowfoot2">
        <div className="container_slogan">
          <p>&#169; 2024 - Hiệu Sách Mai Hương - Trao niềm tin nhận giá trị </p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
