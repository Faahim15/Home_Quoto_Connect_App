import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { api } from "../features/api/baseApi";
import jobPostReducer from "../features/jobPost/jobPostSlice";
import providerRegReducer from "../features/provider/providerSlice";
import criminalCheckReducer from "../features/provider/criminalCheckSlice";

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  jobPost: jobPostReducer,
  providerRegister: providerRegReducer,
  criminalCheck: criminalCheckReducer,
});

// ✅ RESET_STORE action আসলে সব state undefined হয়ে যাবে
const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;