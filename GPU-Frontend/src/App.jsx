import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { Fragment } from "react";

function App() {
  return (
    <Fragment>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>

      </Routes>
    </Router>

    <ToastContainer/>
    </Fragment>

  );
}

export default App;
