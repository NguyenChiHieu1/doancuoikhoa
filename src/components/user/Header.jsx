// import './header.css'
import React, { useState, useEffect } from "react";
import {
  useUserLogoutMutation,
  useUseGetInfoUserQuery,
} from "../../store/service/authService";
import { useGetCateLevel123Query } from "../../store/service/cateService";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, addInfo } from "../../store/reducer/authReducer";
import { emptyCart } from "../../store/reducer/cartReducer";
import { useGetAllProductsQuery } from "../../store/service/productService";
import diacritics from "diacritics";

const Header = () => {
  const dispatch = useDispatch();
  const cartArray = useSelector((state) => state?.cartReducer?.cart) || null;
  const userExist =
    useSelector((state) => state?.authReducer?.userToken) || null;
  // const navigate = useNavigate();
  //
  const [accUser, setAccUser] = useState(null);
  const [totalItemCart, setTotalItemCart] = useState(0);
  const [parentCa23, setParentCa23] = useState([]);
  const [backColor, setBackColor] = useState("");
  // search
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  //
  const [userLogout] = useUserLogoutMutation();
  const {
    data: infoUser,
    isSuccess: succesInfoUser,
    refetch,
  } = useUseGetInfoUserQuery(undefined, { skip: !userExist });

  const {
    data: dataCate123,
    isLoading: isLoadCate123,
    isSuccess: isSucGetCate,
  } = useGetCateLevel123Query();

  const {
    data: dataProduct,
    isFetching,
    error,
  } = useGetAllProductsQuery(undefined, { skip: !searchText });
  // ------------------

  function handleSearch() {
    const textS = diacritics.remove(searchText.toLowerCase());

    // Sử dụng filter đúng cách
    let arr = dataProduct?.data?.filter((product) =>
      diacritics.remove(product.name.toLowerCase()).includes(textS)
    );

    if (arr.length > 0) {
      setSearchResults(arr);
    }
    console.log(`${searchText}`, arr);
  }

  // let parent1 = dataCate123?.data?.map((it) => {
  //   return {
  //     _idPa1: it?.parent?._id,
  //     namePa1: it?.parent?.name,
  //   };
  // });
  // useEffect(() => {
  //   if (isSucGetCate) {
  //     console.log("dataCate123", dataCate123);
  //   }
  // }, [isSucGetCate]);

  function arrCateParent23(idp) {
    dataCate123?.data?.forEach((element) => {
      if (element?.parent?._id === idp) {
        // console.log(element?.children);
        setParentCa23(element?.children);
      }
    });
  }

  useEffect(() => {
    if (isSucGetCate) {
      arrCateParent23(dataCate123?.data?.[0]?.parent?._id);
      setBackColor(dataCate123?.data?.[0]?.parent?._id);
    }
  }, [isSucGetCate]);
  // console.log(parent23);
  //
  //Lỗi khi đăng xuất ra khỏi trang cart nhưng bên trang login vẫn chưa out --> reload toàn bộ
  //
  const banner_header_top =
    "https://cdn0.fahasa.com/media/wysiwyg/Thang-08-2024/TrangsinhnhatT8_0824_LDP_Header_1263x60.jpg";

  // useEffect(() => {
  //   if (checkLogin) {
  //     setGetInfo(true);
  //     refetch();
  //   } else {
  //     setGetInfo(false);
  //   }
  // }, [checkLogin]);

  useEffect(() => {
    if (succesInfoUser) {
      setAccUser(infoUser?.data);
    }
  }, [succesInfoUser]);

  useEffect(() => {
    setTotalItemCart(cartArray?.length || 0);
  }, [setTotalItemCart, cartArray]);

  const handlerLogout = async () => {
    await userLogout().unwrap();
    dispatch(logout("user-token"));
    dispatch(emptyCart());
    localStorage.removeItem("user-token");
    localStorage.removeItem("cart");
    setAccUser(null);
    window.location.reload();
  };

  useEffect(() => {
    if (userExist && succesInfoUser && infoUser?.data) {
      try {
        let inputInfo = JSON.stringify(infoUser?.data);
        // console.log(inputInfo);
        localStorage.setItem("info", inputInfo);
      } catch (error) {
        console.error("Failed to save info to localStorage:", error);
      }
    }
  }, [userExist, succesInfoUser, infoUser]);

  return (
    <>
      <div className="home">
        <div className="header">
          <div className="banner_header">
            <div className="image_banner_header">
              <img src={banner_header_top} alt="Banner-top" />
            </div>
          </div>
          <div className="container_header ">
            <div>
              <ul className="container_h">
                <li className="image-logo">
                  <Link to="/">
                    <img src="/image/logo/Hieusach.png" alt="" />
                  </Link>
                </li>
                <li className="icon-menu">
                  <i className="bi bi-grid"></i>
                  <i className="bi bi-chevron-down"></i>
                  <div id="dropdown-menu">
                    <div className="cate-content">
                      <div className="cate-left">
                        <p>Danh mục sản phẩm</p>
                        <ul>
                          {/* map-parent1 */}
                          {dataCate123?.data?.map((it) => (
                            <li
                              key={it?.parent?._id}
                              className="item-cate-left"
                              onClick={() => {
                                arrCateParent23(it?.parent?._id);
                                setBackColor(it?.parent?._id);
                              }}
                              style={
                                backColor === it?.parent?._id
                                  ? {
                                      backgroundColor: " #f73d4b",
                                    }
                                  : {}
                              }
                            >
                              <div>
                                <span
                                  style={
                                    backColor === it?.parent?._id
                                      ? {
                                          color: "#ffffff",
                                        }
                                      : {}
                                  }
                                >
                                  <Link to={`/category/${it?.parent?._id}`}>
                                    {it?.parent?.name}
                                  </Link>
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="hr-vertical"></div>
                      <div className="cate-right">
                        {parentCa23?.map((i23, index) => (
                          <div className="cate-child" key={index}>
                            <ul>
                              <li className="child-item">
                                <div>
                                  <span>
                                    <Link to={`/category/${i23?._id}`}>
                                      {i23?.name}
                                    </Link>
                                  </span>
                                  <hr />
                                </div>
                                <ul className="child-mini">
                                  {i23?.children.length > 0 ? (
                                    i23?.children?.map((i) => (
                                      <li
                                        className="cate-child-child"
                                        key={i._id}
                                      >
                                        <div>
                                          <Link to={`/category/${i?._id}`}>
                                            {i?.name}
                                          </Link>
                                        </div>
                                      </li>
                                    ))
                                  ) : (
                                    <li style={{ color: "#434eed" }}>
                                      ---Đang cập nhật---
                                    </li>
                                  )}
                                </ul>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
                <li className="search-header">
                  <div className="search-item">
                    <input
                      type="text"
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                      className="input-search-p"
                    />
                    <div onClick={handleSearch}>
                      <i className="bi bi-search"></i>
                    </div>
                  </div>
                  {/* {searchResults.length > 0 && ( */}
                  <div className="result_search active">
                    <ul>
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <li key={result?._id} className="li-search">
                            <Link to={`/product/${result?._id}`}>
                              {result?.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li># Không có sản phẩm nào tìm thấy</li>
                      )}
                    </ul>
                  </div>
                  {/* )} */}
                </li>
                <li className="">
                  <div className="cart-item">
                    <i className="bi bi-cart3"></i>
                    <span className="">
                      <Link to="/cart">Giỏ hàng</Link>
                    </span>
                    <div className="cart-badge">{totalItemCart}</div>
                  </div>
                </li>
                <li className="">
                  <div className="cart-item">
                    <div className="dropdown">
                      <div className="dropdown-button">
                        <i className="bi bi-person"></i>
                        <span className="dropdown-tk">
                          {accUser !== null ? (
                            accUser?.name
                          ) : (
                            <Link to="/user/login">Login</Link>
                          )}
                        </span>
                      </div>
                      {accUser !== null && (
                        <div
                          className="dropdown-menu"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                          tabIndex="-1"
                        >
                          <div className="dropdown-content" role="none">
                            <Link to="/personal-info" className="dropdown-item">
                              Thay đổi thông tin
                            </Link>
                            <Link to="/order-detail" className="dropdown-item">
                              Quản lý đơn hàng
                            </Link>
                            {/* <a href="#" className="dropdown-item">
                            Hỗ trợ
                          </a> */}
                            <button
                              onClick={() => handlerLogout()}
                              className="dropdown-item"
                            >
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
