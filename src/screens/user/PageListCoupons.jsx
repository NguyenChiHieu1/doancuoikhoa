import React from "react";
import "./style_user_css/style/page-post.css";
import Wrapper from "../../components/user/Wrapper";
const PageListCoupons = () => {
  const vouchers = [
    {
      name: "Giảm giá 20% cho đơn hàng đầu tiên",
      description:
        'Sử dụng mã "FIRST20" để nhận ngay 20% giảm giá cho lần mua hàng đầu tiên của bạn.',
      image:
        "https://res.cloudinary.com/dr3f3acgx/image/upload/v1725333575/hieusach_maihuong/nxu9oopudn1p5xdjjhzs.png",
      expiryDate: "2024-09-30",
      code: "DFCH123",
      discount: 30,
      status: true,
      discountProduct: [
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 1 werfewfwef werwerf we rwer werwe r wer ewrwer sdv  fsefe  sedfesf  sefe23 235wef",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 2s",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 1",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 2s",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 1",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 2s",
        },
      ],
    },
    {
      name: "Giảm giá 20% cho đơn hàng đầu tiên",
      description:
        'Sử dụng mã "FIRST20" để nhận ngay 20% giảm giá cho lần mua hàng đầu tiên của bạn.',
      image:
        "https://res.cloudinary.com/dr3f3acgx/image/upload/v1725333575/hieusach_maihuong/nxu9oopudn1p5xdjjhzs.png",
      expiryDate: "2024-09-30",
      code: "DFCH123",
      discount: 30,
      status: true,
      discountProduct: [
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 1",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 2s",
        },
      ],
    },
    {
      name: "Giảm giá 20% cho đơn hàng đầu tiên",
      description:
        'Sử dụng mã "FIRST20" để nhận ngay 20% giảm giá cho lần mua hàng đầu tiên của bạn.',
      image:
        "https://res.cloudinary.com/dr3f3acgx/image/upload/v1725333575/hieusach_maihuong/nxu9oopudn1p5xdjjhzs.png",
      expiryDate: "30/09/2024",
      code: "DFCH123",
      discount: 30,
      status: true,
      discountProduct: [
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 1",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 2s",
        },
      ],
    },
    {
      name: "Giảm giá 20% cho đơn hàng đầu tiên",
      description:
        'Sử dụng mã "FIRST20" để nhận ngay 20% giảm giá cho lần mua hàng đầu tiên của bạn.',
      image:
        "https://res.cloudinary.com/dr3f3acgx/image/upload/v1725333575/hieusach_maihuong/nxu9oopudn1p5xdjjhzs.png",
      expiryDate: "30/09/2024",
      code: "DFCH123",
      discount: 30,
      status: true,
      discountProduct: [
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 1",
        },
        {
          _id: "66c1d32909745cdc74955302",
          name: "Sách 2s",
        },
      ],
    },
  ];

  return (
    <Wrapper>
      <div className="voucher-list">
        <h2 className="title">Kho Voucher Giảm Giá</h2>
        <div className="vouchers-container">
          {vouchers.length === 0 ? (
            <p>Không có voucher nào hiện tại.</p>
          ) : (
            vouchers.map((voucher) => (
              <div className="voucher-card" key={voucher._id}>
                <div className="img-voucher-card">
                  {" "}
                  <img
                    src={voucher.image}
                    alt={voucher.name}
                    className="voucher-image"
                  />
                </div>
                <h3 className="voucher-name">{voucher.name}</h3>
                <p className="voucher-code">
                  Mã: {voucher.code || "Không có mã"}
                </p>
                <p className="voucher-discount">
                  Giảm giá: {voucher.discount}%
                </p>
                <p className="voucher-status">
                  Trạng thái: {voucher.status ? "Còn hiệu lực" : "Hết hiệu lực"}
                </p>
                <p className="voucher-expiry">
                  Hết hạn: {new Date(voucher.expiryDate).toLocaleDateString()}
                </p>
                <h4>Danh sách sản phẩm áp dụng:</h4>
                <ul className="voucher-products">
                  {voucher.discountProduct.length > 0 ? (
                    voucher.discountProduct.map((product) => (
                      <li key={product._id}>{product.name}</li>
                    ))
                  ) : (
                    <li>Không có sản phẩm áp dụng</li>
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default PageListCoupons;
