import React from "react";

function Hero() {
  return (
    <div className="flex items-center justify-center h-screen mb-12 bg-fixed bg-center bg-cover text-black">
      <video />
      <div className="absolute top-0 left-0 rigt-0 bottom-0 bg-black/70 z-[2]" />
      <div className="p-5 text-black z-[2]  mt-[-10rem]">
        <h2 className="text-5xl font-bold">Heading</h2>
        <p className="py-5 text-xl">aa</p>
      </div>
    </div>
  );
}

export default Hero;
