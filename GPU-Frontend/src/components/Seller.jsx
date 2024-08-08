import { useState, useEffect, Fragment } from "react";
import { useAxiosWithErrorHandling } from "../api/axios";
import Loader from "./loader";
import { toast } from "react-toastify";

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newLink, setNewLink] = useState("");
  const [editSellerId, setEditSellerId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLink, setEditLink] = useState("");
  const { axiosInstance, loading } = useAxiosWithErrorHandling();

  useEffect(() => {
    fetchSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosInstance]);

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get("/api/sellers");
      localStorage.setItem("sellers", JSON.stringify(response.data));
      setSellers(response.data);
    } catch (error) {
      toast.error("Failed to fetch sellers:");
    }
  };

  const handleAddSeller = async () => {
    if (!newName || !newLink) return;
    try {
      await axiosInstance.post("/api/sellers", {
        name: newName,
        link: newLink,
      });
      fetchSellers();
      setNewName("");
      setNewLink("");
    } catch (error) {
      toast.error("Failed to add seller:", error);
    }
  };

  const handleUpdateSeller = async (id) => {
    if (!editName || !editLink) return;
    try {
      await axiosInstance.put(`/api/sellers/${id}`, {
        name: editName,
        link: editLink,
      });
      fetchSellers();
      setEditSellerId(null);
      setEditName("");
      setEditLink("");
    } catch (error) {
      toast.error("Failed to update seller:", error);
    }
  };

  const handleDeleteSeller = async (id) => {
    try {
      await axiosInstance.delete(`/api/sellers/${id}`);
      fetchSellers();
    } catch (error) {
      toast.error("Failed to delete seller:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between p-4 bg-gray-100 border-b">
        <h2 className="text-xl font-semibold">Sellers</h2>
      </div>
      {editSellerId === null ? (
        <div className="flex flex-col p-4 flex-grow">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mr-2"
            />
            <input
              type="text"
              placeholder="Link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mr-2"
            />
            <button
              onClick={handleAddSeller}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
            >
              Add new seller
            </button>
          </div>
          <ul className="space-y-2">
            {sellers.length === 0 ? (
              <li>No sellers found</li>
            ) : (
              <Fragment>
                {sellers.map((seller) => (
                  <li
                    key={seller?._id}
                    className="flex md:items-center gap-2 items-left justify-between flex-wrap p-2 border border-gray-300 rounded md:flex-row flex-col"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 ">
                        <div className="font-bold">Name:</div>
                        <div>{seller.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold">Link:</div>
                        <div className="lg:max-w-[300px] max-w-[150px] truncate">
                          {seller.link}
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          setEditSellerId(seller._id);
                          setEditName(seller.name);
                          setEditLink(seller.link);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded shadow hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSeller(seller._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded shadow hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </Fragment>
            )}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col p-4 flex-grow">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mr-2"
            />
            <input
              type="text"
              placeholder="Link"
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mr-2"
            />
            <button
              onClick={() => handleUpdateSeller(editSellerId)}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <Loader loading={loading} />
    </div>
  );
};

export default Seller;
