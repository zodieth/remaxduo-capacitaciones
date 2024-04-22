import React from "react";

function Hero() {
  return (
    <section className="relative ">
      <video
        className="fixed w-full h-4/6 object-cover md:h-5/6"
        loop
        autoPlay
        muted
        src={"./property-video.mp4"}
      />
      <div className="absolute inset-0 bg-black/25"></div>

      <div className="relative mx-auto max-w-screen-xl px-6 flex items-center py-[13rem] md:px-8 lg:px-12">
        <div className="max-w-xl text-left ltr:sm:text-left md:max-w-2xl">
          <h1 className="text-white text-5xl font-extrabold md:text-6xl lg:text-[5rem]">
            LÍDER MUNDIAL
            <strong className="block font-extrabold text-white">
              EN SERVICIOS INMOBILIARIOS
            </strong>
          </h1>

          <p className=" text-white mt-4 max-w-sm md:max-w-md lg:max-w-lg sm:text-xl/relaxed">
            En RE/MAX Up vas a tener la oportunidad de
            vender/comprar o alquilar tu propiedad, asistido por
            los número uno del país y de la región.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
