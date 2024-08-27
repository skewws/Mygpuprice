import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAxiosWithErrorHandling } from "../api/axios";
import { toast } from "react-toastify";
import Loader from "./loader";
import useFetchHeading from "../hooks/useFetchHeading";
import { formats, quillModules } from "../utils/functions";
import "./../styles/index.css";

const Heading = () => {
  const heading = useFetchHeading();
  const [editorValue, setEditorValue] = useState(heading);
  const { axiosInstance, loading } = useAxiosWithErrorHandling();

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/heading/save", {
        content: editorValue || heading,
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
        <ReactQuill
          value={editorValue || heading}
          onChange={setEditorValue}
          placeholder="Write your heading here..."
          modules={quillModules}
          formats={formats}
          theme="snow"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Save Heading
      </button>

      <style>{`
        .editor-container .ql-editor {
          min-height: 200px; 
        }
      `}</style>

      <Loader loading={loading} />
    </div>
  );
};

export default Heading;
