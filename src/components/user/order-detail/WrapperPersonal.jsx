import React from "react";
import NavBarOrder from "./NavBarOrder";
import Wrapper from "../../../components/user/Wrapper";
import Breadcrumb from "../../Breadcrumb";
const WrapperPersonal = ({ children }) => {
  return (
    <>
      <Wrapper onFooter={false}>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            margin: "16px 0",
          }}
        >
          <div style={{ width: "80%", left: 0 }}>
            <Breadcrumb colorBread={true} />
          </div>
          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "row",
              height: "100%",
            }}
          >
            <NavBarOrder />
            <div
              style={{
                width: "100%",
                marginLeft: "20px",
                // background: "#000",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default WrapperPersonal;
