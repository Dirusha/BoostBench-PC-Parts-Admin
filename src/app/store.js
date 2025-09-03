import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // From your example

// Add more reducers as you create slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // counter: counterReducer, // Add if using the counter example
  },
  // Optional: Add middleware or devTools config if needed
});
