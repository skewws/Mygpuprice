import { removeKeysFromArray, sortByTotalIntegers } from "../utils/helper";

const ResultsTable = ({ filteredData, sellers }) => {
  const results = sortByTotalIntegers(
    removeKeysFromArray(filteredData),
    sellers
  );
  return (
    <table className="min-w-full bg-white rounded mb-4">
      <thead>
        <tr className="border-b-lightGray border-b-[1px]">
          <th className="py-2 px-4 border-b text-left">Website</th>
          <th className="py-2 px-4 text-left flex flex-col items-center">
            <span> Offer </span>{" "}
            <span style={{ fontSize: "10px" }}>(Estimated)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {results?.map((seller, rowIndex) => (
          <tr
            key={rowIndex}
            className={` ${
              rowIndex === results?.length - 1
                ? ""
                : "border-b-lightGray border-b-[1px]"
            }`}
          >
            <td>
              <div className="text-left py-2 px-4 my-1 text-sm">
                {seller.name}
              </div>
            </td>
            <td className="">
              <a
                href={seller?.link}
                target="_blank"
                className="flex justify-center"
              >
                <div className="text-sm py-1 px-6 min-w-[90px] border border-lightGray bg-bgGray text-black rounded  hover:shadow-[0_5px_5px_rgb(222,222,222)] hover:ring-lightGray hover:ring-2">
                  ${seller.price}
                </div>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
