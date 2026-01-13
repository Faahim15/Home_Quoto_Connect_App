import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/api/baseApi";
import jobPostReducer from "../features/jobPost/jobPostSlice";
import providerRegReducer from "../features/provider/providerSlice";
import criminalCheckReducer from "../features/provider/criminalCheckSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    jobPost: jobPostReducer,
    providerRegister: providerRegReducer,
    criminalCheck: criminalCheckReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { api } from "../features/api/baseApi";
// import jobPostReducer from "../features/jobPost/jobPostSlice";
// import providerRegReducer from "../features/provider/providerSlice";
// const store = configureStore({
//   reducer: {
//     [api.reducerPath]: api.reducer,
//     jobPost: jobPostReducer,
//     providerRegister: providerRegReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(api.middleware),
// });

// export default store;
