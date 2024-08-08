import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  if (!localStorage.getItem("accessToken")) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
