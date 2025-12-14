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
};
// //    fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     location: null,
const userRegSlice = createSlice({
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

export const { setProviderRegister, resetProviderForm } = userRegSlice.actions;

export default userRegSlice.reducer;
