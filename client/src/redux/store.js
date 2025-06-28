import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/userSlice";
import clientsReducer from "./clients/allClientsSlice";
import ConsultationReducer from "./consultation/allConsultationSlice";
import fileReducer from "./files/fileSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    clients: clientsReducer,
    consultations: ConsultationReducer,
    files: fileReducer,
  },
});

export default store;
