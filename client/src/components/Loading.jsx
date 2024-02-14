import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

const Loading = () => {
  const override = {
    color: "#005b7f",
    loading: true,
  };

  return (
    <div>
      <PulseLoader
        color={override.color}
        loading={override.loading}
        cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
