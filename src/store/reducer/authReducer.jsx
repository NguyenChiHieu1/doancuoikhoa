import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const customerToken = localStorage.getItem("userToken");
const adminToken = localStorage.getItem("adminToken");
const infoData = localStorage.getItem("info");
const infoArray = infoData ? JSON.parse(infoData) : {};

const authReducer = createSlice({
  name: "authReducer",
  initialState: {
    adminToken: verifyToken("admin-token"),
    userToken: verifyToken("user-token"),
    //lấy thông tin người dùng tai khoan
    userInfo: customerToken ? jwtDecode(customerToken) : null,
    adminInfo: adminToken ? jwtDecode(adminToken) : null,
    info: infoArray,
  },
  reducers: {
    setAdminToken: (state, action) => {
      state.adminToken = action.payload;
      state.adminInfo = jwtDecode(action.payload);
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload;
      state.userInfo = jwtDecode(action.payload);
    },
    logout: (state, action) => {
      localStorage.removeItem(action.payload);
      if (action.payload === "admin-token") {
        state.adminToken = null;
        state.adminInfo = null;
        state.info = null;
      } else if (action.payload === "user-token") {
        state.userToken = null;
        state.userInfo = null;
        state.info = null;
      }
    },
    addInfo: (state, action) => {
      state.info = action.payload;
    },
  },
});

function verifyToken(keyName) {
  const storage = localStorage.getItem(keyName);
  if (storage) {
    const decodeToken = jwtDecode(storage);
    // console.log("decodeToken:", decodeToken);
    const expiresIn = new Date(decodeToken.exp * 1000);
    if (new Date() > expiresIn) {
      localStorage.removeItem(keyName);
      return null;
    } else {
      return storage;
    }
  } else {
    return null;
  }
}

export const { setAdminToken, setUserToken, logout, addInfo } =
  authReducer.actions;
export default authReducer.reducer;
