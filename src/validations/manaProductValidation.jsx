import * as Yup from "yup";

// Hàm kiểm tra ObjectId
const objectIdValidator = Yup.string()
  .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId")
  .required("This field is required");

export const productSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .min(1000, "Price must be at least 1000đ")
    .required("Price is required"),
  stock: Yup.number()
    .min(20, "Stock must be at least 20")
    .required("Stock is required"),
  coupons: objectIdValidator,
  category: objectIdValidator,
  brand: objectIdValidator,
});
