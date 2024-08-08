import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAxiosWithErrorHandling } from "../api/axios";
import { toast } from "react-toastify";
import Loader from "./loader";
import useFetchComment from "../hooks/useFetchComment";

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
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="editor-container">
        <ReactQuill
          value={editorValue || comment}
          onChange={setEditorValue}
          placeholder="Write your comment here..."
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Submit Comment
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
