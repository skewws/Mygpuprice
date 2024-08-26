import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAxiosWithErrorHandling } from "../api/axios";
import { toast } from "react-toastify";
import Loader from "./loader";
import useFetchComment from "../hooks/useFetchComment";
import './../styles/index.css'
import { formats, quillModules } from "../utils/functions";

const Comments = () => {
  const comment = useFetchComment();
  const [editorValue, setEditorValue] = useState(comment);
  const { axiosInstance, loading } = useAxiosWithErrorHandling();

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/comment/save", { content: editorValue });
      toast.success("Comment has been saved");
    } catch (error) {
      toast.error("Failed to submit comment.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded">
   <h2 className="text-[19px] font-bold">Comments</h2>
   <br></br>
      <div className="editor-container">
        <ReactQuill
          value={editorValue || comment}
          onChange={setEditorValue}
          placeholder="Write your comment here..."
          modules={quillModules}
          formats={formats}
          theme="snow" 
        />
      </div>
      <br></br>
      <button
        onClick={handleSubmit}
        className="text-white px-4 py-2 rounded shadow hover:bg-green-700"
        style={{ backgroundColor: "#198754" }}
      >
        Save Comment
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

export default Comments;
