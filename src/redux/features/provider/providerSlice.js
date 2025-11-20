import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  email: "",
  location: {
    type: "Point",
    coordinates: [],
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  },
  password: "",
  confirmPassword: "",
  category: "",
  experience: "",
  serviceArea: [],
  specializations: [],
  from: "",
  to: "",
  bio: "",
  phone: "",
};

const providerRegSlice = createSlice({
  name: "providerRegister",
  initialState,
  reducers: {
    setProviderRegister: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    // Reset form to initial state
    resetProviderForm: () => initialState,
  },
});

export const { setProviderRegister, resetProviderForm } =
  providerRegSlice.actions;

export default providerRegSlice.reducer;
