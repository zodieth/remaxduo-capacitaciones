import React from "react";

function Hero() {
  return (
    <div className="relative">
      <video
        className="absolute w-full mb-12 bg-fixed bg-center bg-cover"
        loop
        autoPlay
        muted
        src={"./video-propiedades.mp4"}
      />

      <div className="absolute p-5 text-white z-[2] mt-[10rem] text-left max-w-[700px] mx-10">
        <div className="">
          <h2 className="text-7xl font-bold">
            LÍDER MUNDIAL EN SERVICIOS INMOBILIARIOS
          </h2>
          <p className="py-5 text-xl">
            En RE/MAX Up vas a tener la oportunidad de
            vender/comprar o alquilar tu propiedad, asistido por
            los número uno del país y de la región.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
