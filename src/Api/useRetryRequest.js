import { useContext, useCallback } from "react";
import { AuthContext } from "../Context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";

// Custom hook for retry logic
const useRetryRequest = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Retry logic helper function
  const retryRequest = useCallback(async (axiosCall, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const response = await axiosCall();
        return response;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            logout();
            navigate('/login');
            console.error(`Forbidden access: ${error.response.status}`);
            throw new Error(`Forbidden access: ${error.response.status}`);
          }
          if (error.response.status === 404 || error.response.status === 500) {
            navigate('/500');
            console.error(`Server error: ${error.response.status}`);
            throw new Error(`Server error: ${error.response.status}`);
          }
        }
        attempt++;
        if (attempt >= retries) {
          console.error(`Failed after ${retries} attempts`);
          logout();
          navigate('/login');
          throw error;
        }
        console.warn(`Retrying request, attempt: ${attempt}`);
      }
    }
  }, [logout, navigate]);

  return retryRequest;
};

export default useRetryRequest;
