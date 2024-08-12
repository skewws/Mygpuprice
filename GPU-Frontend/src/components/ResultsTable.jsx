import { removeKeysFromArray, sortByTotalIntegers } from "../utils/helper";

const ResultsTable = ({ filteredData, sellers, uploadTime }) => {
  return (
    <table className="min-w-full bg-white rounded mb-4">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-left">Website</th>
          <th className="py-2 px-4 border-b text-left">Offer (Estimated)</th>
        </tr>
      </thead>
      <tbody>
        {sortByTotalIntegers(removeKeysFromArray(filteredData), sellers)?.map(
          (seller, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <div className="py-2 px-4 my-2">{seller.name}</div>
              </td>
              <td>
                <a href={seller?.link} target="_blank">
                  <div className="py-2 px-4 my-2 w-[80px] border border-black bg-white text-black rounded">
                    ${seller.price}
                  </div>
                </a>
              </td>
            </tr>
          )
        )}
        {uploadTime && (
          <div className="m-5 text-left">
            <span className="text-lg font-semibold ">Last Updated: </span>
            {uploadTime}
          </div>
        )}
      </tbody>
    </table>
  );
};

export default ResultsTable;
