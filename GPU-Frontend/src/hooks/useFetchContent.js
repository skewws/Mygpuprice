import { useEffect, useState } from "react";
import { cleanedData } from "../utils/helper";

const useFetchContent = (axiosInstance) => {
  const [data, setData] = useState([]);
  const [uploadTime, setUploadTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/fileContent/fetch");
        setData(cleanedData(response.data?.fileContent.fileContent));
        const date = new Date(response?.data?.fileContent.updatedAt);
        setUploadTime(date.toLocaleString());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [axiosInstance]);

  return { data, setData, uploadTime };
};

export default useFetchContent;
