import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/api/baseApi";
import jobPostReducer from "../features/jobPost/jobPostSlice";
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    jobPost: jobPostReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
