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
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useFetchComment from "../hooks/useFetchComment";
import { checkFilterAppy } from "../utils/helper";
import Filter from "../components/Filter/Filter";

const FilterComponent = () => {
  let navigate = useNavigate();
  const isAuthenticated = useAuth();
  const comment = useFetchComment();
  const { axiosInstance } = useAxiosWithErrorHandling();
  const { data, uploadTime } = useFetchContent(axiosInstance);

  const sellers = localStorage.getItem("sellers")
    ? JSON.parse(localStorage.getItem("sellers"))
    : [];

  const [chipsetFilter, setChipsetFilter] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("");
  const [vramFilter, setVramFilter] = useState("");
  const [filteredChipsets1, seChipsett1] = useState([]);
  const [filteredSeries1, setSeries1] = useState([]);
  const [filteredVram1, setVram1] = useState([]);

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

  const AdminButton = (
    <div className="flex mt-8">
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() => navigate(!isAuthenticated ? "/login" : "/admin")}
      >
        {!isAuthenticated ? "Sign In" : "Go to Dashboard"}
      </button>
    </div>
  );

  const heading = (
    <div className="flex flex-col text-center">
      <h1 className="text-2xl font-semibold">GPU Sell Price Tracker</h1>
      <p>
        Compare price from different websites in order to get most money for
        your used GPU
      </p>
    </div>
  );

  if (data?.length === 0) {
    return (
      <div className="flex py-6 flex-col gap-3 justify-center items-center">
        {heading}
        <h2 className="text-2xl font-semibold mb-4">No Data Found</h2>
        {AdminButton}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-[22%] p-4 bg-white border border-color-[#dee2e6] shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Filters </h2>

        <h2 className="font-bold text-base text-left"
         style={{ color: "#212529" }}
        >Chipset</h2>
        <Filter
          filtersTypes={filteredChipsets1}
          selectedFilterType={chipsetFilter}
          handleChange={handleChipsetChange}
        />

        <h2 className="font-bold text-base text-left "
         style={{ color: "#212529" }}
        >Series</h2>
        <Filter
          filtersTypes={filteredSeries1}
          selectedFilterType={seriesFilter}
          handleChange={handleSeriesChange}
        />

        <h2 className="font-bold text-base text-left"
         style={{ color: "#212529" }}
        >Vram</h2>
        <Filter
          filtersTypes={filteredVram1}
          selectedFilterType={vramFilter}
          handleChange={handleVramChange}
        />
      </div>

      <div className="w-2/3 p-4 flex flex-col">
        {heading}
        <div className="flex items-center gap-4 my-4 justify-between">
          <div className="flex items-center gap-4">
            {checkFilterAppy(chipsetFilter, seriesFilter, vramFilter) && (
              <button
                onClick={handleClearFilters}
                className="rounded-0 bg-white border px-5 py-2 font-bold"
              style={{ color: "#212529" }}
              >
              Clear all filters
              </button>
            )}

            {chipsetFilter && (
              <button
                disabled
               className="rounded-0 bg-[#DFE1E5] border  px-5 py-2 fw-bold btn btn-primary"
               style={{ color: "#212529" }}
              >
                {chipsetFilter}
              </button>
            )}

            {seriesFilter && (
              <button
                disabled
                 className="rounded-0 bg-[#DFE1E5] border text-dark px-5 py-2 fw-bold btn btn-primary"
                 style={{ color: "#212529" }}
              >
                {seriesFilter}
              </button>
            )}

            {vramFilter && (
              <button
                disabled
                 className="rounded-0 bg-[#DFE1E5] border text-dark px-5 py-2 fw-bold btn btn-primary"
                 style={{ color: "#212529" }}
              >
                {vramFilter}
              </button>
            )}
          </div>

          {AdminButton}
        </div>

        <h2 className="text-xl font-semibold mb-4">Results</h2>
        {filteredData.length === 0 ||
        !isShowData(chipsetFilter, seriesFilter, vramFilter) ? (
          <p className="text-gray-600">
            No data to display. Apply filters to see results.
          </p>
        ) : (
          <Fragment>
            {filteredData?.length > 1 &&
              isShowData(chipsetFilter, seriesFilter, vramFilter) && (
                <Fragment> {result}</Fragment>
              )}
            {filteredData?.length === 1 && <Fragment> {result}</Fragment>}
          </Fragment>
        )}

        <div className="mt-auto">
          <span className="text-xl font-semibold mb-4">Comments</span>
          <div dangerouslySetInnerHTML={{ __html: comment }} />
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
