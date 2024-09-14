import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Wrapper from "../../components/user/Wrapper";
import "./style_user_css/style/contact.css";
import { useSelector } from "react-redux";

const Contact = () => {
  const info = useSelector((state) => state.authReducer.info);
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra nếu URL chứa "#vitri"
    if (location.hash === "#vitri") {
      const vitriElement = document.getElementById("vitri");
      if (vitriElement) {
        vitriElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  function submitHandler() {
    console.log("Form submitted");
  }
  return (
    <Wrapper>
      <div className="body_lienhe">
        <div id="vitri"></div>
        {/* <div>
          <span>
            <i className="bi bi-house-door"></i> Trang chủ
            <i className="bi bi-chevron-compact-right"></i>
            Liên hệ
          </span>
        </div> */}
        <div className="lienhe">
          <div className="form_lienhe">
            <div className="left">
              <div className="icon">
                <i className="bi bi-geo-alt"></i>
              </div>
              <span>Xã Nghĩa Lạc, Huyện Nghĩa Hưng, Tỉnh Nam Định</span>
            </div>
            <div className="left">
              <div className="icon">
                <i className="bi bi-phone"></i>
              </div>
              <span>+84369784847</span>
            </div>
            <div className="left">
              <div className="icon">
                <i className="bi bi-envelope"></i>
              </div>
              <span>chihieunc1999@gmail.com</span>
            </div>
            <b></b>
            <div className="form">
              <span>Liên hệ với chúng tôi</span>
              <form action="" onSubmit={submitHandler}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={info?.name || ""}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={info?.email || ""}
                  />
                </div>
                <div className="form-group">
                  <textarea placeholder="Nội dung"></textarea>
                </div>
                <div className="button-lienhe">
                  <button type="submit">Gửi liên hệ</button>
                </div>
              </form>
            </div>
          </div>
          <div className="address_lienhe">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17822.08737796751!2d106.17007928380265!3d20.107649983855293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313612c0a2de5cf9%3A0x9752fbfd7caaf7d8!2zTmdoxKlhIEzhuqFjLCBOZ2jEqWEgSMawbmcgRGlzdHJpY3QsIE5hbSBEaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1725932243569!5m2!1sen!2s"
              width="600"
              height="600"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Contact;
