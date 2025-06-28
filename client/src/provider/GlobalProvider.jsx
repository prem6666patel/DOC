import axios from "axios";
import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setAllClients } from "../redux/clients/allClientsSlice";
import { setAllConsultation } from "../redux/consultation/allConsultationSlice";
import { setAllFiles } from "../redux/files/fileSlice";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const getClientsData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/getAll", {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("getClientsData : ", response);

        dispatch(setAllClients(response.data.data));
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user data");
    }
  };

  const getAllInquirey = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/consultation/all",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("getAllInquirey : ", response.data.data);

        dispatch(setAllConsultation(response.data.data));
      } else {
        toast.error("Failed to load getAllInquirey data");
      }
    } catch (error) {
      console.error("Error fetching getAllInquirey:", error);
      toast.error("Failed to load getAllInquirey data");
    }
  };

  const getfiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/file/getAll", {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("getfiles : ", response.data.data);

        dispatch(setAllFiles(response.data.data));
      } else {
        toast.error("Failed to load getfiles data");
      }
    } catch (error) {
      console.error("Error fetching getfiles:", error);
      toast.error("Failed to load getfiles data");
    }
  };

  useEffect(() => {
    if (currentUser) {
      getClientsData();
      getAllInquirey();
      getfiles();
    }
  }, [currentUser]);

  // Return the context provider
  return (
    <GlobalContext.Provider
      value={{ getClientsData, getAllInquirey, getfiles }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
