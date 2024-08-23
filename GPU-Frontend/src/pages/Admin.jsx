import { useState } from "react";
import Seller from "../components/Seller";
import DataEntry from "../components/DataImportExport";
import EditEntry from "../components/EditEntry";
import Comments from "../components/AddComment";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Heading from "../components/Heading";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Seller");
  let navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "Seller":
        return <Seller />;
      case "Data Entry":
        return <DataEntry />;
      case "Edit Entry":
        return <EditEntry />;
      case "Heading":
        return <Heading />;
      case "Comments":
        return <Comments />;
      default:
        return <div>Select a tab</div>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="lg:w-1/4 w-full bg-gray-200 p-4 flex flex-col">
        <ul className="flex flex-col space-y-2">
          {["Seller", "Data Entry", "Edit Entry", "Heading", "Comments"].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer px-4 py-5 rounded ${activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>

        <div className="my-10 flex items-center gap-2 flex-wrap">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="lg:w-3/4 w-full p-4 flex-grow">{renderContent()}</div>
    </div>
  );
};

export default Admin;
