import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAxiosWithErrorHandling } from "../api/axios";
import "../../src/App.css"

const ResetPassword = () => {
  const { token } = useParams();
  const { axiosInstance, loading } = useAxiosWithErrorHandling();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await axiosInstance.post("/reset-password", { token, password });
      toast.success("Password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-[20px] text-gray-700"
              style={{ color: "#212529" }}
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[20px]  text-gray-700"
              style={{ color: "#212529" }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full login-btn "
        
            >
              {!loading ? "Reset Password" : "Loading..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
