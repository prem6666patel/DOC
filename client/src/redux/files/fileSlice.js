import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allFiles: [],
};

const allFileSlice = createSlice({
  name: "allFiles",
  initialState,
  reducers: {
    setAllFiles: (state, action) => {
      state.allFiles = action.payload;
    },
  },
});

export const { setAllFiles } = allFileSlice.actions;
export default allFileSlice.reducer;
