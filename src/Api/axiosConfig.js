// src/api/axiosConfig.js
import axios from "axios";
import API_BASE_URL from "../constants";

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});


// A function to clear all interceptors
const clearInterceptors = () => {
  axiosInstance.interceptors.request.handlers = [];
  axiosInstance.interceptors.response.handlers = [];
};

// A function to add the interceptor
export const setupInterceptors = (token) => {
  clearInterceptors(); // Clear existing interceptors

  axiosInstance.interceptors.request.use(
    (config) => {
      // If token is available, set the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
