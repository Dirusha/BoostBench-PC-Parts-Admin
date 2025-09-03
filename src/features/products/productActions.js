import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/apiService";
import { store } from "../../app/store";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const token = store.getState().auth.token;
  const response = await apiService.get("/api/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
});

const productActions = {
  fetchProducts,
};

export default productActions;