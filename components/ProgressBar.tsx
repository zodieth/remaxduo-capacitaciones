import React from "react";

const ProgressBar = () => {
  return (
    <div className="w-72 mx-auto">
      <div className="h-1 w-full bg-blue-500 bg-opacity-20 overflow-hidden">
        <div className="progress-bar-value w-full h-full bg-blue-500"></div>
      </div>
      <style jsx>{`
        @keyframes indeterminateAnimation {
          0% {
            transform: translateX(0) scaleX(0);
          }
          40% {
            transform: translateX(0) scaleX(0.4);
          }
          100% {
            transform: translateX(100%) scaleX(0.5);
          }
        }

        .progress-bar-value {
          animation: indeterminateAnimation 1s infinite linear;
          transform-origin: 0% 50%;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
