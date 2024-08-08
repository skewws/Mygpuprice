import { useState, useMemo, Fragment } from "react";
import useFetchContent from "../hooks/useFetchContent";
import { useAxiosWithErrorHandling } from "../api/axios";
import Loader from "../components/loader";
import ResultsTable from "../components/ResultsTable";
import FilterSection from "../components/FilterSection";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useFetchComment from "../hooks/useFetchComment";
import { checkFilterAppy } from "../utils/helper";

const Home = () => {
  let navigate = useNavigate();
  const isAuthenticated = useAuth();
  const comment = useFetchComment();

  const { axiosInstance, loading } = useAxiosWithErrorHandling();
  const { data, uploadTime } = useFetchContent(axiosInstance);
  const sellers = localStorage.getItem("sellers")
    ? JSON.parse(localStorage.getItem("sellers"))
    : [];

  const [filters, setFilters] = useState({
    Chipset: "",
    Series: "",
    VRAM: "",
  });

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      Chipset: "",
      Series: "",
      VRAM: "",
    });
  };

  const filterOptions = useMemo(() => {
    const uniqueOptions = {
      Chipset: [...new Set(data.map((item) => item.Chipset))],
      Series: [...new Set(data.map((item) => item.Series))],
      VRAM: [...new Set(data.map((item) => item.VRAM))],
    };
    return uniqueOptions;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (!filters.Chipset || item.Chipset === filters.Chipset) &&
        (!filters.Series || item.Series === filters.Series) &&
        (!filters.VRAM || item.VRAM === filters.VRAM)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const AdminButton = (
    <div className="flex mt-8">
      <button
      className="text-white px-4 py-2 rounded shadow hover:bg-green-700"
      style={{ backgroundColor: "#198754" }}
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <div className="w-full lg:w-1/3 p-4 bg-white shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Filters</h2>

        <FilterSection
          title="Chipset"
          options={filterOptions.Chipset}
          selectedValue={filters.Chipset}
          onChange={(value) => handleFilterChange("Chipset", value)}
        />

        <FilterSection
          title="Series"
          options={filterOptions.Series}
          selectedValue={filters.Series}
          onChange={(value) => handleFilterChange("Series", value)}
        />

        <FilterSection
          title="VRAM"
          options={filterOptions.VRAM}
          selectedValue={filters.VRAM}
          onChange={(value) => handleFilterChange("VRAM", value)}
        />
      </div>

      <div className="w-2/3 p-4 flex flex-col">
        {heading}
        <div className="flex items-center gap-4 my-4 justify-between">
          <div className="flex items-center gap-4">
            {checkFilterAppy(filters) && (
              <button
                onClick={handleClearFilters}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Filters
              </button>
            )}

            {Object.keys(filters)?.map((key) => (
              <Fragment key={key}>
                {filters[key] && (
                  <button
                    key={key}
                    disabled
                    className="bg-blue-600 text-white px-4 py-2 rounded opacity-[0.5]"
                  >
                    {filters[key]}
                  </button>
                )}
              </Fragment>
            ))}
          </div>

          {AdminButton}
        </div>

        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <ResultsTable
          sellers={sellers}
          filters={filters}
          uploadTime={uploadTime}
          filteredData={filteredData}
        />

        <div className="mt-auto">
          <span className="text-xl font-semibold mb-4">Comments</span>
          <div dangerouslySetInnerHTML={{ __html: comment }} />
        </div>
      </div>

      <Loader loading={loading} />
    </div>
  );
};

export default Home;
