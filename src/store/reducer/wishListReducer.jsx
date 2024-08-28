import { createSlice } from "@reduxjs/toolkit";

// Lấy dữ liệu wishList từ localStorage nếu tồn tại
const storedWishList = JSON.parse(localStorage.getItem("wishList")) || [];

const wishListReducer = createSlice({
  name: "wishListReducer",
  initialState: {
    wishList: storedWishList,
  },
  reducers: {
    addItemToWishList: (state, action) => {
      const existingItem = state.wishList.find(
        (item) => item._id === action.payload._id
      );
      if (!existingItem) {
        state.wishList.push(action.payload);
        localStorage.setItem("wishList", JSON.stringify(state.wishList));
      }
    },
    removeItemFromWishList: (state, action) => {
      state.wishList = state.wishList.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("wishList", JSON.stringify(state.wishList));
    },
    clearWishList: (state) => {
      state.wishList = [];
      localStorage.removeItem("wishList");
    },
  },
});

export const { addItemToWishList, removeItemFromWishList, clearWishList } =
  wishListReducer.actions;

export default wishListReducer.reducer;
