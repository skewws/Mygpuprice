import { useEffect, useState } from "react";
import { useAxiosWithErrorHandling } from "../api/axios";
import { toast } from "react-toastify";

const useFetchHeading = () => {
  const [heading, setHeading] = useState("");
  const { axiosInstance } = useAxiosWithErrorHandling();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axiosInstance.get("/heading/fetch");
        setHeading(response.data?.heading.content);
      } catch (error) {
        console.log({error})
        toast.error("Failed to fetch heading.");
      }
    };

    fetchComment();
  }, [axiosInstance]);

  return heading;
};

export default useFetchHeading;
