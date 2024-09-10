import React from "react";
// import './style/footer.css'
import { Link } from "react-router-dom";
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
                <Link to="">Chính sách bảo hành</Link>
              </li>
              <li>
                <Link to="">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link to="">Giao hàng & Thanh toán</Link>
              </li>
              <li>
                <Link to="">Hướng dẫn mua online</Link>
              </li>
              <li>
                <Link to="">Nội quy cửa hàng</Link>
              </li>
              <li>
                <Link to="">Chất lượng phục vụ</Link>
              </li>
            </ul>
          </div>
          <div className="list_2">
            <ul>
              <li>
                <Link to="">Giới thiệu cửa hàng</Link>
              </li>
              <li>
                <Link to="/contact#vitri">Gửi góp ý, khiếu nại</Link>
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
              <a href="tel:0967.750.342">
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
