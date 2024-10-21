import { useState, useEffect } from "react";
import axiosInstance from "../../../../Api/axiosConfig";
import useRetryRequest from "../../../../Api/useRetryRequest";
import { message } from "antd";

const useFlyer = () => {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const retryRequest = useRetryRequest(); // Get retryRequest from custom hook

  useEffect(() => {
    const fetchFlyers = async () => {
      setLoading(true);
      try {
        const response = await retryRequest(() =>
          axiosInstance.get("/admin/flyers/all-flyers")
        );
        setFlyers(response.data.flyers);
      } catch (error) {
        message.error("Failed to fetch flyers");
      } finally {
        setLoading(false);
      }
    };

    fetchFlyers();
  }, [retryRequest]);

  return { flyers, setFlyers, loading }; // Return flyers, loading state, and setFlyers to update it
};

export default useFlyer;
