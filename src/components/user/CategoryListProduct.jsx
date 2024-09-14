import StarRatings from "./StarRatings";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// import { addCart } from "../../store/reducer/cartReducer";
import Spinner from "../Spinner";
import Breadcrumb from "../Breadcrumb";
import Pagination from "../Pagination";
import formatMoney from "../../utils/formatMoney";
// import {} from "../../store/service/authService"
import { addItemToWishList } from "../../store/reducer/wishListReducer";
import toast, { Toaster } from "react-hot-toast";
import DetailInfoProduct from "../../screens/user/PageDetailInfoProduct";

const CategoryListProduct = ({
  data,
  page,
  cid,
  countsProduct,
  setValue,
  isLoading,
  breadcrumbItems,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [itemProduct, setItemProduct] = useState({});
  const [closeDialog, setCloseDialog] = useState(false);
  const totalReview = (ratings) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.star, 0);
    return sum / ratings.length;
  };

  function handleChangeSelect(e) {
    setValue(e.target.value);
    // console.log(e.target.value);
  }
  // wishlist
  function handleWishList(item) {
    // console.log("item", item);
    dispatch(addItemToWishList(item));
    toast.success("Đã thêm sản phẩm vào danh mục yêu thích của bạn");
  }
  //add_cart
  useEffect(() => {
    // Kiểm tra nếu URL chứa "#vitri"
    if (location.hash === "#page-vitri") {
      const vitriElement = document.getElementById("page-vitri");
      if (vitriElement) {
        vitriElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <div className="page_cateproduct_list">
        <div className="arrange_hr">
          <div>
            <div className="page_cateproduct_breadcrumb">
              <div id="page-vitri"></div>
              <Breadcrumb
                level1={breadcrumbItems?.level1}
                level2={breadcrumbItems?.level2}
                level3={breadcrumbItems?.level3}
              />
            </div>
            <hr />
          </div>
          <div className="select_arrange">
            <select name="sort" id="sort" onChange={handleChangeSelect}>
              {/* <option value="">Tất cả</option> */}
              <option value="">Mới nhất</option>
              <option value="money">Giá tăng dần</option>
              <option value="-money">Giá giảm dần</option>
              {/* <option value="-coupons?.">Giảm giá nhiều</option> */}
            </select>
          </div>
        </div>
        {data?.length === 0 && (
          <p className="not-found-product">
            # Không có sản phẩm nào trong danh mục này
          </p>
        )}
        <div className="listproduct">
          <div>
            <Toaster className="top-right" />

            <div className="product-grid">
              {!isLoading ? (
                data?.map((item) => (
                  <div className="cateproduct_iteam" key={item._id}>
                    {/* <div href={`/product/${item.slug}`}> */}
                    <div>
                      <div className="cateroduct_stock_img">
                        <img src={item?.images[0]} alt={item?.name} />
                        <div className="catepro-showcase-actions">
                          <button
                            className="btn-action-catepro"
                            onClick={() => handleWishList(item)}
                          >
                            <i className="bi bi-heart"></i>
                          </button>

                          <button
                            className="btn-action-catepro"
                            onClick={() => {
                              setItemProduct(item);
                              setCloseDialog(true);
                            }}
                          >
                            <i className="bi bi-bag-check"></i>
                          </button>
                        </div>
                      </div>
                      <div className="cate_lpro_discount">
                        <Link to={`/product/${item?._id}#page-detail-product`}>
                          <p>{item?.name}</p>
                          <div className="cateproduct_iteam_price">
                            <div>{formatMoney(item?.money)}</div>
                            <div className="money_prices_decrease_cate">
                              <div>{formatMoney(item?.price)}</div>
                              <div>- {item?.coupons?.discount}%</div>
                            </div>
                            <div className="cateproduct_review">
                              <StarRatings
                                rating={totalReview(item?.ratings)}
                              />
                              <span>({item?.totalRatings})</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
        <Pagination
          page={parseInt(page) || 1}
          perPage={8}
          count={countsProduct || 10}
          path={cid ? `category/${cid}/page` : "category/page"}
          theme="light"
        />
      </div>
      {closeDialog && (
        <DetailInfoProduct
          product={itemProduct}
          onClose={() => setCloseDialog(false)}
        />
      )}
    </>
  );
};

export default CategoryListProduct;
