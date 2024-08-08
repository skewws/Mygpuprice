import { useState } from "react";

const useError = () => {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    setError(error.response?.data?.message || error.message);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    handleError,
    clearError,
  };
};

export default useError;
