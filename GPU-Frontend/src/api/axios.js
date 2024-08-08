import axios from "axios";
import { useState } from "react";
import useError from "../hooks/useError";
export const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosFileInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const useAxiosWithErrorHandling = () => {
  const { error, handleError, clearError } = useError();
  const [loading, setLoading] = useState(false);

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["x-auth-token"] = token;
      }
      setLoading(true);
      clearError();

      return config;
    },
    (error) => {
      setLoading(false);
      handleError(error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      setLoading(false);
      return response;
    },
    (error) => {
      setLoading(false);
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
      handleError(error);
      return Promise.reject(error);
    }
  );

  return { axiosInstance, loading, error, clearError };
};



axiosFileInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);