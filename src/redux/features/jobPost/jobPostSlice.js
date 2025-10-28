import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  serviceCategory: "",
  location: "",
  urgency: "",
  specificInstructions: "",
  specializations: [],
  photos: [],
  preferredDate: "",
  preferredTime: "",
  priceRange: {
    from: 0,
    to: 0,
    isPersonalized: false,
  },
};

const jobPostSlice = createSlice({
  name: "jobPost",
  initialState,
  reducers: {
    setJobField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addPhoto: (state, action) => {
      state.photos.push(action.payload);
    },
    removePhoto: (state, action) => {
      state.photos = state.photos.filter((p) => p.id !== action.payload);
    },
    resetJobPost: () => initialState,
  },
});

export const { setJobField, addPhoto, removePhoto, resetJobPost } =
  jobPostSlice.actions;

export default jobPostSlice.reducer;
