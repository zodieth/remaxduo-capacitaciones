"use client";
import React from "react";
import Header from "./_components/header";
import Hero from "./_components/hero";
import { PropertyCarousel } from "./_components/propertycarousel";
import Footer from "./_components/footer";
import BeAgent from "./_components/beagent";

function page() {
  return (
    <div>
      <Header />
      <Hero />
      <div className="flex items-center justify-center mt-20 ">
        <h1 className="text-2xl font-extrabold text-gray-900 text-center md:text-4xl">
          ENCONTRÁ TU PROPIEDAD IDEAL
        </h1>
      </div>
      <PropertyCarousel />
      <BeAgent />
      <Footer />
    </div>
  );
}

export default page;
