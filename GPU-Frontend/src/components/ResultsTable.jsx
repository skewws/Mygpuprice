import { removeKeysFromArray, sortByTotalIntegers } from "../utils/helper";

const ResultsTable = ({ filteredData, sellers }) => {
  return (
    <table className="min-w-full bg-white rounded mb-4">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-left">Website</th>
          <th className="py-2 px-4 border-b text-left flex flex-col items-center">
            {" "}
            <span> Offer </span> <span> (Estimated)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortByTotalIntegers(removeKeysFromArray(filteredData), sellers)?.map(
          (seller, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <div className="text-left py-2 px-4 my-2">{seller.name}</div>
              </td>
              <td className="">
                <a
                  href={seller?.link}
                  target="_blank"
                  className="flex justify-center"
                >
                  <div className="py-2 px-4 my-2 w-[80px] border border-black bg-white text-black rounded">
                    ${seller.price}
                  </div>
                </a>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default ResultsTable;
