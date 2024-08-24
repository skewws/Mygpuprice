import { Fragment, useEffect, useState } from "react";
import useFetchContent from "../hooks/useFetchContent";
import { useAxiosWithErrorHandling } from "../api/axios";
import {
  filteredChipsets,
  filteredSeries,
  filteredVram,
  isShowData,
} from "../utils/functions";
import ResultsTable from "../components/ResultsTable";
import useFetchComment from "../hooks/useFetchComment";
import { checkFilterAppy } from "../utils/helper";
import Filter from "../components/Filter/Filter";
import useFetchHeading from "../hooks/useFetchHeading";
import { toast } from "react-toastify";

const FilterComponent = () => {
  const comment = useFetchComment();
  const dynamicHeading = useFetchHeading();
  const { axiosInstance } = useAxiosWithErrorHandling();
  const { data, uploadTime } = useFetchContent(axiosInstance);

  const [chipsetFilter, setChipsetFilter] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("");
  const [vramFilter, setVramFilter] = useState("");
  const [filteredChipsets1, seChipsett1] = useState([]);
  const [filteredSeries1, setSeries1] = useState([]);
  const [filteredVram1, setVram1] = useState([]);
  const [sellers, setSellers] = useState([]);

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get("/api/sellers");
      localStorage.setItem("sellers", JSON.stringify(response.data));
      setSellers(response.data);
    } catch (error) {
      toast.error("Failed to fetch sellers:");
    }
  };
  useEffect(() => {
    fetchSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fChipsets = filteredChipsets(data, seriesFilter, vramFilter);
    const fSeries = filteredSeries(data, chipsetFilter, vramFilter);
    const fVram = filteredVram(data, chipsetFilter, seriesFilter);

    seChipsett1(fChipsets);
    setSeries1(fSeries);
    setVram1(fVram);
  }, [data, chipsetFilter, seriesFilter, vramFilter]);

  const setSingleValue = (fChipsets, fSeries, fVram) => {
    if (fChipsets?.length === 1) {
      setChipsetFilter(fChipsets[0]);
    }

    if (fSeries?.length === 1) {
      setSeriesFilter(fSeries[0]);
    }

    if (fVram?.length === 1) {
      setVramFilter(fVram[0]);
    }
  };

  useEffect(() => {
    setSingleValue(filteredChipsets1, filteredSeries1, filteredVram1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredChipsets1, filteredSeries1, filteredVram1]);

  const handleChipsetChange = (chipset) => {
    setChipsetFilter((prev) => (prev === chipset ? "" : chipset));
  };

  const handleSeriesChange = (series) => {
    setSeriesFilter((prev) => (prev === series ? "" : series));
  };

  const handleVramChange = (vram) => {
    setVramFilter((prev) => (prev === vram ? "" : vram));
  };

  const filteredData = data.filter((item) => {
    const chipsetMatch = !chipsetFilter || item.Chipset === chipsetFilter;
    const seriesMatch = !seriesFilter || item.Series === seriesFilter;
    const vramMatch = !vramFilter || item.VRAM === vramFilter;
    return chipsetMatch && seriesMatch && vramMatch;
  });

  const handleClearFilters = () => {
    setChipsetFilter("");
    setSeriesFilter("");
    setVramFilter("");
  };

  const result = (
    <ResultsTable
      sellers={sellers}
      uploadTime={uploadTime}
      filteredData={filteredData}
    />
  );

  const heading = (
    <div className="flex flex-col text-center">
      <div dangerouslySetInnerHTML={{ __html: dynamicHeading }}></div>
    </div>
  );

  if (data?.length === 0) {
    return (
      <div className="flex py-6 flex-col gap-3 justify-center items-center">
        {heading}
        <h2 className="text-2xl font-semibold mb-4">No Data Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 w-full p-4 bg-white">
      <div className="flex flex-col items-center gap-4 mt-4">
        <img src="/assets/logo.png" alt="logo" className="max-w-[150px]" />
        {heading}
      </div>
      <div className="max-w-[700px] m-auto flex flex-col">
        <div className="flex flex-col md:flex-row justify-between mt-6">
          <div className="">
            <h2 className="text-lg font-bold mb-2">Chipset</h2>
            <Filter
              filtersTypes={filteredChipsets1}
              selectedFilterType={chipsetFilter}
              handleChange={handleChipsetChange}
            />

            <h2 className="text-lg font-bold my-2">Series</h2>
            <Filter
              filtersTypes={filteredSeries1}
              selectedFilterType={seriesFilter}
              handleChange={handleSeriesChange}
            />

            <h2 className="text-lg font-bold my-2">Vram</h2>
            <Filter
              filtersTypes={filteredVram1}
              selectedFilterType={vramFilter}
              handleChange={handleVramChange}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4 mt-8 md:mt-0 justify-between">
              <div className="flex items-center gap-4">
                {checkFilterAppy(chipsetFilter, seriesFilter, vramFilter) && (
                  <button
                    onClick={handleClearFilters}
                    className="border border-black bg-white text-black px-3 py-2 rounded"
                  >
                    Clear Filters
                  </button>
                )}

                {chipsetFilter && (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded cursor-not-allowed"
                  >
                    {chipsetFilter}
                  </button>
                )}

                {seriesFilter && (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded cursor-not-allowed"
                  >
                    {seriesFilter}
                  </button>
                )}

                {vramFilter && (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded cursor-not-allowed"
                  >
                    {vramFilter}
                  </button>
                )}
              </div>
            </div>

            {filteredData.length === 0 ||
            !isShowData(chipsetFilter, seriesFilter, vramFilter) ? (
              <p className="text-gray-600">
                No data to display. Apply filters to see results.
              </p>
            ) : (
              <Fragment>
                {filteredData?.length > 0 &&
                  isShowData(chipsetFilter, seriesFilter, vramFilter) && (
                    <Fragment>
                      {" "}
                      {result}
                      {uploadTime && (
                        <div className="ml-auto md:pr-0 pr-36 text-xs">
                          Last Updated: {uploadTime}
                        </div>
                      )}
                    </Fragment>
                  )}
                {/* {filteredData?.length === 1 && <Fragment> {result}</Fragment>} */}
              </Fragment>
            )}
          </div>
        </div>
        <div className="flex justify-start mt-10 text-sm">
          <div dangerouslySetInnerHTML={{ __html: comment }} />
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
