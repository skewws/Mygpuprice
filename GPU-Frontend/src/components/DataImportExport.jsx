import { useEffect, useState } from "react";
import {
  apiUrl,
  axiosFileInstance,
  useAxiosWithErrorHandling,
} from "../api/axios";
import { saveAs } from "file-saver";
import axios from "axios";
import { getSheet, saveContentFile } from "../utils/helper";
import Loader from "./loader";

const DataEntry = () => {
  const [file, setFile] = useState(null);
  const [isUploaded, setUploaded] = useState(false);
  const [uploadTime, setUploadTime] = useState("");

  const [fileContent, setFileContent] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const { axiosInstance, loading } = useAxiosWithErrorHandling();

  const handleFileUpload = async (e, sFile = null) => {
    const uploadedFile = e?.target?.files[0] || sFile;

    if (
      uploadedFile &&
      uploadedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(uploadedFile);

      if (e?.target?.files[0]) {
        setUploaded(true);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const sheet = getSheet(event);
        setColumnNames(sheet?.columns);
        setFileContent(sheet?.json);
      };

      reader.readAsArrayBuffer(uploadedFile);
    } else {
      alert("Please upload a valid Excel file");
    }
  };

  useEffect(() => {
    handleDownloadFile(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (file && isUploaded) {
      handleSaveFile();

      if (fileContent.length > 0) {
        const content = fileContent.slice(1);
        saveContentFile(axiosInstance, content);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploaded, fileContent]);

  const handleSaveFile = async () => {
    if (!file) {
      alert("No file selected for upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosFileInstance.post("/upload", formData);
      getUploadedTime();
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const fetchFile = async (fileData) => {
    try {
      if (fileData) {
        const fileBlob = new Blob([fileData], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileURL = URL.createObjectURL(fileBlob);
        const file = await fetch(fileURL).then((res) => res.blob());
        handleFileUpload(null, file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadFile = async (isFetch = false) => {
    try {
      const response = await axios.get(`${apiUrl}/download`, {
        responseType: "blob",
      });
      getUploadedTime();

      if (isFetch) {
        fetchFile(response?.data);
      } else saveAs(response.data, "data.xlsx");
    } catch (error) {
      console.log(error);
    }
  };

  const getUploadedTime = async () => {
    try {
      const response = await axios.get(`${apiUrl}/timestamp`);
      const { timestamp } = response.data;
      if (timestamp) {
        const date = new Date(timestamp);
        setUploadTime(date.toLocaleString());
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
      <h2 className="text-[19px] font-bold">Data Entry</h2>

        <div className="flex space-x-4 items-center flex-wrap">
          {uploadTime && (
            <div className="">
              <span className="text-lg font-semibold">Last Updated: </span>
              {uploadTime}
            </div>
          )}
          <label className="bg-green-600 text-white px-4 py-2 rounded shadow cursor-pointer hover:bg-green-700">
            Upload File
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              onClick={(event) => {
                event.target.value = null;
              }}
              className="hidden"
            />
          </label>
          <button
            onClick={() => handleDownloadFile(false)}
            disabled={file ? false : true}
            style={{ opacity: file ? 1 : 0.5 }}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Download File
          </button>
        </div>
      </div>
      <div className="flex-grow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded">
            <tbody>
              {fileContent.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnNames.length}
                    className="py-4  text-center"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                fileContent.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${rowIndex < 1 ? "font-bold" : ""}`}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? "#F2F2F2" : "#FFFFFF",
                    }}
                  >
                    {columnNames.map((colName, colIndex) => (
                      <td key={colIndex} className="py-2 px-4 border-b"
                      >
                        {row[colName] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Loader loading={loading} />
    </div>
  );
};

export default DataEntry;
