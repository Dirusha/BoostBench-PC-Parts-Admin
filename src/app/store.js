import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

const persistedState = localStorage.getItem("authState")
  ? JSON.parse(localStorage.getItem("authState"))
  : {
      token: null,
      id: null,
      username: null,
      roles: [],
    };

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: persistedState.auth || {
      token: persistedState.token,
      id: persistedState.id,
      username: persistedState.username,
      roles: persistedState.roles,
    },
  },
});

// Save state to localStorage on every change
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("authState", JSON.stringify(state.auth));
});
