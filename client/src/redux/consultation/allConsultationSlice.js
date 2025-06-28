import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allConsultation: [],
};

const allConsultationSlice = createSlice({
  name: "allConsultation",
  initialState,
  reducers: {
    setAllConsultation: (state, action) => {
      state.allConsultation = action.payload;
    },
  },
});

export const { setAllConsultation } = allConsultationSlice.actions;
export default allConsultationSlice.reducer;
