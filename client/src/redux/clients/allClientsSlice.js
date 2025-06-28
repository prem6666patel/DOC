import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allClients: [],
};

const allClientsSlice = createSlice({
  name: "allClients",
  initialState,
  reducers: {
    setAllClients: (state, action) => {
      state.allClients = action.payload;
    },
  },
});

export const { setAllClients } = allClientsSlice.actions;
export default allClientsSlice.reducer;
