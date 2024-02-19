import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
}) => {
  let spinnerSize = "h-6 w-6 border-4";
  if (size === "small") {
    spinnerSize = "h-4 w-4 border-2";
  } else if (size === "large") {
    spinnerSize = "h-8 w-8 border-4";
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-transparent border-primary-500 ${spinnerSize}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
