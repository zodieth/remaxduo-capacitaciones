"use client";
import React from "react";
import Header from "./_components/header";
import Hero from "./_components/hero";
import { PropertyCarousel } from "./_components/propertycarousel";

function page() {
  return (
    <div>
      <Header />
      <Hero />
      <PropertyCarousel />
    </div>
  );
}

export default page;
