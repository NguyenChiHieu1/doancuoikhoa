import * as Yup from "yup";

// Hàm kiểm tra ObjectId
const objectIdValidator = Yup.string()
  .matches(/^[0-9a-fA-F]{24}$/, "Phải là ObjectId hợp lệ")
  .required("Trường này là bắt buộc");

export const productSchema = Yup.object().shape({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  price: Yup.number()
    .min(1000, "Giá phải ít nhất là 1000đ")
    .required("Giá là bắt buộc"),
  stock: Yup.number()
    .min(20, "Số lượng tồn kho phải ít nhất là 20")
    .required("Số lượng tồn kho là bắt buộc"),
  coupons: objectIdValidator,
  category: objectIdValidator,
  brand: objectIdValidator,
});
