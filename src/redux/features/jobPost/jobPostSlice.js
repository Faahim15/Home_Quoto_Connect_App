import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  serviceCategory: {
    id: "",
    title: "",
  },

  // location: "",
  location: {
    type: "Point",
    coordinates: [],
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  },
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
  houseNumber: 0,
  streetNumber: 0,
  completeAddress: "",
};

const jobPostSlice = createSlice({
  name: "jobPost",
  initialState,
  reducers: {
    setJobField: (state, action) => {
      const { field, value } = action.payload;
      // ✅ SPECIAL HANDLING: When isPersonalized becomes true, reset price range
      if (field === "priceRange" && value.isPersonalized === true) {
        state.priceRange = {
          from: 0,
          to: 0,
          isPersonalized: true,
        };
      }

      // ✅ SPECIAL HANDLING: When user sets actual price, set isPersonalized to false
      if (field === "priceRange" && value.from > 0) {
        state.priceRange.isPersonalized = false;
      }
      state[field] = value;
    },
    setJobData: (state, action) => {
      const data = action.payload;

      // ✅ Set all fields from payload, preserving existing values for missing fields
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          state[key] = data[key];
        }
      });
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

export const { setJobField, setJobData, addPhoto, removePhoto, resetJobPost } =
  jobPostSlice.actions;

export default jobPostSlice.reducer;
