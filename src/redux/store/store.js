import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/api/baseApi";
import jobPostReducer from "../features/jobPost/jobPostSlice";
import providerRegReducer from "../features/provider/providerSlice";
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    jobPost: jobPostReducer,
    providerRegister: providerRegReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
