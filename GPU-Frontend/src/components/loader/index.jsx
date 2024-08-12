import BeatLoader from "react-spinners/BeatLoader";
import "./index.css";

const Loader = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="flex-container overlay">
          <BeatLoader color="#198754" loading={loading} size={30} />
        </div>
      )}
    </>
  );
};

export default Loader;
