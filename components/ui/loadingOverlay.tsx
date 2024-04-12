import React from "react";
import LoadingSpinner from "./loadingSpinner";

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <LoadingSpinner size="large" />
    </div>
  );
};

export default LoadingOverlay;
