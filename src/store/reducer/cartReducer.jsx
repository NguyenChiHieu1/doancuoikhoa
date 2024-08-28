import { createSlice } from "@reduxjs/toolkit";
import discount from "../../utils/discount";

// Lấy dữ liệu giỏ hàng từ localStorage
const cartData = localStorage.getItem("cart");
const cartArray = cartData ? JSON.parse(cartData) : [];

// Hàm tính tổng số lượng sản phẩm trong giỏ hàng
function allItems(data) {
  return data.reduce((total, item) => total + item.quantity, 0);
}

function selectedCart(data) {
  let cartItemSelected = data.filter((item) => {
    return item.isSelected === true;
  });
  return cartItemSelected;
}

function selectedItem(data) {
  let total = 0;
  let cartSelectItem = data.filter((item) => {
    return item.isSelected === true;
  });
  // console.log(cartSelectItem.length);
  cartSelectItem.map((item) => {
    total += item.quantity;
  });
  return total;
}

// Hàm áp dụng mã giảm giá
function applyCoupon(amount, coupon) {
  // Giả sử mã giảm giá là giảm % trên tổng số tiền
  return amount * (1 - coupon.discountPercentage / 100);
}

// Hàm tính tổng số tiền của các sản phẩm trong giỏ hàng
function calcuateTotal(data) {
  return data.reduce((total, item) => {
    const basePrice = item.price * item.quantity;

    // Tính toán giá sau khi áp dụng discount
    const discountPrice = discount(item.price, item.discount) * item.quantity;

    // Nếu có coupon, tính toán giá sau khi áp dụng coupon
    const couponPrice = item.coupon
      ? applyCoupon(basePrice, item.coupon)
      : basePrice;

    // Chọn giá trị nhỏ hơn giữa discountPrice và couponPrice
    const finalPrice = Math.min(discountPrice, couponPrice);

    return total + finalPrice;
  }, 0);
}

// Hàm tính tổng số tiền của các sản phẩm được chọn
function calculateSelectedTotal(data) {
  return data.reduce((total, item) => {
    if (item.isSelected) {
      const basePrice = item.price * item.quantity;

      // Tính toán giá sau khi áp dụng discount
      const discountPrice = discount(item.price, item.discount) * item.quantity;

      // Nếu có coupon, tính toán giá sau khi áp dụng coupon
      const couponPrice = item.coupon
        ? applyCoupon(basePrice, item.coupon)
        : basePrice;

      // Chọn giá trị nhỏ hơn giữa discountPrice và couponPrice
      const finalPrice = Math.min(discountPrice, couponPrice);

      return total + finalPrice;
    }
    return total;
  }, 0);
}

// Tạo slice cho giỏ hàng
const cartReducer = createSlice({
  name: "cart",
  initialState: {
    cart: cartArray.length > 0 ? cartArray : [],
    items: cartArray.length > 0 ? allItems(cartArray) : 0,
    total: cartArray.length > 0 ? calcuateTotal(cartArray) : 0,
    selectedCart: cartArray.length > 0 ? selectedCart(cartArray) : [],
    selectedItem: cartArray.length > 0 ? selectedItem(cartArray) : 0,
    selectedTotal: cartArray.length > 0 ? calculateSelectedTotal(cartArray) : 0,
  },
  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    addCart: (state, { payload }) => {
      const existingItem = state.cart.find(
        (item) => item._id === payload._id && item.color === payload.color
      );
      if (existingItem) {
        existingItem.quantity += payload.quantity;
      } else {
        state.cart.push({ ...payload, isSelected: false, coupon: 0 });
      }

      state.items = allItems(state.cart);
      state.total = calcuateTotal(state.cart);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    // Tăng số lượng sản phẩm
    incQuantity: (state, { payload }) => {
      const findIndex = state.cart.findIndex(
        (item) => item._id === payload._id && item.color === payload.color
      );
      if (findIndex !== -1) {
        state.cart[findIndex].quantity += 1;
        state.items += 1;
        state.total = calcuateTotal(state.cart);
        state.selectedItem = selectedItem(state.cart);
        state.selectedTotal = calculateSelectedTotal(state.cart);
        state.selectedCart = selectedCart(state.cart);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    // Giảm số lượng sản phẩm
    decQuantity: (state, { payload }) => {
      const find = state.cart.find(
        (item) => item._id === payload._id && item.color === payload.color
      );
      if (find && find.quantity > 1) {
        find.quantity -= 1;
        state.items -= 1;
        state.total = calcuateTotal(state.cart);
        state.selectedItem = selectedItem(state.cart);
        state.selectedTotal = calculateSelectedTotal(state.cart);
        state.selectedCart = selectedCart(state.cart);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeItem: (state, { payload }) => {
      console.log("reducer", payload._id, payload.color);
      const find = state.cart.find(
        (item) => item._id === payload._id && item.color === payload.color
      );
      if (find) {
        state.items -= find.quantity;
        state.cart = state.cart.filter(
          (item) => item._id !== payload._id || item.color !== payload.color
        );
        state.total = calcuateTotal(state.cart);
        state.selectedItem = selectedItem(state.cart);
        state.selectedTotal = calculateSelectedTotal(state.cart);
        state.selectedCart = selectedCart(state.cart);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    // Chọn hoặc bỏ chọn sản phẩm để thanh toán
    toggleSelectItem: (state, { payload }) => {
      let find = state.cart.find(
        (item) => item._id === payload._id && item.color === payload.color
      );
      console.log("payload._id --" + payload._id + payload.color);
      // console.log("find" + find);
      if (find) {
        // console.log("find" + find);
        find.isSelected = !find.isSelected;
        state.selectedTotal = calculateSelectedTotal(state.cart);
        state.selectedItem = selectedItem(state.cart);
        state.selectedCart = selectedCart(state.cart);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    // Áp dụng mã giảm giá cho sản phẩm
    applyCouponToItem: (state, { payload }) => {
      const { id, coupon } = payload;
      const find = state.cart.find((item) => item._id === id);
      if (find) {
        find.coupon = coupon;
        state.total = calcuateTotal(state.cart);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    // Xóa toàn bộ giỏ hàng
    emptyCart: (state) => {
      state.cart = [];
      state.items = 0;
      state.total = 0;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    // Thanh toán các sản phẩm được chọn
    checkoutSelectedItems: (state) => {
      // const selectedItems = state.cart.filter((item) => item.isSelected);
      // const totalAmount = calculateSelectedTotal(selectedItems);
      // Gửi dữ liệu selectedItems và totalAmount đến hệ thống thanh toán
      // console.log(
      //   "Thanh toán các sản phẩm:",
      //   JSON.stringify(state.selectedCart),
      //   "Tổng số tiền:",
      //   state.selectedTotal
      // );
      // Cập nhật giỏ hàng sau khi thanh toán thành công
      // state.cart = state.cart.filter((item) => !item.isSelected);
      // state.items = allItems(state.cart);
      // state.total = calcuateTotal(state.cart);
      // localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const {
  addCart,
  incQuantity,
  decQuantity,
  removeItem,
  toggleSelectItem,
  applyCouponToItem,
  emptyCart,
  checkoutSelectedItems,
} = cartReducer.actions;
export default cartReducer.reducer;
