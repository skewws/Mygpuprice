import { Fragment } from "react";
import { checkFilterAppy, sortByTotalIntegers } from "../utils/helper";

const ResultsTable = ({ filteredData, sellers, filters, uploadTime }) => {
  if (
    (filteredData.length === 0 && !checkFilterAppy(filters)) ||
    !checkFilterAppy(filters)
  ) {
    return <p className="text-gray-700">Apply filters to see data</p>;
  }

  if (filteredData.length === 0 && checkFilterAppy(filters)) {
    return <p className="text-gray-700">No results found</p>;
  }

  return (
    <table className="min-w-full bg-white rounded mb-4">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-left">Website</th>
          <th className="py-2 px-4 border-b text-left">Offer (Estimated)</th>
        </tr>
      </thead>
      <tbody>
        {sortByTotalIntegers(filteredData)?.map((item, rowIndex) => (
          <tr key={rowIndex}>
            <td>
              {sellers?.map((seller) => (
                <Fragment key={seller.name}>
                  {item[seller.name] && (
                    <div className="py-2 px-4 my-2">{seller.name}</div>
                  )}
                </Fragment>
              ))}
            </td>
            <td>
              {sellers?.map((seller) => (
                <Fragment key={seller.name}>
                  {item[seller.name] && (
                    <a href={seller?.link} target="_blank">
                      <div className="py-2 px-4 my-2 w-[80px] border border-black bg-white text-black rounded">
                        ${item[seller.name]}
                      </div>
                    </a>
                  )}
                </Fragment>
              ))}
            </td>
          </tr>
        ))}
        {uploadTime && (
          <div className="m-5">
            <span className="text-lg font-semibold">Last Updated: </span>
            {uploadTime}
          </div>
        )}
      </tbody>
    </table>
  );
};

export default ResultsTable;
