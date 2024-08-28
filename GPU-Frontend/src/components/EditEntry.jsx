import { useState, useEffect } from "react";
import { useAxiosWithErrorHandling } from "../api/axios";
import Loader from "./loader";
import { getColumns, saveContentFile } from "../utils/helper";
import useDebounce from "../hooks/useDebounce";
import useFetchContent from "../hooks/useFetchContent";

const EditEntry = () => {
  const { axiosInstance, loading } = useAxiosWithErrorHandling();
  const { data, setData } = useFetchContent(axiosInstance);
  const [editString, setEdit] = useState(null);
  const [isSort, setSort] = useState(null);

  const debouncedValue = useDebounce(editString, 0);

  useEffect(() => {
    if (data?.length > 0 && editString) {
      saveContentFile(axiosInstance, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleEdit = (rowIndex, colKey, value) => {
    const updatedData = data.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [colKey]: value };
      }
      return row;
    });
    setEdit(value);
    setData(updatedData);
  };

  const sortByVRAM = (check) => {
    setSort(check);
    const pData = data?.sort((a, b) => {
      const vramA = parseInt(a.VRAM);
      const vramB = parseInt(b.VRAM);
      return check ? vramA - vramB : vramB - vramA;
    });
    const arr = [...pData];
    setData(arr);
  };

  const handleEditWrapper = (e, colIndex, rowIndex, colName, currentValue) => {
    const newValue =
      colIndex >= 3
        ? e.target.innerText.replace(/\$/g, "")
        : e.target.innerText;

    const isCall = colIndex > 3 ? +newValue !== +currentValue : newValue !== currentValue
    if (isCall) {
      handleEdit(rowIndex, colName, newValue);
    }
  };

  if (data?.length === 0) {
    return (
      <div>
        No Data Found- Upload New File
        <Loader loading={loading} />
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr>
            {getColumns()?.map((colName, index) => (
              <th
                key={index}
                className={`py-2 px-4 border-b text-left ${index < 3 ? "bg-gray-200 sticky left-0 z-10" : ""
                  }`}
              >
                {colName !== "VRAM" ? (
                  colName
                ) : (
                  <div
                    onClick={() => sortByVRAM(!isSort)}
                    className="flex items center gap-1 cursor-pointer"
                  >
                    <span>{colName}</span>
                    <img
                      src={
                        isSort ? "/assets/arrowLigth.png" : "/assets/arrowD.png"
                      }
                      alt="arr-light"
                    />
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {getColumns()?.map((colName, colIndex) => (
                <td
                  key={colIndex}
                  className={`py-2 px-4 border-b ${colIndex < 3 ? "bg-gray-200 sticky left-0 z-0" : ""
                    }`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleEditWrapper(e, colIndex, rowIndex, colName, row[colName])
                  }
                >
                  {colIndex >= 3
                    ? `$${row[colName] || ""}`
                    : row[colName] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Loader loading={loading} />
    </div>
  );
};

export default EditEntry;
