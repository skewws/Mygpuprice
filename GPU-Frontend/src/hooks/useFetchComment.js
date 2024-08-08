import { useEffect, useState } from "react";
import { useAxiosWithErrorHandling } from "../api/axios";
import { toast } from "react-toastify";

const useFetchComment = () => {
  const [comment, setComment] = useState("");
  const { axiosInstance } = useAxiosWithErrorHandling();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axiosInstance.get("/comment/fetch");
        setComment(response.data?.comment.content);
      } catch (error) {
        console.log({error})
        toast.error("Failed to fetch comment.");
      }
    };

    fetchComment();
  }, [axiosInstance]);

  return comment;
};

export default useFetchComment;
