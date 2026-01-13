import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idFront: null,
  idBack: null,
};

const criminalCheckSlice = createSlice({
  name: "criminalCheck",
  initialState,
  reducers: {
    setIdFront: (state, action) => {
      state.idFront = action.payload;
    },
    setIdBack: (state, action) => {
      state.idBack = action.payload;
    },
    setCriminalCheckData: (state, action) => {
      state.idFront = action.payload.idFront;
      state.idBack = action.payload.idBack;
    },
    clearCriminalCheckData: (state) => {
      state.idFront = null;
      state.idBack = null;
    },
  },
});

export const {
  setIdFront,
  setIdBack,
  setCriminalCheckData,
  clearCriminalCheckData,
} = criminalCheckSlice.actions;

export default criminalCheckSlice.reducer;
