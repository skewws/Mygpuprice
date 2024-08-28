import { useAxiosWithErrorHandling } from "../api/axios";
import { toast } from "react-toastify";
import Loader from "./loader";
import useFetchHeading from "../hooks/useFetchHeading";
import MyEditor from "./Editor";
import "./../styles/index.css";

const Heading = () => {
  const heading = useFetchHeading();
  const { axiosInstance, loading } = useAxiosWithErrorHandling();

  const handleSubmit = async (value) => {
    try {
      await axiosInstance.post("/heading/save", {
        content: value || heading,
      });
      toast.success("Heading has been saved");
    } catch (error) {
      toast.error("Failed to submit heading.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-4">Heading</h2>
      <div className="editor-container">
        <MyEditor handleSubmit={handleSubmit} htmlContent={heading}/>
      </div>
      <Loader loading={loading} />
    </div>
  );
};

export default Heading;
