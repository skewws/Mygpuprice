import { useEffect, useState } from "react";
import "./styles.css";

const Filter = ({ filtersTypes, selectedFilterType, handleChange }) => {
  const [localFilter, setFilter] = useState([]);
  const [showMore, setMore] = useState(false);

  const handleSetMore = () => {
    setMore((prev) => !prev);
  };

  useEffect(() => {
    const filters = showMore ? filtersTypes : filtersTypes?.slice(0, 6);
    setFilter(filters);
  }, [filtersTypes, showMore]);

  return (
    <div className="filter-container max-h-[500px] overflow-auto">
      {localFilter?.length === 1 &&
        localFilter?.map((chipset) => (
          // <div key={chipset} className="flex items-center mb-2">
          //   <input
          //     type="checkbox"
          //     className="form-checkbox h-4 w-4 text-blue-600 bg-white border-color[#dee2e6] border-1 "
          //     checked={true}
          //     readOnly
          //   />
          //   <label className="ml-2 text-gray-700 "
          //     style={{ color: "#212529" }}>
          //     {chipset.toLowerCase()}
          //   </label>
          // </div>
          <div key={chipset} className="flex items-center ">
            <label className="cont">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={true}
                readOnly
              />
              <span className="checkmark"></span>
              <span className="label-text text-sm">{chipset}</span>
            </label>
          </div>
        ))}
      {localFilter?.length > 1 &&
        localFilter?.map((chipset) => (
          <div key={chipset} className="flex items-center">
            <label className="cont">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedFilterType === chipset}
                onChange={() => handleChange(chipset)}
              />
              <span className="checkmark"></span>
              <span className="label-text text-sm">{chipset}</span>
            </label>
          </div>
        ))}
      {filtersTypes.length > 6 && (
        <div onClick={handleSetMore} className="cursor-pointer ">
          {!showMore ? (
            <div className="flex gap-2 items-center mb-4">
              <img src="/assets/square.png" className="h-4 w-4" alt="plus" />
              <span style={{ color: "#212529" }} className="text-sm">
                Show More
              </span>
            </div>
          ) : (
            <div className="flex gap-2 items-center mb-4">
              <img src="/assets/minus.png" className="h-4 w-4" alt="plus" />
              <span style={{ color: "#212529" }} className="text-sm">
                Show Less
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;
