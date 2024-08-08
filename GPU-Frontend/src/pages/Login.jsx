import { useState } from "react";
import { useAxiosWithErrorHandling } from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../components/loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate=useNavigate()
  const { axiosInstance, loading, error } = useAxiosWithErrorHandling();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data.token);
      window.location.href = "/admin";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleForgotPassword=()=>{
    navigate('/forgot-password')
  }

  if (localStorage.getItem("accessToken")) return <Navigate to="/admin" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span
                onClick={handleForgotPassword}
                className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </span>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>

            {error && <p className="text-[red] mt-4 text-center">{error}</p>}
          </div>
        </form>
      </div>

      <Loader loading={loading} />
    </div>
  );
};

export default Login;
