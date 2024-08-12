import { useState } from "react";
import Seller from "../components/Seller";
import DataEntry from "../components/DataImportExport";
import EditEntry from "../components/EditEntry";
import Comments from "../components/AddComment";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

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
      <div className="w-[22%] p-4 flex flex-col border border-color-[#000]" 
       
      >
        <ul className="flex flex-col space-y-2">
          {["Seller", "Data Entry", "Edit Entry", "Comments"].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer px-4 py-3 rounded ${
                activeTab === tab
                  ? "text-white"
                  : "text-black"
              }`}
              style={
                activeTab === tab
                  ? { backgroundColor: "#198754", fontSize: "18px", fontWeight: "700" }
                  : {  color: "#000", fontSize: "18px", fontWeight: "700" }
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>

        <div className="my-10 flex items-center gap-2 flex-wrap">
          <button
    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
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
